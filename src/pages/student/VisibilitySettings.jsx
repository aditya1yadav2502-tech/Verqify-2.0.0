import React from 'react';
import { toast } from 'sonner';

export default function VisibilitySettings() {
  const [discoverable, setDiscoverable] = React.useState(true);

  return (
    <div style={{ maxWidth: 960 }}>
      <header style={{ marginBottom: '3.5rem' }}>
        <div className="label" style={{ marginBottom: '0.5rem' }}>Personal Settings</div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '3rem', fontWeight: 700 }}>Privacy.</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Control who can see your profile and reach out to you.</p>
      </header>

      <div className="glass" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ maxWidth: 500 }}>
            <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Discoverability</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              When enabled, your fingerprint appears in recruiter searches. Only verified companies can see your full engineering history.
            </p>
          </div>
          <button 
            onClick={() => {
              setDiscoverable(!discoverable);
              toast.success(`Discoverability turned ${!discoverable ? 'ON' : 'OFF'}`);
            }}
            style={{ 
              width: 52, height: 32, borderRadius: 20, border: 'none', cursor: 'pointer',
              background: discoverable ? 'var(--accent-indigo)' : 'var(--border)',
              position: 'relative', transition: '0.3s'
            }}
          >
            <div style={{ 
              width: 24, height: 24, borderRadius: '50%', background: 'white',
              position: 'absolute', top: 4, left: discoverable ? 24 : 4,
              transition: '0.3s shadow', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }} />
          </button>
        </div>
      </div>

      <div className="glass" style={{ padding: '2.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem' }}>Public Profile Link</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Share this link with anyone to view your verified engineering shape.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input 
            type="text" 
            readOnly 
            value="verqify.com/s/aditya" 
            className="input"
            style={{ flex: 1, background: 'var(--bg-elevated)', fontFamily: 'monospace', fontSize: '0.9rem' }} 
          />
          <button 
            onClick={() => {
              navigator.clipboard.writeText('verqify.com/s/aditya');
              toast.success('Link copied to clipboard!');
            }}
            className="btn btn-secondary" 
            style={{ padding: '0 2rem' }}
          >
            Copy link
          </button>
        </div>
      </div>
    </div>
  );
}
