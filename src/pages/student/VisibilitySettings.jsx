import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';

export default function VisibilitySettings() {
  const { user, profile } = useAuth();
  const [discoverable, setDiscoverable] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setDiscoverable(profile.is_discoverable ?? true);
    }
  }, [profile]);

  const handleToggle = async () => {
    if (!user) return;
    setLoading(true);
    const newValue = !discoverable;
    
    const { error } = await supabase
      .from('profiles')
      .update({ is_discoverable: newValue })
      .eq('id', user.id);

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setDiscoverable(newValue);
      toast.success(`Discoverability turned ${newValue ? 'ON' : 'OFF'}`);
    }
  };

  const profileUrl = `${window.location.origin}/s/${profile?.username || 'me'}`;

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
            disabled={loading}
            onClick={handleToggle}
            style={{ 
              width: 52, height: 32, borderRadius: 20, border: 'none', cursor: 'pointer',
              background: discoverable ? 'var(--accent-indigo)' : 'var(--border)',
              position: 'relative', transition: '0.3s',
              opacity: loading ? 0.6 : 1
            }}
          >
            <div style={{ 
              width: 24, height: 24, borderRadius: '50%', background: 'white',
              position: 'absolute', top: 4, left: discoverable ? 24 : 4,
              transition: '0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
            value={profileUrl} 
            className="input"
            style={{ flex: 1, background: 'var(--bg-elevated)', fontFamily: 'monospace', fontSize: '0.9rem' }} 
          />
          <button 
            onClick={() => {
              navigator.clipboard.writeText(profileUrl);
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

