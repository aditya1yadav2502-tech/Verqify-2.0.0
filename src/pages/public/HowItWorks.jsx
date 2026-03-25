import React from 'react';

export default function HowItWorks() {
  return (
    <div className="container" style={{ padding: '6rem 0' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>How Verqify Works</h1>
      <p className="text-secondary" style={{ fontSize: '1.25rem', maxWidth: '800px' }}>
        A deeper look at the algorithms and verifications that build your Skill Fingerprint. 
        We don't trust claims; we trust commits.
      </p>
      {/* Content skeleton */}
      <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>1. Connect Your Data Sources</h2>
          <p className="text-secondary">We integrate securely with GitHub, GitLab, and deployed environments to parse your real work.</p>
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>2. Semantic Code Analysis</h2>
          <p className="text-secondary">Our engine reads your code to understand patterns, architecture, and consistent habits—not just syntax.</p>
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>3. The Verification Ledger</h2>
          <p className="text-secondary">Every skill gets a proof chain. Claimed, Demonstrated, or Verified. Nothing is hidden.</p>
        </div>
      </div>
    </div>
  );
}
