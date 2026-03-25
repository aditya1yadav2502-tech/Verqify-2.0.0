import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export default function StudentLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Build Profile', path: '/dashboard/profile' },
    { name: 'My Fingerprint', path: '/dashboard/fingerprint' },
    { name: 'Proof & Verification', path: '/dashboard/proof' },
    { name: 'Analytics', path: '/dashboard/analytics' },
    { name: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <aside style={{ width: '280px', borderRight: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-alt)', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column' }}>
        <Link to="/" style={{ fontSize: '1.75rem', fontWeight: '400', fontFamily: 'var(--font-serif)', color: 'var(--color-text-primary)', marginBottom: '4rem', display: 'block' }}>
          Verqify.
        </Link>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>Menu</span>
          {links.map(link => (
            <Link 
              key={link.path} 
              to={link.path}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '0',
                color: currentPath === link.path ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                backgroundColor: currentPath === link.path ? 'rgba(0,102,255,0.05)' : 'transparent',
                fontWeight: currentPath === link.path ? '500' : '400',
                transition: 'all 0.2s ease',
                borderLeft: currentPath === link.path ? '2px solid var(--color-accent)' : '2px solid transparent'
              }}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem', marginTop: 'auto' }}>
          <Link to="/" style={{ color: 'var(--color-text-secondary)', fontWeight: '500', fontSize: '0.9rem' }} className="link-hover-underline">Log Out</Link>
        </div>
      </aside>
      <main className="animate-fade-in-up" style={{ flex: 1, padding: '4rem 6rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
