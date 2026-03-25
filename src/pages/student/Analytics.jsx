import React from 'react';

export default function Analytics() {
  return (
    <div style={{ maxWidth: 960 }}>
      <header style={{ marginBottom: '3.5rem' }}>
        <div className="label" style={{ marginBottom: '0.5rem' }}>Impact & Reach</div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '3rem', fontWeight: 700 }}>Discovery.</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>See who is analyzing your engineering fingerprint.</p>
      </header>

      <div className="glass" style={{ padding: '5rem 3rem', textAlign: 'center', marginBottom: '4rem', borderLeft: '4px solid var(--accent-cyan)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📈</div>
        <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Unlock Domain Insights</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, margin: '0 auto 2.5rem', maxWidth: 600 }}>
          Complete 3 more verified proofs to see which companies are finding you and what specific tech stacks they were searching for when they landed on your profile.
        </p>
        <button className="btn btn-primary" style={{ padding: '1rem 3rem' }}>Deepen Fingerprint</button>
      </div>
      
      <div>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>Recent Search Results</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { role: 'Backend Engineer (Fintech)', company: 'Seed Stage Startup', time: '2h ago', match: '94%' },
            { role: 'System Design Architect', company: 'Y-Combinator W26', time: '1d ago', match: '88%' },
            { role: 'TypeScript Expert', company: 'Series A Scaleup', time: '3d ago', match: '91%' }
          ].map((item, i) => (
            <div key={i} className="glass" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.2rem' }}>{item.role}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.company}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{item.match} match</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
