'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { db, VocabEntry } from '@/lib/db';
import { TTSService } from '@/lib/tts';
import { Play, Pause, EyeOff, Eye, SkipForward } from 'lucide-react';

export default function ShadowListen() {
  const [vocab, setVocab] = useState<VocabEntry[]>([]);
  const [level, setLevel] = useState<'all' | 'A1' | 'A2' | 'custom'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showText, setShowText] = useState(true);
  const [pauseDuration, setPauseDuration] = useState(2); // seconds
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopLoop = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    TTSService.stop();
  }, []);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setIsLoading(true);
      let query = db.vocab.toCollection();
      if (level !== 'all') {
          query = db.vocab.where('level').equals(level);
      }
      const all = await query.toArray();
      const shuffled = all.sort(() => 0.5 - Math.random()).slice(0, 50);
      if (active) {
          setVocab(shuffled);
          setCurrentIndex(0);
          setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
      stopLoop();
    };
  }, [stopLoop, level]);

  const handleNext = useCallback(() => {
    stopLoop();
    setCurrentIndex(prev => (prev + 1) % (vocab.length || 1));
  }, [stopLoop, vocab.length]);

  const playCurrent = useCallback(() => {
    if (!vocab.length) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    const entry = vocab[currentIndex];
    
    // Speak German
    TTSService.speak(entry.german);
    
    // Set timer for the next word
    timerRef.current = setTimeout(() => {
      handleNext();
    }, (pauseDuration * 1000) + 2000); // Wait for speech approx + pause
  }, [vocab, currentIndex, pauseDuration, handleNext]);

  useEffect(() => {
    if (isPlaying && vocab.length > 0) {
      playCurrent();
    }
  }, [currentIndex, isPlaying, playCurrent, vocab.length]);

  const togglePlay = () => {
    if (isPlaying) {
      stopLoop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  if (isLoading) {
    return <main style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading vocabulary...</main>;
  }

  const currentWord = vocab[currentIndex];

  return (
    <main style={{ padding: '24px', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>← Back</Link>
          <h1 style={{ color: 'var(--text-primary)' }}>Shadow Listen</h1>
        </div>
        <button 
          onClick={() => setShowText(!showText)}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
        >
          {showText ? <Eye size={24} /> : <EyeOff size={24} />}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
        {(['all', 'A1', 'A2', 'custom'] as const).map(lvl => (
          <button 
            key={lvl}
            onClick={() => setLevel(lvl)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid var(--card-border)',
              backgroundColor: level === lvl ? 'var(--accent-color)' : 'transparent',
              color: level === lvl ? '#000' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {lvl.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '24px' }}>
        {vocab.length > 0 ? (
          <>
            <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>
              Word {currentIndex + 1} of {vocab.length}
            </p>
            
            {showText ? (
              <div style={{ textAlign: 'center' }}>
                <h2 className="german-word" style={{ fontSize: '3rem', color: 'var(--accent-color)', marginBottom: '8px' }}>
                  {vocab[currentIndex].german}
                </h2>
                <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>{vocab[currentIndex].english}</p>
              </div>
            ) : (
              <div style={{ height: '140px', display: 'flex', alignItems: 'center' }}>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Text hidden for ear training</p>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
             <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                No words found for the <strong>{level}</strong> level.
             </p>
             <Link href="/import" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 700 }}>
                Import some PDFs →
             </Link>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Interval (between words)</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--accent-color)' }}>{pauseDuration}s</span>
          </div>
          <input 
            type="range" 
            min="1" max="5" step="0.5" 
            value={pauseDuration}
            onChange={(e) => setPauseDuration(parseFloat(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button 
            onClick={togglePlay}
            style={{ 
              width: '64px', height: '64px', 
              borderRadius: '50%', 
              backgroundColor: isPlaying ? 'var(--card-bg)' : 'var(--accent-color)',
              color: isPlaying ? '#FFF' : '#000',
              border: isPlaying ? '2px solid var(--card-border)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} fill="currentColor" />}
          </button>
          
          <button 
            onClick={handleNext}
            style={{ 
              width: '64px', height: '64px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--card-bg)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--card-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <SkipForward size={24} />
          </button>
        </div>
      </div>
    </main>
  );
}
