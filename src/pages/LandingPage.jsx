import React from 'react';
import { Link } from 'react-router-dom';
import SkillFingerprint from '../components/SkillFingerprint';
import SkillTag from '../components/SkillTag';

const sampleSkills = [
  { name: 'Architecture', score: 85 }, { name: 'Backend', score: 95 },
  { name: 'Frontend', score: 45 }, { name: 'DevOps', score: 70 }, { name: 'Database', score: 80 },
];

function Stat({ num, label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="gradient-text" style={{ fontFamily:'var(--font-head)',fontSize:'2.5rem',fontWeight:700 }}>{num}</div>
      <div style={{ color:'var(--text-secondary)',fontSize:'0.85rem',marginTop:'0.25rem' }}>{label}</div>
    </div>
  );
}

function Problem({ num, text }) {
  return (
    <div className="glass animate-fade-in-up" style={{ padding:'2rem',borderRadius:16 }}>
      <div className="gradient-text" style={{ fontFamily:'var(--font-head)',fontSize:'3rem',fontWeight:700,lineHeight:1,marginBottom:'1rem' }}>{num}</div>
      <p style={{ fontFamily:'var(--font-head)',fontSize:'1.2rem',fontWeight:600,color:'var(--text-primary)',lineHeight:1.4 }}>{text}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ padding:'8rem 0 6rem',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',top:'10%',left:'50%',transform:'translate(-50%,-50%)',width:600,height:600,background:'radial-gradient(closest-side,rgba(99,102,241,0.06),transparent)',pointerEvents:'none',borderRadius:'50%' }} />
        <div className="container" style={{ textAlign:'center',position:'relative',zIndex:1 }}>
          <div className="animate-fade-in-up" style={{ marginBottom:'1.5rem' }}>
            <span className="badge badge-indigo" style={{ fontSize:'0.8rem' }}>
              <span className="glow-dot" style={{ width:6,height:6 }}></span> Now in private beta
            </span>
          </div>
          <h1 className="headline-xl animate-fade-in-up delay-100" style={{ maxWidth:800,margin:'0 auto 1.5rem' }}>
            Every engineer has a shape.{' '}<span className="gradient-text">Verqify reveals it.</span>
          </h1>
          <p className="animate-fade-in-up delay-200" style={{ fontSize:'1.2rem',color:'var(--text-secondary)',maxWidth:560,margin:'0 auto 3rem',lineHeight:1.7 }}>
            Your work, verified. Your skills, proven. Companies find you based entirely on what you've actually built.
          </p>
          <div className="animate-fade-in-up delay-300" style={{ display:'flex',gap:'1rem',justifyContent:'center' }}>
            <Link to="/signup" className="btn btn-primary" style={{ padding:'1rem 2.5rem',fontSize:'1.1rem' }}>Claim your fingerprint →</Link>
            <Link to="/how-it-works" className="btn btn-secondary" style={{ padding:'1rem 2.5rem',fontSize:'1.1rem' }}>How it works</Link>
          </div>

          {/* Hero Product Preview */}
          <div className="animate-fade-in-up delay-400" style={{ marginTop:'5rem',position:'relative' }}>
            <div className="glass" style={{ 
              maxWidth:800, margin:'0 auto', padding:'3rem', 
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 24px 60px rgba(99,102,241,0.12)',
              position:'relative', zIndex:2
            }}>
              <div style={{ transform:'scale(1.1)' }}>
                <SkillFingerprint skills={sampleSkills} size={420} />
              </div>
            </div>
            {/* Visual tether to pull eye down */}
            <div style={{ 
              position:'absolute', bottom:-100, left:'50%', transform:'translateX(-50%)',
              width:2, height:120, background:'linear-gradient(to bottom, var(--accent-indigo), transparent)',
              zIndex:1
            }} />
          </div>

          <div className="animate-fade-in-up delay-500" style={{ display:'flex',gap:'4rem',justifyContent:'center',marginTop:'8rem',paddingTop:'4rem',borderTop:'1px solid var(--border)' }}>
            <Stat num="12k+" label="Engineers verified" />
            <Stat num="340+" label="Companies hiring" />
            <Stat num="98%" label="Match accuracy" />
          </div>
        </div>
      </section>

      {/* Fingerprint preview */}
      <section style={{ padding:'8rem 0', position:'relative' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'4rem' }}>
            <div className="accent-line" style={{ margin:'0 auto 1.5rem' }} />
            <h2 className="headline-lg animate-fade-in-up">The New Proof-of-Work.</h2>
            <p style={{ color:'var(--text-secondary)', fontSize:'1.1rem', maxWidth:600, margin:'1rem auto 0' }}>
              Your engineering identity is no longer a document. It's a verified signal generated from your raw contributions.
            </p>
          </div>

          <div className="glass animate-fade-in-up delay-200" style={{ 
            maxWidth:1000, margin:'0 auto', padding:'4rem', borderRadius:32,
            display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:'4rem', alignItems:'center',
            boxShadow:'0 32px 80px rgba(99,102,241,0.08)'
          }}>
            {/* Left side: Metadata & Skills */}
            <div>
              <div style={{ marginBottom:'2.5rem' }}>
                <span className="label" style={{ color:'var(--accent-indigo)', letterSpacing:'0.15em' }}>Verified Candidate</span>
                <h3 style={{ fontFamily:'var(--font-head)', fontSize:'2.5rem', fontWeight:700, margin:'0.5rem 0' }}>Aditya Yadav</h3>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginTop:'0.5rem' }}>
                  <span className="badge badge-indigo">The Systems Architect</span>
                  <span style={{ fontSize:'0.9rem', color:'var(--text-muted)' }}>Top 2% in Backend</span>
                </div>
              </div>

              <div style={{ marginBottom:'3rem' }}>
                <p style={{ fontSize:'1.05rem', lineHeight:1.7, color:'var(--text-secondary)', marginBottom:'2rem' }}>
                  "I build high-throughput distributed systems. My fingerprint reflects a heavy density in Infrastructure and Database Design, backed by 400+ verified commits."
                </p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'0.8rem' }}>
                  <SkillTag name="Node.js" status="verified" />
                  <SkillTag name="PostgreSQL" status="verified" />
                  <SkillTag name="Kubernetes" status="demonstrated" />
                  <SkillTag name="Redis" status="verified" />
                  <SkillTag name="React" status="claimed" />
                  <SkillTag name="System Design" status="demonstrated" />
                </div>
              </div>

              {/* Distinction Legend */}
              <div style={{ paddingTop:'2rem', borderTop:'1px solid var(--border)', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:'0.85rem', marginBottom:'0.25rem' }}>Verified ✓</div>
                  <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Proven by direct Git commit SHA & deployment logs.</div>
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:'0.85rem', marginBottom:'0.25rem' }}>Demonstrated ✦</div>
                  <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Extracted from project context and complexity.</div>
                </div>
              </div>
            </div>

            {/* Right side: Fingerprint */}
            <div style={{ display:'flex', justifyContent:'center', padding:'2rem', background:'radial-gradient(circle at center, rgba(99,102,241,0.03) 0%, transparent 70%)', borderRadius:24 }}>
              <SkillFingerprint skills={sampleSkills} size={420} />
            </div>
          </div>
        </div>
      </section>

      {/* Problem bento */}
      <section style={{ padding:'8rem 0',background:'var(--bg-elevated)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign:'center',marginBottom:'4rem' }}>
            <div className="accent-line" style={{ margin:'0 auto 1.5rem' }} />
            <h2 className="headline-lg animate-fade-in-up">Legacy screening is broken.</h2>
            <p style={{ color:'var(--text-secondary)',marginTop:'1rem',fontSize:'1.05rem',maxWidth:520,margin:'1rem auto 0' }}>Three problems destroying your chances.</p>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'1.25rem' }}>
            <Problem num="01" text="Your CGPA doesn't show what you built at 2am." />
            <Problem num="02" text="Your college name shouldn't decide your future." />
            <Problem num="03" text="Your standard profile looks identical to 10,000 others." />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding:'8rem 0' }}>
        <div className="container">
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'4rem',flexWrap:'wrap',gap:'1rem' }}>
            <div><div className="accent-line" /><h2 className="headline-lg animate-fade-in-up">How Verqify works</h2></div>
            <Link to="/how-it-works" className="btn btn-secondary">Read the methodology</Link>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'1.25rem' }}>
            {[
              { n:'01', title:'Connect your real work', body:'Link GitHub, deployed projects, internship receipts, and hackathon wins — all cryptographically verified.' },
              { n:'02', title:'Algorithm builds your shape', body:'Verqify analyzes your code density, commit patterns, and deployed surfaces — not keywords on a doc.' },
              { n:'03', title:'Companies discover you', body:'Recruiters search by verified domain strengths and message you directly. No applications.' },
            ].map(s => (
              <div key={s.n} className="glass animate-fade-in-up" style={{ padding:'2.5rem' }}>
                <div className="gradient-text" style={{ fontFamily:'var(--font-head)',fontSize:'2rem',fontWeight:700,marginBottom:'1.25rem' }}>{s.n}</div>
                <h3 style={{ fontFamily:'var(--font-head)',fontSize:'1.2rem',fontWeight:600,marginBottom:'0.75rem' }}>{s.title}</h3>
                <p style={{ color:'var(--text-secondary)',fontSize:'0.95rem',lineHeight:1.7 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'8rem 0',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse 80% 60% at 50% 50%,rgba(99,102,241,0.05),transparent)',pointerEvents:'none' }} />
        <div className="container" style={{ textAlign:'center',position:'relative',zIndex:1 }}>
          <h2 className="headline-lg animate-fade-in-up" style={{ marginBottom:'1.25rem' }}>Prove what you can build.</h2>
          <p style={{ color:'var(--text-secondary)',fontSize:'1.1rem',maxWidth:500,margin:'0 auto 2.5rem' }}>The engineering shape is yours, forever.</p>
          <div style={{ display:'flex',maxWidth:480,margin:'0 auto',gap:0 }}>
            <input className="input" placeholder="Your College ID" style={{ borderRadius:'var(--radius-md) 0 0 var(--radius-md)',borderRight:'none' }} />
            <button className="btn btn-primary" style={{ borderRadius:'0 var(--radius-md) var(--radius-md) 0',whiteSpace:'nowrap' }}>Join Waitlist</button>
          </div>
        </div>
      </section>
    </div>
  );
}
