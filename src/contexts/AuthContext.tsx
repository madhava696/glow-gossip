import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isGuest: boolean;
  guestMessageCount: number;
  incrementGuestCount: () => boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [guestMessageCount, setGuestMessageCount] = useState(0);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setIsGuest(false);
          setGuestMessageCount(0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Load guest count from sessionStorage
    const savedCount = sessionStorage.getItem('guest_message_count');
    if (savedCount) {
      setGuestMessageCount(parseInt(savedCount, 10));
    }

    // Check if user selected guest mode
    const guestMode = sessionStorage.getItem('guest_mode');
    if (guestMode === 'true' && !session?.user) {
      setIsGuest(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const incrementGuestCount = (): boolean => {
    if (!isGuest) return true;
    
    const newCount = guestMessageCount + 1;
    if (newCount > 20) {
      return false;
    }
    
    setGuestMessageCount(newCount);
    sessionStorage.setItem('guest_message_count', newCount.toString());
    return true;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsGuest(false);
    setGuestMessageCount(0);
    sessionStorage.removeItem('guest_message_count');
    sessionStorage.removeItem('guest_mode');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isGuest,
        guestMessageCount,
        incrementGuestCount,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
