import React from 'react';
import { Link } from 'react-router-dom';

const cols = [
  { title: 'Product',  links: [['How It Works','/how-it-works'],['Pricing','/pricing'],['For Teams','/companies']] },
  { title: 'Company',  links: [['About','/about'],['Contact','/contact']] },
  { title: 'Legal',    links: [['Privacy','/privacy'],['Terms','/terms']] },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '5rem 0 3rem', marginTop: '8rem', background: 'var(--bg-surface)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '3rem', marginBottom: '4rem' }}>
          <div style={{ maxWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{ width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#6366F1,#06B6D4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.75rem',fontWeight:'700',color:'#fff',fontFamily:'var(--font-head)' }}>V</div>
              <span style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:'1.1rem' }}>Verqify</span>
            </div>
            <p style={{ color:'var(--text-secondary)',fontSize:'0.9rem',lineHeight:1.7 }}>
              Every engineer has a shape.<br/>We help companies find it.
            </p>
          </div>
          <div style={{ display:'flex',gap:'4rem',flexWrap:'wrap' }}>
            {cols.map(col => (
              <div key={col.title} style={{ display:'flex',flexDirection:'column',gap:'0.85rem' }}>
                <span className="label">{col.title}</span>
                {col.links.map(([label,href]) => (
                  <Link key={href} to={href} style={{ color:'var(--text-secondary)',fontSize:'0.9rem',transition:'color 0.2s' }}
                    onMouseEnter={e=>e.target.style.color='var(--text-primary)'}
                    onMouseLeave={e=>e.target.style.color='var(--text-secondary)'}
                  >{label}</Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop:'1px solid var(--border)',paddingTop:'2rem',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <span style={{ color:'var(--text-muted)',fontSize:'0.85rem' }}>© 2025 Verqify. All rights reserved.</span>
          <span style={{ display:'flex',alignItems:'center',gap:'0.5rem',color:'var(--text-muted)',fontSize:'0.85rem' }}>
            <span className="glow-dot" style={{ width:6,height:6 }}></span> All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}
