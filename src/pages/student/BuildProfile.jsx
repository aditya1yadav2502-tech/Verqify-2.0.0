import React from 'react';

export default function BuildProfile() {
  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Build Your Profile</h1>
      <p className="text-secondary mb-8">Manage the data that feeds your Skill Fingerprint.</p>

      <section className="mb-8">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>Basic Information</h2>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>First Name</label>
              <input type="text" defaultValue="Aditya" style={{ padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '4px' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Last Name</label>
              <input type="text" defaultValue="Yadav" style={{ padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '4px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>College / University</label>
            <input type="text" defaultValue="Indian Institute of Technology" style={{ padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '4px' }} />
          </div>
          <button type="button" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save Changes</button>
        </form>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>Add Project</h2>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>GitHub Repository URL</label>
            <input type="url" placeholder="https://github.com/..." style={{ padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '4px' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>We will automatically pull languages and commit history.</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Live URL (Optional)</label>
            <input type="url" placeholder="https://..." style={{ padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '4px' }} />
          </div>
          <button type="button" className="btn btn-outline" style={{ alignSelf: 'flex-start' }}>Add Project to Profile</button>
        </form>
      </section>
    </div>
  );
}
