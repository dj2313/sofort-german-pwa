'use client';

import { useState } from 'react';
import Link from 'next/link';
import { extractPDFText, parseVocabPairs } from '@/lib/pdfParser';
import { db, VocabEntry } from '@/lib/db';
import { Upload, CheckCircle2 } from 'lucide-react';

export default function ImportPage() {
  const [parsing, setParsing] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [candidates, setCandidates] = useState<Partial<VocabEntry>[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [successMsg, setSuccessMsg] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsing(true);
    setSuccessMsg('');
    try {
      const text = await extractPDFText(file);
      let parsed: Partial<VocabEntry>[] = [];

      if (useAI) {
          console.log("PDF: Using AI Boost (Groq)...");
          const res = await fetch('/api/ai/parse', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text })
          });
          if (!res.ok) throw new Error('AI parsing failed');
          parsed = await res.json();
      } else {
          parsed = parseVocabPairs(text);
      }

      if (parsed.length === 0) {
        alert("We couldn't find any clear vocabulary patterns. Try enabling 'AI Boost' for better results with complex layouts.");
      }
      setCandidates(parsed);
      setSelectedIndices(new Set(parsed.map((_, i) => i))); 
    } catch (err) {
      console.error(err);
      alert('Failed to process PDF. Check your connection or API key.');
    } finally {
      setParsing(false);
    }
  };

  const toggleSelection = (index: number) => {
    const next = new Set(selectedIndices);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setSelectedIndices(next);
  };

  const handleSave = async () => {
    const toSave = candidates.filter((_, i) => selectedIndices.has(i)).map(c => ({
      ...c,
      id: crypto.randomUUID(),
      addedAt: new Date()
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.vocab.bulkAdd(toSave as any);
    setSuccessMsg(`${toSave.length} words added to your vocab bank!`);
    setCandidates([]);
  };

  return (
    <main style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>← Back</Link>
        <h1 style={{ color: 'var(--text-primary)' }}>Import Vocabulary</h1>
      </div>

      {!candidates.length && !successMsg && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 16px', gap: '16px' }}>
          <Upload size={48} color="var(--text-secondary)" />
          <h2 style={{ fontSize: '1.2rem' }}>Upload PDF</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            We&apos;ll completely scan the PDF offline or use AI to extract patterns.
          </p>

          <div 
            onClick={() => setUseAI(!useAI)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', 
              padding: '12px 20px', borderRadius: '30px', 
              backgroundColor: useAI ? 'rgba(245, 197, 24, 0.1)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${useAI ? 'var(--accent-color)' : 'var(--card-border)'}`,
              cursor: 'pointer', transition: 'all 0.3s', marginBottom: '8px'
            }}
          >
            <div style={{ 
              width: '16px', height: '16px', borderRadius: '50%', 
              backgroundColor: useAI ? 'var(--accent-color)' : 'transparent',
              border: '2px solid var(--accent-color)',
              boxShadow: useAI ? '0 0 10px var(--accent-color)' : 'none'
            }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: useAI ? 'var(--accent-color)' : 'var(--text-primary)' }}>
              Enable AI Boost (Groq)
            </span>
          </div>
          
          <label style={{ cursor: 'pointer', backgroundColor: 'var(--accent-color)', color: '#000', padding: '12px 24px', borderRadius: '4px', fontWeight: 600 }}>
            {parsing ? 'Scanning...' : 'Select PDF File'}
            <input type="file" accept="application/pdf" style={{ display: 'none' }} disabled={parsing} onChange={handleFileUpload} />
          </label>
        </div>
      )}

      {successMsg && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', borderColor: 'green' }}>
          <CheckCircle2 color="green" size={48} />
          <h2 style={{ color: 'green' }}>Success!</h2>
          <p>{successMsg}</p>
          <button onClick={() => setSuccessMsg('')} style={{ color: 'var(--accent-color)', marginTop: '16px', fontWeight: 'bold' }}>Import Another</button>
        </div>
      )}

      {candidates.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>Preview Words ({selectedIndices.size}/{candidates.length})</h2>
            <button 
              onClick={handleSave}
              style={{ backgroundColor: 'var(--accent-color)', color: '#000', padding: '8px 16px', borderRadius: '4px', fontWeight: 600 }}
            >
              Save Selected
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '500px', overflowY: 'auto' }}>
            {Array.isArray(candidates) && candidates.map((cand, i) => (
              <div 
                key={i} 
                className="card"
                onClick={() => toggleSelection(i)}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', opacity: selectedIndices.has(i) ? 1 : 0.5, padding: '12px 16px' }}
              >
                <input 
                  type="checkbox" 
                  checked={selectedIndices.has(i)}
                  readOnly
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <div>
                  <h3 className="german-word" style={{ color: 'var(--accent-color)', fontSize: '1.2rem' }}>{cand.german}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>{cand.english}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
