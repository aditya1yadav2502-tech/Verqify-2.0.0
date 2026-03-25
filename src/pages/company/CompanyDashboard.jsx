import React from 'react';
import SkillFingerprint from '../../components/SkillFingerprint';

export default function CompanyDashboard() {
  // Mini fingerprint setups to match the style
  const s1 = [{score:90},{score:80},{score:60},{score:40},{score:80}];
  const s2 = [{score:40},{score:60},{score:90},{score:85},{score:50}];

  return (
    <div style={{ maxWidth: '1200px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
        <div>
          <h1 className="title-section" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Discover.</h1>
          <p className="text-secondary" style={{ fontSize: '1.125rem' }}>Browse verified talent matching your engineering requirements.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select style={{ padding: '0.85rem 1rem', border: '1px solid var(--color-border)', borderRadius: '0', backgroundColor: 'var(--color-bg)', outline: 'none' }}>
            <option>All Skill Shapes</option>
            <option>Backend Heavy</option>
            <option>Frontend Focused</option>
            <option>Full-stack Generalist</option>
          </select>
          <input type="text" placeholder="Search by verified skill..." style={{ padding: '0.85rem 1rem', border: '1px solid var(--color-border)', borderRadius: '0', minWidth: '300px', outline: 'none' }} />
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Mock Student Row 1 */}
        <div className="card" style={{ padding: '2rem', display: 'flex', gap: '3rem', alignItems: 'center' }}>
          <div style={{ width: '120px', height: '120px', backgroundColor: 'var(--color-bg-alt)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SkillFingerprint skills={s1.map((s,i) => ({name: '', score: s.score}))} size={100} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              Aditya Yadav 
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-sans)', border: '1px solid var(--color-accent)', color: 'var(--color-accent)', padding: '0.2rem 0.6rem', borderRadius: '0', letterSpacing: '0.05em', fontWeight: '600', textTransform: 'uppercase' }}>92% Match</span>
            </h3>
            <p className="text-secondary mb-3" style={{ fontSize: '0.95rem' }}>Backend engineer. Consistent shipper. Deploys everything he builds.</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', backgroundColor: 'rgba(0,200,83,0.1)', color: 'var(--color-verified)', borderRadius: '0', fontWeight: '500' }}>Node.js (Verified)</span>
              <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', backgroundColor: 'rgba(0,200,83,0.1)', color: 'var(--color-verified)', borderRadius: '0', fontWeight: '500' }}>PostgreSQL (Verified)</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '200px' }}>
            <button className="btn btn-primary" style={{ padding: '0.75rem', fontSize: '0.85rem', width: '100%' }}>View Profile</button>
            <button className="btn btn-outline" style={{ padding: '0.75rem', fontSize: '0.85rem', width: '100%' }}>Save Candidate</button>
          </div>
        </div>

        {/* Mock Student Row 2 */}
        <div className="card" style={{ padding: '2rem', display: 'flex', gap: '3rem', alignItems: 'center' }}>
          <div style={{ width: '120px', height: '120px', backgroundColor: 'var(--color-bg-alt)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SkillFingerprint skills={s2.map((s,i) => ({name: '', score: s.score}))} size={100} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              Sneha Reddy 
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-sans)', border: '1px solid var(--color-accent)', color: 'var(--color-accent)', padding: '0.2rem 0.6rem', borderRadius: '0', letterSpacing: '0.05em', fontWeight: '600', textTransform: 'uppercase' }}>88% Match</span>
            </h3>
            <p className="text-secondary mb-3" style={{ fontSize: '0.95rem' }}>Systems thinker. Rust enthusiast. High density commits.</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', backgroundColor: 'rgba(0,200,83,0.1)', color: 'var(--color-verified)', borderRadius: '0', fontWeight: '500' }}>Rust (Verified)</span>
              <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', backgroundColor: 'rgba(0,200,83,0.1)', color: 'var(--color-verified)', borderRadius: '0', fontWeight: '500' }}>WebAssembly (Verified)</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '200px' }}>
            <button className="btn btn-primary" style={{ padding: '0.75rem', fontSize: '0.85rem', width: '100%' }}>View Profile</button>
            <button className="btn btn-outline" style={{ padding: '0.75rem', fontSize: '0.85rem', width: '100%' }}>Save Candidate</button>
          </div>
        </div>
      </div>
    </div>
  );
}
