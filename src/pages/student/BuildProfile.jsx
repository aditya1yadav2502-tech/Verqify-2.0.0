import React from 'react';
import { toast } from 'sonner';

export default function BuildProfile() {
  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Profile changes saved successfully');
  };

  return (
    <div style={{ maxWidth: 960 }}>
      <header style={{ marginBottom: '3.5rem' }}>
        <div className="label" style={{ marginBottom: '0.5rem' }}>Profile Management</div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '3rem', fontWeight: 700 }}>Resume.</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Manage the data that feeds your verified Skill Fingerprint.</p>
      </header>

      <div className="glass" style={{ padding: '3rem', marginBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>Basic Information</h2>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>First Name</label>
              <input type="text" defaultValue="Aditya" className="input" style={{ width: '100%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>Last Name</label>
              <input type="text" defaultValue="Yadav" className="input" style={{ width: '100%' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>College / University</label>
            <input type="text" defaultValue="Indian Institute of Technology" className="input" style={{ width: '100%' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.85rem 2.5rem' }}>Save Metadata</button>
        </form>
      </div>

      <div className="glass" style={{ padding: '3rem' }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Independent Projects</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2.5rem' }}>Add external proof like hosted apps or private repos you wish to share.</p>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>GitHub Repository URL</label>
            <input type="url" placeholder="https://github.com/..." className="input" style={{ width: '100%' }} />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.6rem' }}>Our engine will automatically scan the commit pattern for verification.</p>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>Live URL (Optional)</label>
            <input type="url" placeholder="https://..." className="input" style={{ width: '100%' }} />
          </div>
          <button type="button" className="btn btn-secondary" style={{ alignSelf: 'flex-start', padding: '0.85rem 2rem' }}>Connect Project</button>
        </form>
      </div>
    </div>
  );
}
