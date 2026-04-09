import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { VocabEntry } from './db';

// Setting worker path safely for Next.js environment
if (typeof window !== 'undefined') {
  // Use a more reliable CDN link and exact version
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
}

export async function extractPDFText(file: File): Promise<string> {
  console.log('PDF: Starting extraction for', file.name);
  const arrayBuffer = await file.arrayBuffer();
  
  try {
    const pdf = await pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    }).promise;
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        
        // Sort items: Y descending (top to bottom), then X ascending (left to right)
        // This ensures the scanner reads the page exactly as it appears visually
        const items = (content.items as any[]).sort((a, b) => {
            const yDiff = b.transform[5] - a.transform[5];
            if (Math.abs(yDiff) > 5) return yDiff; // Significant Y difference = new line
            return a.transform[4] - b.transform[4]; // Same line, sort by X
        });

        let lastY = -1;
        let lastX = -1;
        let pageText = '';
        
        for (const item of items) {
            const currentY = item.transform[5];
            const currentX = item.transform[4];

            // 1. Vertical shift = New line
            if (lastY !== -1 && Math.abs(currentY - lastY) > 5) {
                pageText += '\n';
                lastX = -1;
            } 
            // 2. Horizontal gap on same line = Potential new column
            else if (lastX !== -1 && (currentX - lastX) > 50) {
                pageText += '    '; // Insert gap for the regex to pick up
            }
            
            pageText += item.str + ' ';
            lastY = currentY;
            lastX = currentX + (item.width || item.str.length * 5) + 5;
        }

        fullText += pageText + '\n';
        console.log(`PDF: Processed page ${i}/${pdf.numPages}`);
    }
    
    return fullText;
  } catch (err) {
    console.error('PDF Extraction Error:', err);
    throw err;
  }
}

export function parseVocabPairs(text: string): Partial<VocabEntry>[] {
  console.log('PDF: Parsing text content, length:', text.length);
  const candidates: Partial<VocabEntry>[] = [];
  
  // Split the extracted text into individual lines
  const lines = text.split('\n');
  
  lines.forEach(line => {
    const cleanLine = line.trim();
    // Lowered threshold to 3 to capture short German words like 'du', 'ich', 'er'
    if (!cleanLine || cleanLine.length < 3) return;

    // Ignore headers usually found in textbooks
    if (/^(Kapitel|Modul|Seite|Page|Unit|Lektion|Glossar|Wortschatz)/i.test(cleanLine)) return;
    if (/^\d+[abc]?\s/.test(cleanLine)) return; // Matches "1a ", "2b " noise

    let german = '';
    let english = '';

    // Strategy 1: Look for explicit separators like - or :
    const sepMatch = cleanLine.match(/([^:\-\|–]+)\s*[:\-\|–]\s*([^:\-\|–\n]+)/);
    
    // Strategy 2: Look for large whitespace gaps (Column-style parsing)
    // Decreased gap sensitivity to 2+ spaces as textbook OCR can be tight
    const gapMatch = cleanLine.match(/^(.+?)\s{2,}(.+)$/);

    if (sepMatch) {
        german = sepMatch[1].trim();
        english = sepMatch[2].trim();
    } else if (gapMatch) {
        german = gapMatch[1].trim();
        english = gapMatch[2].trim();
    }

    if (german && english) {
        // Validation: Verify the German side has German characters or common articles
        const isLikelyGerman = /(der|die|das|[,äöüß])|([A-Z][a-z]+)/.test(german);
        
        if (isLikelyGerman && german.length < 100 && english.length < 100) {
            candidates.push({
                german,
                english,
                source: 'imported',
                level: 'custom',
                exampleDe: '-',
                exampleEn: '-'
            });
        }
    }
  });

  console.log(`PDF: Found ${candidates.length} candidates`);
  
  // Deduplicate using lowercased German as key to prevent exact duplicates
  const unique = Array.from(
    new Map(
        candidates
            .filter(item => !!item.german)
            .map(item => [item.german!.toLowerCase(), item])
    ).values()
  );
  return unique;
}
