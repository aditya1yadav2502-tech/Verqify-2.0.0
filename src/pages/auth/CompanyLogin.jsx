import React from 'react';
import { Link } from 'react-router-dom';

export default function CompanyLogin() {
  return (
    <div>
      <div style={{ display: 'inline-block', backgroundColor: 'var(--color-text-primary)', color: 'var(--color-bg)', padding: '0.25rem 0.75rem', borderRadius: '0', fontSize: '0.75rem', fontWeight: '600', marginBottom: '1.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>FOR TEAMS</div>
      <h1 className="title-section" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Company Login.</h1>
      <p className="text-secondary mb-8" style={{ fontSize: '1.05rem' }}>Access the talent discovery portal.</p>
      
      <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Work Email</label>
          <input type="email" placeholder="name@company.com" style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '0', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
          <input type="password" style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '0', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }} />
        </div>
        
        <button type="button" className="btn btn-primary" style={{ marginTop: '0.5rem', padding: '1.25rem' }}>Sign In to Portal</button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
        Interested in hiring on Verqify? <Link to="/companies" className="link-hover-underline" style={{ color: 'var(--color-text-primary)', fontWeight: '500' }}>Learn more</Link>
      </p>
    </div>
  );
}
