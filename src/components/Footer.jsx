import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ padding: '6rem 0', borderTop: '1px solid var(--color-border)', marginTop: '8rem', backgroundColor: 'var(--color-bg-alt)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ maxWidth: '300px' }}>
          <h3 style={{ fontSize: '2rem', margin: '0 0 1rem 0' }}>Verqify.</h3>
          <p className="text-secondary" style={{ fontSize: '1.2rem', lineHeight: '1.5', fontFamily: 'var(--font-serif)' }}>
            Every engineer has a shape. Let your code speak for you.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '4rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-primary)' }}>Product</span>
            <Link to="/how-it-works" className="link-hover-underline text-secondary">How It Works</Link>
            <Link to="/pricing" className="link-hover-underline text-secondary">Pricing</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-primary)' }}>Company</span>
            <Link to="/about" className="link-hover-underline text-secondary">About</Link>
            <Link to="/contact" className="link-hover-underline text-secondary">Contact</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-primary)' }}>Legal</span>
            <Link to="/privacy" className="link-hover-underline text-secondary">Privacy</Link>
            <Link to="/terms" className="link-hover-underline text-secondary">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
