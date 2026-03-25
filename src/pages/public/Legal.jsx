import React from 'react';

export function PrivacyPolicy() {
  return (
    <div className="container" style={{ padding: '6rem 0', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem' }}>Privacy Policy</h1>
      <p className="text-secondary mb-4">Last Updated: March 2026</p>
      <div className="text-secondary" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <p>This is a placeholder for the Privacy Policy. We collect data from your connected Git providers solely to generate your Skill Fingerprint.</p>
      </div>
    </div>
  );
}

export function TermsOfService() {
  return (
    <div className="container" style={{ padding: '6rem 0', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem' }}>Terms of Service</h1>
      <p className="text-secondary mb-4">Last Updated: March 2026</p>
      <div className="text-secondary" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <p>This is a placeholder for the Terms of Service. By using Verqify, you agree not to falsify your code contributions.</p>
      </div>
    </div>
  );
}

export function Contact() {
  return (
    <div className="container" style={{ padding: '6rem 0', maxWidth: '600px' }}>
      <h1 style={{ marginBottom: '1rem' }}>Contact Us</h1>
      <p className="text-secondary mb-8">Have a question? We'd love to hear from you.</p>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label>Name</label>
          <input type="text" style={{ padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '4px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label>Email</label>
          <input type="email" style={{ padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '4px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label>Message</label>
          <textarea rows="5" style={{ padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '4px' }}></textarea>
        </div>
        <button type="button" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Send Message</button>
      </form>
    </div>
  );
}
