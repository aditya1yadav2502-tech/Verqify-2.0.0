import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: '2rem 0', position: 'sticky', top: 0, backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', zIndex: 50, borderBottom: '1px solid var(--color-border)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: '1.75rem', fontWeight: '400', fontFamily: 'var(--font-serif)', color: 'var(--color-text-primary)' }}>
          Verqify.
        </Link>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/how-it-works" className="link-hover-underline" style={{ fontSize: '0.95rem', fontWeight: '500' }}>How It Works</Link>
          <Link to="/companies" className="link-hover-underline" style={{ fontSize: '0.95rem', fontWeight: '500' }}>For Teams</Link>
          <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--color-border)' }}></div>
          <Link to="/login" className="link-hover-underline" style={{ fontSize: '0.95rem', fontWeight: '500' }}>Log In</Link>
          <Link to="/signup" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
            Get Verified
          </Link>
        </div>
      </div>
    </nav>
  );
}
