import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export default function CompanyLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { name: 'Browse Students', path: '/company/dashboard' },
    { name: 'Saved Candidates', path: '/company/saved' },
    { name: 'Messages', path: '/company/messages' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <aside style={{ width: '280px', borderRight: '1px solid var(--color-text-primary)', backgroundColor: 'var(--color-text-primary)', color: 'var(--color-bg)', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '4rem' }}>
          <Link to="/" style={{ fontSize: '1.75rem', fontWeight: '400', fontFamily: 'var(--font-serif)', color: 'var(--color-bg)', display: 'block', marginBottom: '0.5rem' }}>
            Verqify.
          </Link>
          <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)', padding: '0.2rem 0.6rem', borderRadius: '0', fontWeight: '600', letterSpacing: '0.05em' }}>FOR TEAMS</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Menu</span>
          {links.map(link => (
            <Link 
              key={link.path} 
              to={link.path}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '0',
                color: currentPath === link.path ? 'var(--color-text-primary)' : 'rgba(255,255,255,0.7)',
                backgroundColor: currentPath === link.path ? 'var(--color-bg)' : 'transparent',
                fontWeight: currentPath === link.path ? '500' : '400',
                transition: 'all 0.2s ease',
              }}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', marginTop: 'auto' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '500', fontSize: '0.9rem' }} className="link-hover-underline">Log Out</Link>
        </div>
      </aside>
      <main className="animate-fade-in-up" style={{ flex: 1, padding: '4rem 6rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
