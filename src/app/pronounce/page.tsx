'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { db, VocabEntry } from '@/lib/db';
import { Mic, MicOff, RotateCcw, SkipForward, CheckCircle, XCircle } from 'lucide-react';

export default function PronunciationCheck() {
  const [target, setTarget] = useState<VocabEntry | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'match' | 'miss'>('none');
  
  const recognitionRef = useRef<any>(null);

  const fetchRandom = useCallback(async () => {
    const all = await db.vocab.toArray();
    if (all.length > 0) {
      const rand = all[Math.floor(Math.random() * all.length)];
      setTarget(rand);
      setTranscript('');
      setFeedback('none');
    }
  }, []);

  useEffect(() => {
    fetchRandom();
    
    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'de-DE';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        checkMatch(text);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [fetchRandom]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setFeedback('none');
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start recognition', err);
      }
    }
  };

  const checkMatch = (spoken: string) => {
    if (!target) return;
    
    const normalize = (s: string) => s.toLowerCase().replace(/[.,!?;:]/g, '').trim();
    const targetNorm = normalize(target.german);
    const spokenNorm = normalize(spoken);

    if (spokenNorm.includes(targetNorm) || targetNorm.includes(spokenNorm)) {
      setFeedback('match');
    } else {
      setFeedback('miss');
    }
  };

  if (!target) return <main style={{ padding: '24px' }}>Loading word...</main>;

  return (
    <main style={{ padding: '24px', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>← Back</Link>
        <h1 style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>Pronunciation</h1>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '16px' }}>Sprich das Wort (Speak the word)</p>
        <h2 className="german-word" style={{ fontSize: '3.5rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
          {target.german}
        </h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>{target.english}</p>
      </div>

      {/* Feedback Area */}
      <div style={{ height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
        {transcript && (
          <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '8px' }}>
            &quot;{transcript}&quot;
          </p>
        )}
        {feedback === 'match' && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontWeight: 700 }}><CheckCircle size={20} /> Perfekt!</div>}
        {feedback === 'miss' && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: 700 }}><XCircle size={20} /> Try again...</div>}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
        <button 
          onClick={toggleListening}
          style={{ 
            width: '100px', height: '100px', 
            borderRadius: '50%', 
            backgroundColor: isListening ? '#f87171' : 'var(--accent-color)',
            color: '#000',
            border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: isListening ? '0 0 20px rgba(248, 113, 113, 0.4)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          {isListening ? <MicOff size={40} /> : <Mic size={40} fill="currentColor" />}
        </button>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={() => { setTranscript(''); setFeedback('none'); }}
            style={{ 
              backgroundColor: 'var(--card-bg)', 
              border: '1px solid var(--card-border)', 
              color: 'var(--text-primary)',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <RotateCcw size={18} /> Retry
          </button>
          
          <button 
            onClick={fetchRandom}
            style={{ 
              backgroundColor: 'var(--text-primary)', 
              border: 'none', 
              color: 'var(--bg-color)',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
              fontWeight: 700
            }}
          >
            Next Word <SkipForward size={18} />
          </button>
        </div>
      </div>

      {!((window as any).webkitSpeechRecognition || (window as any).SpeechRecognition) && (
        <p style={{ marginTop: '32px', color: '#f87171', fontSize: '0.8rem', textAlign: 'center' }}>
          Speech Recognition is not supported in this browser. Please try Chrome, Edge, or Safari.
        </p>
      )}
    </main>
  );
}
