import React from 'react';

export default function Analytics() {
  return (
    <div style={{ maxWidth: '1000px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Analytics</h1>
      <p className="text-secondary mb-8">See who is looking at your profile.</p>

      <div style={{ padding: '3rem', border: '1px solid var(--color-border)', borderRadius: '8px', textAlign: 'center', backgroundColor: 'var(--color-bg-alt)' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem' }}>Unlock Detailed Analytics</h3>
        <p className="text-secondary" style={{ margin: '0 auto 2rem', maxWidth: '500px' }}>
          Get 5 more Verified Skill Tags to unlock detailed insights into which companies are viewing your profile and what search filters they used to find you.
        </p>
        <button className="btn btn-primary">Connect More Proof</button>
      </div>
      
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Recent Search Appearances</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, border: '1px solid var(--color-border)', borderRadius: '8px' }}>
          <li style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.25rem' }}>Backend Engineer (Entry Level)</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Series B Fintech Company</div>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>2 days ago</div>
            </div>
          </li>
          <li style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.25rem' }}>Node.js Developer</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Y Combinator Startup</div>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>5 days ago</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
