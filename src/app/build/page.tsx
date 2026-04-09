'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { db, VocabEntry } from '@/lib/db';
import { TTSService } from '@/lib/tts';
import { Play, RotateCcw, Search, PlusCircle, XCircle } from 'lucide-react';

const HELPERS = ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie/Sie', 'ist', 'sind', 'habe', 'hast', 'hat', 'nicht', 'und', 'aber', 'oder', 'der', 'die', 'das'];

export default function SentenceBuilder() {
  const [tokens, setTokens] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<VocabEntry[]>([]);

  const handleSearch = useCallback(async (q: string) => {
    setSearch(q);
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }
    const results = await db.vocab
      .filter(v => v.german.toLowerCase().includes(q.toLowerCase()))
      .limit(5)
      .toArray();
    setSearchResults(results);
  }, []);

  const addToken = (token: string) => {
    setTokens(prev => [...prev, token]);
    setSearch('');
    setSearchResults([]);
  };

  const removeToken = (index: number) => {
    setTokens(prev => prev.filter((_, i) => i !== index));
  };

  const speakSentence = () => {
    const sentence = tokens.join(' ');
    TTSService.speak(sentence);
  };

  return (
    <main style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>← Back</Link>
        <h1 style={{ color: 'var(--text-primary)' }}>Sentence Builder</h1>
      </div>

      {/* Construction Area */}
      <div 
        className="card" 
        style={{ 
          minHeight: '120px', 
          marginBottom: '24px', 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '8px', 
          padding: '20px',
          alignItems: 'center',
          backgroundColor: tokens.length ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
          borderStyle: tokens.length ? 'solid' : 'dashed'
        }}
      >
        {tokens.length === 0 && (
          <p style={{ color: 'var(--text-secondary)', width: '100%', textAlign: 'center' }}>
            Add words below to start building...
          </p>
        )}
        {tokens.map((token, i) => (
          <div 
            key={i} 
            onClick={() => removeToken(i)}
            style={{ 
              backgroundColor: 'var(--accent-color)', 
              color: '#000', 
              padding: '6px 12px', 
              borderRadius: '20px', 
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {token} <XCircle size={14} />
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <button 
          onClick={speakSentence} 
          disabled={!tokens.length}
          style={{ 
            flex: 2,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px',
            backgroundColor: tokens.length ? 'var(--text-primary)' : 'var(--card-border)',
            color: 'var(--bg-color)',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: 700,
            cursor: tokens.length ? 'pointer' : 'default'
          }}
        >
          <Play size={20} fill="currentColor" /> Speak Sentence
        </button>
        <button 
          onClick={() => setTokens([])}
          style={{ 
            flex: 1,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px',
            border: '1px solid var(--card-border)',
            color: 'var(--text-primary)',
            padding: '12px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={18} /> Reset
        </button>
      </div>

      {/* Helper Palette */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Helper Palette</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {HELPERS.map(h => (
            <button 
              key={h} 
              onClick={() => addToken(h)}
              style={{ 
                padding: '4px 10px', 
                backgroundColor: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--card-border)', 
                borderRadius: '4px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* Search/Add Section */}
      <div>
        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Add Vocabulary</h3>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search words..." 
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          />
        </div>
        
        {searchResults.length > 0 && (
          <div className="card" style={{ marginTop: '8px', padding: '8px' }}>
            {searchResults.map(res => (
              <div 
                key={res.id} 
                onClick={() => addToken(res.german)}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '8px 12px', 
                  cursor: 'pointer',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255,255,255,0.02)'
                }}
              >
                <span>{res.german} <small style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>({res.english})</small></span>
                <PlusCircle size={18} color="var(--accent-color)" />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
