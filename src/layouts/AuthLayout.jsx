import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-alt)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '2.5rem' }}>
        <header style={{ paddingBottom: '2rem' }}>
          <Link to="/" style={{ fontSize: '1.75rem', fontWeight: '400', fontFamily: 'var(--font-serif)', color: 'var(--color-text-primary)' }}>
            Verqify.
          </Link>
        </header>
        <main className="animate-fade-in-up" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '420px', backgroundColor: 'var(--color-bg)', padding: '3.5rem', borderRadius: '0', border: '1px solid var(--color-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
