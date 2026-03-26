import React, { useState } from 'react';
import SkillTag from '../../components/SkillTag';
import { useAuth } from '../../contexts/AuthContext';
import { syncGitHubData } from '../../lib/githubApi';
import { toast } from 'sonner';

export default function ProofVerification() {
  const { user, profile } = useAuth();
  const [syncing, setSyncing] = useState(false);

  const handleForceSync = async () => {
    setSyncing(true);
    const id = toast.loading('Re-syncing with GitHub...');
    try {
      const result = await syncGitHubData();
      if (result) {
        toast.success('Engineering shape updated', { id });
        // Small delay to allow DB to propagate before refresh
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error('Sync failed. Ensure GitHub is connected.', { id });
      }
    } catch {
      toast.error('Error during sync', { id });
    } finally {
      setSyncing(false);
    }
  };

  const skills = profile?.skill_fingerprint || [];

  return (
    <div style={{ maxWidth: 960 }}>
      <header style={{ marginBottom: '3.5rem' }}>
        <div className="label" style={{ marginBottom: '0.5rem' }}>Trust & Verification</div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '3rem', fontWeight: 700 }}>Proof.</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Manage the linked accounts and documents that prove your skills.</p>
      </header>

      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Connected Accounts</h2>
        <div className="glass" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: 48, height: 48, background: 'var(--bg-elevated)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-head)', margin: '0 0 0.25rem 0', fontWeight: 600 }}>GitHub</h4>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
                {user?.app_metadata?.provider === 'github' ? 'Account Linked' : 'Connected via OAuth'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>CONNECTED</span>
            <button 
              onClick={handleForceSync}
              disabled={syncing}
              className="btn btn-secondary" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              {syncing ? 'Syncing...' : 'Force Sync'}
            </button>
          </div>
        </div>
      </section>

      <section>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Your Skill Proofs</h2>
        <div className="glass" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '1.25rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Skill</th>
                <th style={{ padding: '1.25rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '1.25rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Analysis</th>
              </tr>
            </thead>
            <tbody>
              {skills.length > 0 ? (
                skills.map(skill => (
                  <tr key={skill.name} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1.25rem' }}><SkillTag name={skill.name} status="verified" /></td>
                    <td style={{ padding: '1.25rem' }}><span className="badge badge-indigo" style={{ fontSize: '0.75rem' }}>VERIFIED</span></td>
                    <td style={{ padding: '1.25rem', fontSize: '0.9rem' }}>Verified via GitHub repos</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No verified skills detected. Click 'Force Sync' above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

