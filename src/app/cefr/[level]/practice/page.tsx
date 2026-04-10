'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Mic, Layers, ChevronRight, ChevronLeft, RotateCw, BookOpen } from 'lucide-react';
import { db, VocabEntry } from '@/lib/db';
import { TTSService } from '@/lib/tts';
import { SPEAKING_TASKS } from '@/core/constants/cefr';

export default function PracticePage() {
  const params = useParams();
  const level = (params.level as string).toUpperCase();

  const [activeTab, setActiveTab] = useState<'learn' | 'flashcards' | 'speaking'>('learn');
  const [activeTeil, setActiveTeil] = useState(0);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [vocab, setVocab] = useState<VocabEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const levelTasks = SPEAKING_TASKS[level] || SPEAKING_TASKS['A1'];
  const currentTask = levelTasks[activeTeil] || levelTasks[0];
  const activeTopic = currentTask.topics?.find((t) => t.id === activeTopicId);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const startConversation = (topicId: string) => {
    const topic = currentTask.topics?.find((t) => t.id === topicId);
    setActiveTopicId(topicId);
    setMessages([
      {
        role: 'ai',
        text: `Hallo! Sollen wir ${topic?.title.toLowerCase()}? Wann hast du Zeit?`,
      },
    ]);
    setFeedback(null);
  };

  const stopConversation = () => {
    setActiveTopicId(null);
    setMessages([]);
    setFeedback(null);
  };

  useEffect(() => {
    const loadVocab = async () => {
      let data = await db.vocab.where('level').equalsIgnoreCase(level).toArray();
      if (data.length === 0) {
        data = [
          { id: '1', german: 'Der Apfel', english: 'The apple', exampleDe: 'Ich esse einen Apfel.', exampleEn: 'I am eating an apple.', level, source: 'sys', addedAt: new Date(), article: 'der' },
          { id: '2', german: 'Das Haus', english: 'The house', exampleDe: 'Das Haus ist gross.', exampleEn: 'The house is big.', level, source: 'sys', addedAt: new Date(), article: 'das' },
          { id: '3', german: 'Die Schule', english: 'The school', exampleDe: 'Wir gehen zur Schule.', exampleEn: 'We are going to school.', level, source: 'sys', addedAt: new Date(), article: 'die' },
          { id: '4', german: 'Guten Tag', english: 'Good day', exampleDe: 'Guten Tag, Herr Schmidt.', exampleEn: 'Good day, Mr. Schmidt.', level, source: 'sys', addedAt: new Date() },
          { id: '5', german: 'Auf Wiedersehen', english: 'Goodbye', exampleDe: 'Auf Wiedersehen, bis bald!', exampleEn: 'Goodbye, see you soon!', level, source: 'sys', addedAt: new Date() },
        ];
      }
      setVocab(data);
    };
    loadVocab();
  }, [level]);

  const currentCard = vocab[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev + 1) % vocab.length), 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev - 1 + vocab.length) % vocab.length), 150);
  };

  const handleSpeak = (text?: string) => {
    if (currentCard) TTSService.speak(text || currentCard.german, 0.9);
  };

  const toggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setFeedback(null);
      return;
    }
    setIsRecording(true);
    setFeedback('Listening...');
    setTimeout(() => {
      setIsRecording(false);
      setFeedback('Perfect! Your German sounds authentic.');
      if (activeTopicId) {
        setMessages((prev) => [...prev, { role: 'user', text: 'Ich habe am Samstag Zeit. Geht das?' }]);
        setTimeout(() => {
          setMessages((prev) => [...prev, { role: 'ai', text: 'Ja, Samstag passt mir gut. Wo sollen wir das machen?' }]);
        }, 1200);
      }
    }, 2500);
  };

  const TABS = [
    { id: 'learn', label: 'Learn', icon: <BookOpen size={18} /> },
    { id: 'flashcards', label: 'Flashcards', icon: <Layers size={18} /> },
    { id: 'speaking', label: 'Speaking', icon: <Mic size={18} /> },
  ];

  return (
    <main style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ marginBottom: '32px' }} className="fade-in">
        <Link href={`/cefr/${level}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ChevronLeft size={14} /> Back to Module
        </Link>
        <h1 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Practice Hub <span style={{ color: 'var(--accent-color)' }}>{level}</span>
        </h1>
      </header>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'learn' | 'flashcards' | 'speaking')}
            style={{
              flex: 1, padding: '12px', borderRadius: '8px',
              background: activeTab === tab.id ? 'var(--accent-color)' : 'transparent',
              color: activeTab === tab.id ? '#000' : 'var(--text-secondary)',
              fontWeight: 700, fontSize: '0.9rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s', border: 'none', cursor: 'pointer',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="fade-in">

        {/* ── LEARN TAB ── */}
        {activeTab === 'learn' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Vocabulary for {level}
            </h2>
            {vocab.map((item) => (
              <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: 'rgba(255,255,255,0.02)' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', margin: 0, fontFamily: 'var(--font-plex-mono)' }}>
                    {item.article && <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginRight: '8px' }}>{item.article}</span>}
                    {item.german}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0', fontSize: '0.95rem' }}>{item.english}</p>
                </div>
                <button onClick={() => handleSpeak(item.german)} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--card-border)', color: 'var(--text-primary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RotateCw size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── FLASHCARDS TAB ── */}
        {activeTab === 'flashcards' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <div style={{ perspective: '1000px', width: '100%', maxWidth: '420px', height: '380px', marginBottom: '40px', cursor: 'pointer' }} onClick={() => setIsFlipped(!isFlipped)}>
              <div style={{ width: '100%', height: '100%', transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)', transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)', position: 'relative' }}>
                {/* Front */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: 'auto', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem', fontWeight: 800 }}>English</p>
                  <h2 style={{ fontSize: '3rem', textAlign: 'center', margin: 0, color: 'var(--text-primary)', fontWeight: 700 }}>{currentCard?.english}</h2>
                  <div style={{ marginTop: 'auto', color: 'rgba(255,255,255,0.2)', fontSize: '0.9rem' }}>Tap to reveal German</div>
                </div>
                {/* Back */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: 'rgba(245,197,24,0.03)', border: '2px solid var(--accent-color)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', transform: 'rotateY(180deg)', boxShadow: '0 0 50px rgba(245,197,24,0.1)' }}>
                  <p style={{ color: 'var(--accent-color)', marginBottom: 'auto', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem', fontWeight: 800 }}>German</p>
                  <h2 style={{ fontSize: '3.5rem', textAlign: 'center', margin: '0 0 16px', color: 'var(--text-primary)', fontFamily: 'var(--font-plex-mono)', fontWeight: 600 }}>{currentCard?.german}</h2>
                  <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1.1rem', fontStyle: 'italic', maxWidth: '300px' }}>"{currentCard?.exampleDe}"</p>
                  <div style={{ marginTop: 'auto' }}>
                    <button onClick={(e) => { e.stopPropagation(); handleSpeak(); }} style={{ background: 'var(--accent-color)', color: '#000', padding: '10px 20px', borderRadius: '100px', fontWeight: 700, fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}>
                      Listen Pronunciation
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <button onClick={handlePrev} className="card" style={{ width: '64px', height: '64px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}><ChevronLeft size={24} /></button>
              <div style={{ fontFamily: 'var(--font-plex-mono)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {currentIndex + 1} <span style={{ opacity: 0.3 }}>/</span> {vocab.length}
              </div>
              <button onClick={handleNext} className="card" style={{ width: '64px', height: '64px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}><ChevronRight size={24} /></button>
            </div>
          </div>
        )}

        {/* ── SPEAKING TAB ── */}
        {activeTab === 'speaking' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', flex: 1 }}>

            {/* Teil Selector */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {levelTasks.map((task, idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveTeil(idx); setActiveTopicId(null); setFeedback(null); setMessages([]); }}
                  style={{
                    padding: '10px 22px', borderRadius: '100px', cursor: 'pointer',
                    background: activeTeil === idx ? 'var(--accent-color)' : 'rgba(255,255,255,0.03)',
                    color: activeTeil === idx ? '#000' : 'var(--text-secondary)',
                    fontWeight: 800, fontSize: '0.8rem', letterSpacing: '1px',
                    border: activeTeil === idx ? 'none' : '1px solid var(--card-border)',
                    transition: 'all 0.2s',
                  }}
                >
                  TEIL {idx + 1}
                </button>
              ))}
            </div>

            {/* Task Info Bar */}
            <div style={{ textAlign: 'center', padding: '0 16px' }}>
              <span style={{ color: 'var(--accent-color)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>{currentTask.title}</span>
              <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0', fontSize: '0.9rem' }}>{currentTask.description}</p>
            </div>

            {/* ── CONVERSATION MODE (A2 Teil 3 with topics) ── */}
            {activeTopicId ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="fade-in">
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button onClick={stopConversation} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <ChevronLeft size={16} /> Back to Topics
                  </button>
                  <span style={{ color: 'var(--accent-color)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px' }}>PARTNER SIMULATION</span>
                </div>

                {/* Context Card with sub-points */}
                <div className="card" style={{ padding: '24px', background: 'rgba(245,197,24,0.04)', border: '1px solid rgba(245,197,24,0.3)' }}>
                  <h3 style={{ margin: '0 0 12px', color: 'var(--accent-color)', fontSize: '1rem', fontWeight: 700 }}>{activeTopic?.title}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {activeTopic?.points.map((p, i) => (
                      <span key={i} style={{ fontSize: '0.85rem', padding: '4px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Chat Area */}
                <div ref={chatRef} style={{ height: '320px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', padding: '8px 4px', background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      style={{
                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '78%',
                        padding: '12px 18px',
                        borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: m.role === 'user' ? 'var(--accent-color)' : 'rgba(255,255,255,0.06)',
                        color: m.role === 'user' ? '#000' : 'var(--text-primary)',
                        fontWeight: m.role === 'user' ? 600 : 400,
                        fontSize: '1rem',
                        lineHeight: '1.5',
                        margin: '0 8px',
                      }}
                    >
                      {m.role === 'ai' && <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: 700 }}>PARTNER</span>}
                      {m.text}
                    </div>
                  ))}
                </div>

                {/* Mic Control */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                  <div style={{ position: 'relative' }}>
                    {isRecording && <div style={{ position: 'absolute', inset: '-14px', borderRadius: '50%', border: '2px solid var(--accent-color)', animation: 'pulse 1.5s infinite ease-out' }} />}
                    <button
                      onClick={toggleRecord}
                      style={{
                        width: '80px', height: '80px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                        background: isRecording ? '#ef4444' : 'var(--accent-color)',
                        color: isRecording ? '#fff' : '#000',
                        boxShadow: isRecording ? '0 0 30px rgba(239,68,68,0.4)' : '0 8px 24px rgba(245,197,24,0.25)',
                        transition: 'all 0.3s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Mic size={32} />
                    </button>
                  </div>
                  {feedback && <p style={{ margin: 0, color: feedback.includes('Perfect') ? '#4ade80' : 'var(--text-secondary)', fontWeight: 600, fontSize: '0.95rem' }}>{feedback}</p>}
                  {!isRecording && !feedback && <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Tap to speak your response in German</span>}
                </div>
              </div>

            ) : currentTask.topics ? (
              /* ── TOPIC PICKER (for conversation-mode tasks) ── */
              <div className="fade-in">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
                  {currentTask.topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="card"
                      onClick={() => startConversation(topic.id)}
                      style={{ padding: '28px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(255,255,255,0.02)', transition: 'transform 0.2s' }}
                    >
                      <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-color)', margin: 0 }}>{topic.title}</h3>
                      <div style={{ flex: 1 }}>
                        {topic.points.map((p, i) => (
                          <div key={i} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>• {p}</div>
                        ))}
                      </div>
                      <div style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(245,197,24,0.08)', color: 'var(--accent-color)', border: '1px solid rgba(245,197,24,0.2)', fontWeight: 700, fontSize: '0.85rem', textAlign: 'center' }}>
                        Start Partner Chat →
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            ) : (
              /* ── STANDARD SPEAKING PRACTICE (prompts + mic) ── */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', flex: 1 }} className="fade-in">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                  {currentTask.prompts.map((prompt, i) => (
                    <div key={i} style={{ padding: '12px 22px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--card-border)', fontFamily: 'var(--font-plex-mono)', fontSize: '1rem', color: 'var(--text-primary)' }}>
                      {prompt}
                    </div>
                  ))}
                </div>

                <div style={{ position: 'relative' }}>
                  {isRecording && (
                    <>
                      <div style={{ position: 'absolute', inset: '-20px', borderRadius: '50%', border: '2px solid var(--accent-color)', animation: 'pulse 1.5s infinite ease-out' }} />
                      <div style={{ position: 'absolute', top: '130%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '3px', alignItems: 'center', height: '28px' }}>
                        {[1,2,3,4,5,6,7,8,7,6,5,4,3,2,1].map((h, i) => (
                          <div key={i} style={{ width: '3px', height: `${h * 3}px`, background: 'var(--accent-color)', borderRadius: '10px', animation: `wave 0.5s infinite ease-in-out ${i * 0.05}s` }} />
                        ))}
                      </div>
                    </>
                  )}
                  <button
                    onClick={toggleRecord}
                    style={{
                      width: '100px', height: '100px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                      background: isRecording ? '#ef4444' : 'var(--accent-color)',
                      color: isRecording ? '#fff' : '#000',
                      boxShadow: isRecording ? '0 0 40px rgba(239,68,68,0.4)' : '0 10px 40px rgba(245,197,24,0.3)',
                      transition: 'all 0.3s cubic-bezier(0.175,0.885,0.32,1.275)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Mic size={40} />
                  </button>
                </div>

                <div style={{ minHeight: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  {feedback && (
                    <>
                      <p style={{ margin: 0, color: feedback.includes('Perfect') ? '#4ade80' : 'var(--text-secondary)', fontWeight: 700, fontSize: '1.15rem' }}>{feedback}</p>
                      {feedback.includes('Perfect') && (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.9rem', color: '#4ade80', fontWeight: 800 }}>98/100</span>
                          <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{ width: '98%', height: '100%', background: '#4ade80' }} />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {!feedback && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>Tap mic to record</span>}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes wave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(2.5); }
        }
      `}} />
    </main>
  );
}
