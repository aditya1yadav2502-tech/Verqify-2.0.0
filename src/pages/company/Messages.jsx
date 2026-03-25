import React from 'react';

export default function Messages() {
  return (
    <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: '8px', height: 'calc(100vh - 10rem)', overflow: 'hidden' }}>
      <div style={{ width: '300px', borderRight: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-alt)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Conversations</h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <div style={{ fontWeight: '600' }}>Aditya Yadav</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>2h ago</div>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Thanks! Yes, I'd be interested in an interview.
            </div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Aditya Yadav</h2>
        </div>
        <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
          <div style={{ alignSelf: 'flex-start', backgroundColor: 'var(--color-bg-alt)', padding: '1rem', borderRadius: '8px', maxWidth: '70%' }}>
            Hi Aditya, we loved your consistent commits and your distributed KV store project. We're looking for backend engineers at Stripe. Let's chat?
          </div>
          <div style={{ alignSelf: 'flex-end', backgroundColor: 'var(--color-text-primary)', color: 'var(--color-bg)', padding: '1rem', borderRadius: '8px', maxWidth: '70%' }}>
            Thanks! Yes, I'd be interested in an interview. What's the best time to speak next week?
          </div>
        </div>
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '1rem' }}>
          <input type="text" placeholder="Type a message..." style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '4px' }} />
          <button className="btn btn-primary">Send</button>
        </div>
      </div>
    </div>
  );
}
