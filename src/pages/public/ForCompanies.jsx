import React from 'react';
import { Link } from 'react-router-dom';

export default function ForCompanies() {
  return (
    <div className="container" style={{ padding: '6rem 0' }}>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', maxWidth: '800px' }}>Hire builders, not resumes.</h1>
      <p className="text-secondary" style={{ fontSize: '1.25rem', maxWidth: '600px', marginBottom: '3rem' }}>
        Stop filtering by college tier and GPA. Discover verified engineering talent based entirely on what they have built and deployed.
      </p>
      <Link to="/company/login" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
        Start Hiring
      </Link>
      
      <div style={{ marginTop: '6rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
          <h3>Verified Proof</h3>
          <p className="text-secondary">We parse GitHub commits, deployments, and hackathon wins to prove every skill tag.</p>
        </div>
        <div style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
          <h3>No Application Spam</h3>
          <p className="text-secondary">You search signatures, you reach out. Students cannot spam apply to your roles.</p>
        </div>
      </div>
    </div>
  );
}
