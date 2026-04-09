'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { db, VocabEntry } from '@/lib/db';
import { Trash2, Edit3, Save, X, Search } from 'lucide-react';

export default function VocabBank() {
  const [vocab, setVocab] = useState<VocabEntry[]>([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<VocabEntry>>({});

  const fetchVocab = useCallback(async () => {
    const all = await db.vocab.toArray();
    setVocab(all.sort((a, b) => a.german.localeCompare(b.german)));
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const all = await db.vocab.toArray();
      if (active) {
        setVocab(all.sort((a, b) => a.german.localeCompare(b.german)));
      }
    };
    load();
    return () => { active = false; };
  }, [fetchVocab]);

  const deleteWord = async (id: string) => {
    if (confirm('Are you sure you want to delete this word?')) {
      await db.vocab.delete(id);
      fetchVocab();
    }
  };

  const startEdit = (entry: VocabEntry) => {
    setEditingId(entry.id);
    setEditForm(entry);
  };

  const saveEdit = async () => {
    if (editingId && editForm) {
      await db.vocab.update(editingId, editForm);
      setEditingId(null);
      fetchVocab();
    }
  };

  const filteredVocab = vocab.filter(v => 
    v.german.toLowerCase().includes(search.toLowerCase()) ||
    v.english.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>← Back</Link>
          <h1 style={{ color: 'var(--text-primary)' }}>Vocab Bank</h1>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search bank..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '8px 12px 8px 36px',
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '4px',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          />
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--card-border)' }}>
            <tr>
              <th style={{ padding: '12px 16px' }}>German</th>
              <th style={{ padding: '12px 16px' }}>English</th>
              <th style={{ padding: '12px 16px' }}>Level</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVocab.map(entry => (
              <tr key={entry.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                {editingId === entry.id ? (
                  <>
                    <td style={{ padding: '12px 16px' }}>
                      <input 
                        style={inputStyle} 
                        value={editForm.german || ''} 
                        onChange={e => setEditForm({...editForm, german: e.target.value})} 
                      />
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <input 
                        style={inputStyle} 
                        value={editForm.english || ''} 
                        onChange={e => setEditForm({...editForm, english: e.target.value})} 
                      />
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <select 
                        style={{...inputStyle, width: 'auto'}} 
                        value={editForm.level || ''} 
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={e => setEditForm({...editForm, level: e.target.value as any})}
                      >
                        <option value="A1">A1</option>
                        <option value="A2">A2</option>
                        <option value="custom">Custom</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button onClick={saveEdit} style={actionBtnStyle}><Save size={18} color="var(--accent-color)" /></button>
                      <button onClick={() => setEditingId(null)} style={actionBtnStyle}><X size={18} /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ color: 'var(--text-secondary)', marginRight: '4px', fontSize: '0.8rem' }}>{entry.article}</span>
                      <span style={{ fontWeight: 600 }}>{entry.german}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{entry.english}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        {entry.level}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button onClick={() => startEdit(entry)} style={actionBtnStyle}><Edit3 size={18} /></button>
                      <button onClick={() => deleteWord(entry.id)} style={actionBtnStyle}><Trash2 size={18} color="#ff4d4d" /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {filteredVocab.length === 0 && (
          <p style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>No entries found.</p>
        )}
      </div>

      <div style={{ marginTop: '48px', padding: '24px', borderTop: '1px solid var(--card-border)', opacity: 0.5, textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', marginBottom: '16px' }}>System Maintenance</p>
        <button 
          onClick={async () => {
             if (confirm('DANGER: This will permanently delete ALL vocabulary, including your PDF imports. The app will reload and restore the default starting words. Proceed?')) {
                 await db.vocab.clear();
                 window.location.reload();
             }
          }}
          style={{ 
            background: 'none', 
            border: '1px solid #ff4d4d', 
            color: '#ff4d4d', 
            padding: '8px 16px', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600
          }}
        >
          Reset Vocab Bank & Seeds
        </button>
      </div>
    </main>
  );
}

const inputStyle = {
  width: '100%',
  padding: '6px 8px',
  backgroundColor: '#1A1A1A',
  border: '1px solid #333',
  borderRadius: '4px',
  color: '#FFF',
  fontSize: '14px',
  outline: 'none'
};

const actionBtnStyle = {
  background: 'none',
  border: 'none',
  padding: '4px 8px',
  cursor: 'pointer',
  opacity: 0.7,
  transition: 'opacity 0.2s',
  display: 'inline-flex',
  alignItems: 'center'
};
