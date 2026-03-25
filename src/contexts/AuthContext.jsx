import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listeners for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    loading,
    signOut: () => supabase.auth.signOut()
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
