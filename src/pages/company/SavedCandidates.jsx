import React from 'react';

export default function SavedCandidates() {
  return (
    <div style={{ maxWidth: '1000px' }}>
      <h1 className="title-section" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Shortlist.</h1>
      <p className="text-secondary mb-8" style={{ fontSize: '1.125rem' }}>Students you have saved for further review.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontFamily: 'var(--font-serif)' }}>Ravi Sharma</h3>
            <button style={{ padding: 0, color: 'var(--color-text-secondary)', backgroundColor: 'transparent', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>✕</button>
          </div>
          <p className="text-secondary mb-6" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>Frontend specialist. Heavy React/Next.js ecosystem commits with distinct UI scaling patterns.</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', border: '1px solid var(--color-border)', borderRadius: '0', textTransform: 'uppercase', letterSpacing: '0.02em', fontWeight: '500' }}>React</span>
            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', border: '1px solid var(--color-border)', borderRadius: '0', textTransform: 'uppercase', letterSpacing: '0.02em', fontWeight: '500' }}>TypeScript</span>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', fontSize: '0.9rem' }}>Message Candidate</button>
        </div>
      </div>
    </div>
  );
}
