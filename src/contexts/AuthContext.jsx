import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(Boolean(supabase));

  const fetchProfile = async (userId) => {
    if (!supabase || !userId) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      setProfile(null);
      return;
    }
    if (data) setProfile(data);
  };

  // Persist GitHub username after OAuth sign-in
  const syncGithubUsername = async (authUser) => {
    if (!supabase || !authUser) return;
    const ghUsername = authUser.user_metadata?.user_name;
    if (!ghUsername) return;
    await supabase.from('profiles').upsert({
      id: authUser.id,
      github_username: ghUsername,
      updated_at: new Date().toISOString(),
    });
  };

  useEffect(() => {
    if (!supabase) {
      return;
    }

    // Initial fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    // Listeners for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        // Persist GitHub username on fresh OAuth sign-in
        if (event === 'SIGNED_IN' && session.user.app_metadata?.provider === 'github') {
          syncGithubUsername(session.user);
        }
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    profile,
    loading,
    needsOnboarding: Boolean(session && profile && !profile.full_name),
    signOut: () => {
      setSession(null);
      setUser(null);
      setProfile(null);
      return supabase?.auth.signOut();
    }
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

