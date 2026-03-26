import React from 'react';

export default function Messages() {
  return (
    <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', height: 'calc(100vh - 12rem)', overflow: 'hidden', background: 'var(--bg-elevated)' }}>
      <div style={{ width: '320px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Terminal</h2>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '0.9rem' }}>No active conversations in your history.</p>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-inset)', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '320px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--accent-indigo)' }}>✦</div>
          <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>Secure Communication</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Direct messaging is enabled once you save a candidate or express interest in a verified fingerprint.
          </p>
        </div>
      </div>
    </div>
  );
}

