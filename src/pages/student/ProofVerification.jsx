import React from 'react';
import SkillTag from '../../components/SkillTag';

export default function ProofVerification() {
  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Proof & Verification</h1>
      <p className="text-secondary mb-8">Manage the linked accounts and documents that prove your skills.</p>

      <section className="mb-8">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>Connected Accounts</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>GitHub <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(0,200,83,0.1)', color: 'var(--color-verified)', padding: '0.15rem 0.4rem', borderRadius: '2px' }}>CONNECTED</span></h4>
              <p className="text-secondary" style={{ margin: 0, fontSize: '0.875rem' }}>Last synced 2 hours ago</p>
            </div>
            <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Force Sync</button>
          </div>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>Your Skill Tags</h2>
        <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '1rem', fontWeight: '500', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Skill</th>
                <th style={{ padding: '1rem', fontWeight: '500', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Status</th>
                <th style={{ padding: '1rem', fontWeight: '500', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Proof Count</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem' }}><SkillTag name="Node.js" status="verified" /></td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-verified)', fontWeight: '500' }}>Verified</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>4 repositories</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem' }}><SkillTag name="React" status="claimed" /></td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Claimed</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>0 (Needs connected repo)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
