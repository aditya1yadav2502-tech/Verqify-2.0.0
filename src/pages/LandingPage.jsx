import React from 'react';
import SkillFingerprint from '../components/SkillFingerprint';
import SkillTag from '../components/SkillTag';

export default function LandingPage() {
  const sampleSkills = [
    { name: 'Architecture', score: 85 },
    { name: 'Backend', score: 95 },
    { name: 'Frontend', score: 60 },
    { name: 'DevOps', score: 75 },
    { name: 'Database', score: 80 },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{ padding: '8rem 0 10rem', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '1000px' }}>
          <h1 className="title-hero animate-fade-in-up">
            Every engineer has a shape. <br />
            <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>Verqify reveals it.</span>
          </h1>
          <p className="text-lead animate-fade-in-up delay-100" style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>
            Your work, verified. Your skills, proven. Companies find you based entirely on what you've actually built.
          </p>
          <div className="animate-fade-in-up delay-200" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem' }}>
              Claim your fingerprint
            </button>
            <button className="btn btn-outline" style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem' }}>
              Hire Students
            </button>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section style={{ padding: '8rem 0', backgroundColor: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            <div className="animate-fade-in-up">
              <span style={{ fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent)', display: 'block', marginBottom: '1rem' }}>The Resume is Dead</span>
              <h2 className="title-section">Your CGPA doesn't show what you built.</h2>
            </div>
            <div className="animate-fade-in-up delay-100">
              <span style={{ fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent)', display: 'block', marginBottom: '1rem' }}>Proxy Metrics Fail</span>
              <h2 className="title-section">Your college name shouldn't decide your future.</h2>
            </div>
            <div className="animate-fade-in-up delay-200">
              <span style={{ fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent)', display: 'block', marginBottom: '1rem' }}>Identical Outcomes</span>
              <h2 className="title-section">Your resume looks identical to 10,000 others.</h2>
            </div>
          </div>
        </div>
      </section>

      {/* The Skill Fingerprint Preview Section */}
      <section style={{ padding: '10rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div className="animate-fade-in-up delay-100">
              <h2 className="title-section">The verifiable ledger for your engineering identity.</h2>
              <p className="text-lead mb-8">
                Built from your actual commits, deployed projects, and real proof. Not what you claim — what you did.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                <SkillTag name="Node.js" status="verified" count={8} />
                <SkillTag name="PostgreSQL" status="verified" count={4} />
                <SkillTag name="System Design" status="demonstrated" count={1} />
                <SkillTag name="React" status="claimed" />
              </div>
            </div>
            <div className="animate-fade-in-up" style={{ backgroundColor: 'var(--color-bg-alt)', padding: '4rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <SkillFingerprint skills={sampleSkills} size={400} />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '10rem 0', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6rem' }}>
            <h2 className="title-section" style={{ margin: 0 }}>How it works.</h2>
            <button className="btn btn-outline">Read the methodology</button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="card animate-fade-in-up delay-100">
              <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>01</div>
              <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)', fontWeight: '400' }}>Connect your work</h3>
              <p className="text-secondary" style={{ fontSize: '1.05rem' }}>Link your GitHub, deployed projects, internships, and hackathon wins securely.</p>
            </div>
            <div className="card animate-fade-in-up delay-200">
              <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>02</div>
              <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)', fontWeight: '400' }}>Algorithm builds your shape</h3>
              <p className="text-secondary" style={{ fontSize: '1.05rem' }}>Verqify generates a verified visual identity based entirely on your code, structure, and commits.</p>
            </div>
            <div className="card animate-fade-in-up delay-300">
              <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>03</div>
              <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)', fontWeight: '400' }}>Companies discover you</h3>
              <p className="text-secondary" style={{ fontSize: '1.05rem' }}>No applying. No resume black hole. Teams filter by real skills and direct message you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Early Access CTA */}
      <section style={{ padding: '8rem 0', backgroundColor: 'var(--color-text-primary)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="title-hero" style={{ color: 'var(--color-bg)', marginBottom: '1.5rem' }}>Prove what you can build.</h2>
          <p className="text-lead delay-100" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Be among the first engineers with a verified identity. Free for students, forever.
          </p>
          <div className="delay-200" style={{ display: 'flex', justifyContent: 'center', gap: '0', maxWidth: '500px', margin: '0 auto' }}>
            <input 
              type="email" 
              placeholder="name@college.edu" 
              style={{
                flex: 1,
                padding: '1.25rem 1.5rem',
                fontSize: '1.125rem',
                border: 'none',
                borderRadius: '0',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                backgroundColor: 'var(--color-bg)'
              }}
            />
            <button className="btn btn-accent" style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem', border: 'none' }}>Join waitlist</button>
          </div>
        </div>
      </section>
    </div>
  );
}
