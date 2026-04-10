'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, CheckCircle, ChevronLeft, Circle } from 'lucide-react';

const LEVEL_TOPICS: Record<string, { title: string, description: string, completed: boolean }[]> = {
  'A1': [
    { title: 'Nouns & Articles', description: 'Definite vs indefinite, genders, and basic plurals', completed: true },
    { title: 'Pronouns', description: 'Personal pronouns and formal vs informal "you"', completed: true },
    { title: 'Verbs (Present Tense)', description: 'Conjugating regular and common irregular verbs', completed: false },
    { title: 'Sentence Structure', description: 'Word order in main clauses and questions', completed: false },
    { title: 'Cases: Nominative & Accusative', description: 'Subject vs direct object, basic prepositions', completed: false },
  ],
  'A2': [
    { title: 'Reflexive Verbs', description: 'Sich-verbs and their usage in everyday life', completed: false },
    { title: 'Dative Case', description: 'Indirect objects and dative prepositions', completed: false },
    { title: 'Infinitive with "zu"', description: 'Combining verbs with "zu" structures', completed: false },
    { title: 'Subordinate Clauses', description: 'Using "weil", "dass", and "wenn"', completed: false },
    { title: 'Comparative & Superlative', description: 'Adjective degrees (gut, besser, am besten)', completed: false },
  ],
  'B1': [
    { title: 'Passive Voice', description: 'The "werden + Partizip II" structure', completed: false },
    { title: 'Genitive Case', description: 'Possession and formal genitive prepositions', completed: false },
    { title: 'Relative Clauses', description: 'Adding detail to nouns with "der, die, das"', completed: false },
    { title: 'Konjunktiv II (Wishes)', description: 'Polite requests and hypothetical situations', completed: false },
    { title: 'Participial Attributes', description: 'Declinable adjectives derived from verbs', completed: false },
  ],
  'B2': [
    { title: 'Nominalization', description: 'Turning verbs and adjectives into formal nouns', completed: false },
    { title: 'Subjective Modals', description: 'Expressing hearsay and probability (sollen, wollen)', completed: false },
    { title: 'Fixed Prepositions', description: 'Verbs with specific prepositional requirements', completed: false },
    { title: 'Future II', description: 'Expressing assumptions about the past', completed: false },
    { title: 'Conjunctive Adverbs', description: 'Complex connectors (trotzdem, folglich, jedoch)', completed: false },
  ],
  'C1': [
    { title: 'Nuance & Style', description: 'Idiomatic expressions and formal register', completed: false },
    { title: 'Extended Attributes', description: 'Complex noun phrases with multiple layers', completed: false },
    { title: 'Scientific Structures', description: 'Academic language and logical deduction', completed: false },
  ],
  'C2': [
    { title: 'Universal Mastery', description: 'Philosophy, arts, and abstract discourse', completed: false },
  ]
};

export default function StructurePage() {
  const params = useParams();
  const level = (params.level as string).toUpperCase();

  const topics = LEVEL_TOPICS[level] || LEVEL_TOPICS['A1'];

  return (
    <main style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', minHeight: '100vh' }}>
      <header style={{ marginBottom: '48px' }} className="fade-in">
        <Link href={`/cefr/${level}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ChevronLeft size={14} /> Back to Module
        </Link>
        <h1 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(74, 222, 128, 0.1)', padding: '12px', borderRadius: '12px' }}>
            <BookOpen size={32} color="#4ade80" />
          </div>
          Structure <span style={{ color: 'var(--accent-color)', opacity: 0.5 }}>- {level}</span>
        </h1>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {topics.map((topic, index) => (
          <div
            key={index}
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '28px',
              background: 'rgba(255,255,255,0.02)',
              gap: '24px',
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div style={{ color: topic.completed ? '#4ade80' : 'rgba(255,255,255,0.1)' }}>
              {topic.completed ? <CheckCircle size={32} /> : <Circle size={32} />}
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.4rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{topic.title}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.4' }}>{topic.description}</p>
            </div>

            <button style={{
              padding: '12px 24px',
              borderRadius: '100px',
              background: topic.completed ? 'transparent' : 'var(--accent-color)',
              border: topic.completed ? '1px solid var(--card-border)' : 'none',
              color: topic.completed ? 'var(--text-secondary)' : '#000',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}>
              {topic.completed ? 'Review' : 'Start'}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
