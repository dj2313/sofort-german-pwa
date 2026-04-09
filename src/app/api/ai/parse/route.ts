import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { text, type } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // Model selection: Llama 3.1 70B is excellent for pattern recognition and cleanup
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a German language textbook assistant. 
          Your task is to extract vocabulary pairs from the provided text.
          
          RULES:
          1. Extract German word and its English meaning.
          2. Include articles (der, die, das) if present.
          3. Return a JSON object with a single key "vocabulary" containing an array of objects.
          
          OUTPUT FORMAT:
          {
            "vocabulary": [
              {"german": "der Tisch", "english": "table"}
            ]
          }`
        },
        {
          role: 'user',
          content: `Extract vocabulary from this text: \n\n${text}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1, 
      response_format: { type: "json_object" }
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) throw new Error('Empty response from Groq');

    const parsed = JSON.parse(responseContent);
    
    // Safety check: ensure we extract the array regardless of what key the AI chose
    let vocabList = [];
    if (Array.isArray(parsed)) {
        vocabList = parsed;
    } else if (parsed.vocabulary && Array.isArray(parsed.vocabulary)) {
        vocabList = parsed.vocabulary;
    } else {
        // Fallback: look for any array inside the object
        const firstArray = Object.values(parsed).find(val => Array.isArray(val));
        vocabList = Array.isArray(firstArray) ? firstArray : [];
    }

    return NextResponse.json(vocabList);
  } catch (error: any) {
    console.error('Groq API Error:', error);
    return NextResponse.json({ error: 'AI processing failed' }, { status: 500 });
  }
}
