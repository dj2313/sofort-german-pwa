'use client';

import { BookOpen, Mic as MicIcon, FileText, ChevronLeft, Target, Award, Zap } from 'lucide-react';
import { CEFR_METADATA, CefrLevel } from '@/core/constants/cefr';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CefrLevelDetail() {
  const params = useParams();
  const level = params.level as CefrLevel;
  const meta = CEFR_METADATA[level];

  const cards = [
    {
      id: 'structure',
      title: 'Structure',
      description: 'Grammar and Vocabulary Foundations',
      icon: <BookOpen size={40} />,
      color: '#4ade80',
      tag: 'LEARN'
    },
    {
      id: 'practice',
      title: 'Practice',
      description: 'Active Speaking & Flashcard Mastery',
      icon: <Target size={40} />,
      color: '#F5C518',
      tag: 'TRAIN'
    },
    {
      id: 'exam',
      title: 'Exam',
      description: 'Goethe-Zertifikat Readiness Test',
      icon: <Award size={40} />,
      color: '#f472b6',
      tag: 'TEST'
    }
  ];

  return (
    <main style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '48px', display: 'flex', flexDirection: 'column', gap: '8px' }} className="fade-in">
        <Link href="/cefr" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '16px' }}>
          <ChevronLeft size={16} /> Back to Levels
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '3.5rem', margin: 0, color: 'var(--accent-color)' }}>{level}</h1>
          <div style={{ height: '40px', width: '2px', background: 'var(--card-border)' }} />
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>{meta.focus}</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Goethe Institute Standards</p>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: '1.5' }}>{meta.description}</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {cards.map((card, idx) => (
          <Link
            key={card.id}
            href={`/cefr/${level}/${card.id}`}
            style={{ textDecoration: 'none' }}
            className="fade-in"
          >
            <div
              className="card"
              style={{
                padding: '40px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--card-border)',
                position: 'relative',
                animationDelay: `${idx * 0.1}s`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ color: card.color }}>
                  {card.icon}
                </div>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '100px',
                  background: `${card.color}20`,
                  color: card.color,
                  letterSpacing: '1px'
                }}>
                  {card.tag}
                </span>
              </div>

              <div>
                <h2 style={{ fontSize: '2rem', margin: '0 0 8px', color: 'var(--text-primary)' }}>
                  {card.title}
                </h2>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                  {card.description}
                </p>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Zap size={14} color={card.color} />
                <span>Start Session</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
