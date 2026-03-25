import React from 'react';
import { useParams } from 'react-router-dom';
import SkillFingerprint from '../components/SkillFingerprint';
import SkillTag from '../components/SkillTag';
import ProjectCard from '../components/ProjectCard';

export default function StudentProfile() {
  const { username } = useParams();

  const profileSkills = [
    { name: 'Backend', score: 95 },
    { name: 'Database', score: 85 },
    { name: 'Cloud/Ops', score: 70 },
    { name: 'Architecture', score: 80 },
    { name: 'Frontend', score: 40 },
  ];

  return (
    <div className="container animate-fade-in-up" style={{ maxWidth: '900px', paddingTop: '6rem', paddingBottom: '8rem' }}>
      
      {/* Top Section */}
      <header className="mb-8" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem' }}>
          <div>
            <h1 className="title-hero" style={{ marginBottom: '0.5rem' }}>{username === 'aditya' ? 'Aditya Yadav' : (username || 'Student Name')}</h1>
            <p className="text-secondary" style={{ fontSize: '1.1rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              Indian Institute of Technology • CS '26
            </p>
          </div>
          <span style={{ 
            fontSize: '0.75rem', 
            fontWeight: '600', 
            color: 'var(--color-verified)', 
            border: '1px solid var(--color-verified)', 
            padding: '0.3rem 0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Discoverable
          </span>
        </div>
      </header>

      {/* Layout Grid for Fingerprint & Personality */}
      <section className="animate-fade-in-up delay-100" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '4rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '4rem', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--color-bg-alt)', padding: '2rem' }}>
          <SkillFingerprint skills={profileSkills} size={320} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', fontWeight: '400' }}>Engineering Identity</h2>
          <p className="text-lead" style={{ marginBottom: '2rem', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
            "Backend engineer. Consistent shipper. Deploys everything he builds."
          </p>
          <p className="text-secondary" style={{ fontSize: '1.05rem' }}>
            Aditya tends toward backend systems, commits consistently over time, and has a strong habit of deploying rather than leaving projects unfinished. 
            Strong bias for action and architectural thinking over UI polish.
          </p>
        </div>
      </section>

      {/* Verified Skill Map */}
      <section className="animate-fade-in-up delay-200" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '4rem', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', fontWeight: '400', margin: 0 }}>Verified Skill Map</h2>
          <span className="text-secondary" style={{ fontSize: '0.875rem' }}>Pulled from 12 Repositories</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <SkillTag name="Node.js" status="verified" count={4} />
          <SkillTag name="PostgreSQL" status="verified" count={3} />
          <SkillTag name="Express" status="verified" count={4} />
          <SkillTag name="Docker" status="demonstrated" count={2} />
          <SkillTag name="System Design" status="demonstrated" count={1} />
          <SkillTag name="React" status="claimed" />
          <SkillTag name="MongoDB" status="claimed" />
        </div>
      </section>

      {/* Projects Section */}
      <section className="animate-fade-in-up delay-300" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '4rem', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', fontWeight: '400', marginBottom: '2rem' }}>Built & Deployed</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          <ProjectCard 
            title="Verqify Core Platform" 
            description="A credentialing system that builds skill fingerprints from GitHub repositories." 
            tags={['Node.js', 'PostgreSQL', 'Express']} 
            isLive={true} 
            link="#"
            githubUrl="#"
          />
          <ProjectCard 
            title="Distributed Key-Value Store" 
            description="A simple, raft-based distributed KV store for learning consensus algorithms." 
            tags={['Go', 'Raft', 'Docker']} 
            isLive={false}
            githubUrl="#" 
          />
          <ProjectCard 
            title="Algorithmic Trading Bot" 
            description="Backtests and executes trades using historical binance data." 
            tags={['Python', 'Pandas', 'WebSockets']} 
            isLive={true} 
            link="#"
          />
        </div>
      </section>

      {/* Proof Section */}
      <section className="animate-fade-in-up delay-400">
        <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', fontWeight: '400', marginBottom: '2rem' }}>Real Proof</h2>
        <div style={{ borderTop: '1px solid var(--color-border)' }}>
          <div style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontFamily: 'var(--font-serif)', fontWeight: '400' }}>Smart India Hackathon - Finalist</h4>
              <p className="text-secondary" style={{ margin: 0, fontSize: '0.9rem' }}>Built a scalable rural healthcare registry.</p>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-verified)', fontWeight: '600', letterSpacing: '0.05em' }}>✦ VERIFIED</span>
          </div>
          <div style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontFamily: 'var(--font-serif)', fontWeight: '400' }}>Backend Engineering Intern @ Razorpay</h4>
              <p className="text-secondary" style={{ margin: 0, fontSize: '0.9rem' }}>May 2025 - August 2025</p>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-verified)', fontWeight: '600', letterSpacing: '0.05em' }}>✦ VERIFIED</span>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="animate-fade-in-up delay-500" style={{ padding: '6rem 0', textAlign: 'center', marginTop: '6rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '2px', height: '4rem', backgroundColor: 'var(--color-accent)' }}></div>
        <h3 className="title-section" style={{ marginBottom: '1.5rem' }}>Want a profile like this?</h3>
        <p className="text-lead mb-8">Stop tweaking your resume. Let your code speak.</p>
        <button className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem' }}>Build your Skill Fingerprint</button>
      </section>

    </div>
  );
}
