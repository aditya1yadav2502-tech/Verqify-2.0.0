import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

export default function Navbar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error('Logout failed');
    else {
      toast.success('Signed out');
      navigate('/');
    }
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100, padding: '1rem 0',
      background: 'rgba(255,255,255,0.8)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0,0,0,0.05)',
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#6366F1,#06B6D4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:'700', color:'#fff', fontFamily:'var(--font-head)' }}>V</div>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Verqify</span>
        </Link>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link to="/" className="btn btn-ghost" style={{ fontSize: '0.9rem' }}>Home</Link>
          <Link to="/company/dashboard" className="btn btn-ghost" style={{ fontSize: '0.9rem' }}>Explore</Link>
          
          <div style={{ width: '1px', height: '18px', background: 'var(--border)', margin: '0 0.5rem' }} />
          
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost" style={{ fontSize: '0.9rem' }}>Dashboard</Link>
              {profile?.username && (
                <Link to={`/s/${profile.username}`} className="btn btn-ghost" style={{ fontSize: '0.9rem' }}>My Profile</Link>
              )}
              <button 
                onClick={handleLogout}
                className="btn btn-secondary" 
                style={{ fontSize: '0.9rem', padding: '0.6rem 1.25rem' }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" style={{ fontSize: '0.9rem' }}>Log In</Link>
              <Link to="/signup" className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0.6rem 1.25rem' }}>Get Verified →</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

