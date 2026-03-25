import React from 'react';

export default function VisibilitySettings() {
  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Visibility Settings</h1>
      <p className="text-secondary mb-8">Control who can see your profile and reach out to you.</p>

      <div style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '8px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Discoverability</h3>
            <p className="text-secondary" style={{ margin: 0, fontSize: '0.875rem', maxWidth: '400px' }}>
              When enabled, your profile appears in company searches. Only verified recruiters can see your full details.
            </p>
          </div>
          <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
            <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
            <span style={{ 
              position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
              backgroundColor: 'var(--color-accent)', borderRadius: '24px', transition: '0.4s' 
            }}>
              <span style={{ 
                position: 'absolute', content: '""', height: '18px', width: '18px', left: '27px', bottom: '3px', 
                backgroundColor: 'white', borderRadius: '50%', transition: '0.4s' 
              }}></span>
            </span>
          </label>
        </div>
      </div>

      <div style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 1.5rem 0' }}>Public Profile Link</h3>
        <p className="text-secondary" style={{ margin: '0 0 1rem 0', fontSize: '0.875rem' }}>
          Anyone with this link can view your profile, regardless of your discoverability setting.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input type="text" readOnly value="verqify.com/s/aditya" style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: 'var(--color-bg-alt)', color: 'var(--color-text-secondary)' }} />
          <button className="btn btn-outline" style={{ padding: '0.75rem 1.5rem' }}>Copy Link</button>
        </div>
      </div>
    </div>
  );
}
