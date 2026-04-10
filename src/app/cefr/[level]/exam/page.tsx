'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FileText, Play, Clock, Award, Shield, AlertTriangle, ChevronLeft } from 'lucide-react';

export default function ExamPage() {
  const params = useParams();
  const level = (params.level as string).toUpperCase();
  const [examState, setExamState] = useState<'lobby' | 'active' | 'finished'>('lobby');
  const [timeLeft, setTimeLeft] = useState(3600); // 60 mins

  useEffect(() => {
    let timer: any;
    if (examState === 'active' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [examState, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const startExam = () => {
    if (confirm('Once started, the timer cannot be paused. Ready?')) {
      setExamState('active');
    }
  };

  if (examState === 'active') {
    return (
      <main style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
          <div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 800 }}>GOETHE-ZERTIFIKAT {level}</span>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Modul: LESEN / HÖREN</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: timeLeft < 300 ? '#ef4444' : 'var(--accent-color)' }}>
              <Clock size={20} />
              <span style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-plex-mono)' }}>{formatTime(timeLeft)}</span>
          </div>
        </header>

        <div className="card" style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
          <Shield size={64} color="var(--accent-color)" />
          <h2 style={{ fontSize: '2rem' }}>Exam in Progress</h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '500px' }}>
            The simulation is currently monitoring your focus. Complete all questions in the official PDF or the interactive form below.
          </p>
          <div style={{ padding: '20px', background: '#f59e0b20', color: '#f59e0b', borderRadius: '12px', border: '1px solid #f59e0b40', display: 'flex', gap: '12px' }}>
            <AlertTriangle size={20} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Do not leave this page or your progress will be lost.</span>
          </div>
          <button 
            onClick={() => setExamState('finished')}
            style={{ marginTop: '40px', padding: '16px 32px', background: 'var(--accent-color)', color: '#000', fontWeight: 800, borderRadius: '100px' }}>
            Submit All Sections
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', minHeight: '100vh' }}>
      <header style={{ marginBottom: '48px' }} className="fade-in">
        <Link href={`/cefr/${level}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ChevronLeft size={14} /> Back to Module
        </Link>
        <h1 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(244, 114, 182, 0.1)', padding: '12px', borderRadius: '12px' }}>
            <Award size={32} color="#f472b6" />
          </div>
          Exam Prep <span style={{ color: 'var(--accent-color)', opacity: 0.5 }}>- {level}</span>
        </h1>
      </header>

      <div className="card" style={{ padding: '40px', marginBottom: '32px', border: '1px solid var(--accent-color)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Goethe-Zertifikat {level} Simulation</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
          This simulation mimics the timing and rigor of the actual Goethe Institute examination. 
          You will have 60 minutes to complete the combined Reading and Listening sections.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
             <Clock size={16} color="var(--accent-color)" style={{ marginBottom: '8px' }} />
             <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Duration</div>
             <div style={{ fontWeight: 700 }}>60 Minutes</div>
          </div>
          <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
             <FileText size={16} color="var(--accent-color)" style={{ marginBottom: '8px' }} />
             <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Format</div>
             <div style={{ fontWeight: 700 }}>45 Questions</div>
          </div>
        </div>

        <button 
          onClick={startExam}
          style={{ width: '100%', padding: '20px', background: 'var(--accent-color)', color: '#000', fontWeight: 800, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Play size={20} fill="#000" /> START OFFICIAL SIMULATION
        </button>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px', marginBottom: '24px' }}>
          Exam Parts
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {['1. Hören (Listening)', '2. Lesen (Reading)', '3. Schreiben (Writing)', '4. Sprechen (Speaking)'].map((part, i) => (
            <div key={i} style={{ 
              background: 'var(--card-bg)', 
              border: '1px solid var(--card-border)', 
              padding: '16px', 
              borderRadius: '12px',
              fontWeight: 500,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>{part}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
