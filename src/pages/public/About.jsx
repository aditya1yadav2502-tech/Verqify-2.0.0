import React from 'react';

export default function About() {
  return (
    <div className="container" style={{ padding: '6rem 0', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>About Verqify</h1>
      <div style={{ fontSize: '1.125rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--color-text-secondary)' }}>
        <p>
          We started Verqify because the engineering hiring system in India is deeply broken.
        </p>
        <p>
          Right now, millions of students are judged by proxy metrics that have nothing to do with building software. 
          A resume is a piece of paper that anyone can fabricate. A CGPA measures your ability to pass exams, not your ability to architect a robust backend. 
          A college tier measures what you did when you were 17, not what you can code at 21. 
        </p>
        <p>
          We believe every engineer has a shape. Some are incredibly product-minded frontend devs. 
          Others are deep systems thinkers who love infrastructure. Some commit steadily every day; others build in intense weekend bursts.
        </p>
        <p>
          Verqify replaces the outdated resume with a Skill Fingerprint. Built purely from your actual work—your commits, 
          your deployments, your hackathon wins. We verify the truth, and we show it to the world.
        </p>
        <p style={{ marginTop: '2rem', fontWeight: '500', color: 'var(--color-text-primary)' }}>
          It's time to let the code speak.
        </p>
      </div>
    </div>
  );
}
