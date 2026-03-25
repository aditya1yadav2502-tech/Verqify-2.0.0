import React from 'react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  return (
    <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Simple, transparent pricing.</h1>
      <p className="text-secondary mb-8" style={{ fontSize: '1.125rem' }}>For students, Verqify is free. Always. For teams, you pay for what you need.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto', textAlign: 'left' }}>
        <div style={{ padding: '3rem', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Standard</h2>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '1rem 0' }}>$499<span style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', fontWeight: 'normal' }}>/mo</span></div>
          <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-secondary)', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Unlimited searches</li>
            <li>50 direct messages / month</li>
            <li>Advanced filtering</li>
          </ul>
          <Link to="/company/login" className="btn btn-outline" style={{ width: '100%' }}>Get Started</Link>
        </div>
        <div style={{ padding: '3rem', border: '1px solid var(--color-text-primary)', borderRadius: '8px', backgroundColor: 'var(--color-text-primary)', color: 'var(--color-bg)' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-bg)' }}>Enterprise</h2>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '1rem 0' }}>Custom</div>
          <ul style={{ paddingLeft: '1.5rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Unlimited messaging</li>
            <li>ATS Integration</li>
            <li>Dedicated account manager</li>
          </ul>
          <button className="btn" style={{ width: '100%', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>Contact Sales</button>
        </div>
      </div>
    </div>
  );
}
