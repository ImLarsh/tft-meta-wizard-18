
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  username: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  username: null,
  signOut: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  // Function to extract username from user metadata
  const extractUsername = (currentUser: User | null) => {
    if (!currentUser) return null;
    return currentUser.user_metadata?.username || null;
  };

  useEffect(() => {
    console.log('AuthProvider initializing');
    
    // Set up auth state change listener FIRST (to prevent missing auth events)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.info('Auth state changed:', event, currentSession ? 'Session exists' : 'No session');
        
        if (currentSession) {
          // Update state synchronously
          setSession(currentSession);
          setUser(currentSession.user);
          setUsername(extractUsername(currentSession.user));
          
          if (event === 'SIGNED_IN') {
            toast({
              title: "Successfully signed in",
              description: `Welcome ${extractUsername(currentSession.user) || currentSession.user.email || 'to TFT Genie'}!`,
            });
          } else if (event === 'TOKEN_REFRESHED') {
            console.info('Session token refreshed successfully');
          }
        } else if (event === 'SIGNED_OUT') {
          // Only clear states on explicit sign out
          setSession(null);
          setUser(null);
          setUsername(null);
          
          toast({
            title: "Signed out",
            description: "You have been signed out of your account",
          });
        }
      }
    );

    // THEN check for existing session
    const getInitialSession = async () => {
      try {
        console.log('Checking for existing session');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          return;
        }
        
        console.log('Initial session check result:', data?.session ? 'Session found' : 'No session found');
        
        if (data?.session) {
          setSession(data.session);
          setUser(data.session.user);
          setUsername(extractUsername(data.session.user));
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Cleanup subscription on unmount
    return () => {
      console.log('AuthProvider cleaning up');
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('Signing out');
      await supabase.auth.signOut();
      // The onAuthStateChange listener will handle state updates
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out error",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, username, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
