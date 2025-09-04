import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { usersService, companiesService, Company } from '../lib/database';

interface AppUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  company?: string;
  company_id?: string;
  status?: string;
  professional_email?: string;
  position?: string;
  sector?: string;
  company_size?: string;
  challenges_and_suggestions?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  trial_exchanges_used?: number;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  appUser: AppUser | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  connectionError: string | null;
  isSuperAdmin: boolean;
  selectedCompanyId: string | null;
  currentCompany: Company | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (updates: Partial<AppUser>) => Promise<{ error: any }>;
  retryConnection: () => Promise<void>;
  switchCompany: (companyId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);

  const clearAuthState = () => {
    setUser(null);
    setAppUser(null);
    setSession(null);
    setIsSuperAdmin(false);
    setSelectedCompanyId(null);
    setCurrentCompany(null);
    
    // Clear localStorage
    try {
      localStorage.removeItem('selected_company_id');
      localStorage.removeItem('supabase.auth.token');
      // Clear any other auth-related items
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase')) {
          localStorage.removeItem(key);
        }
      });
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear storage:', e);
    }
  };

  const checkSupabaseConnection = async (): Promise<boolean> => {
    try {
      // Use a simpler query that doesn't require authentication
      const { error } = await supabase.from('users').select('count').limit(1);
      
      if (error) {
        console.error('Supabase connection test failed:', error);
        
        // Handle specific error cases
        if (error.message.includes('Invalid Refresh Token') || 
            error.message.includes('Session Expired') ||
            error.message.includes('session_expired')) {
          console.log('Session expired, clearing auth state...');
          clearAuthState();
          await supabase.auth.signOut({ scope: 'global' });
          setConnectionError('Votre session a expiré. Veuillez vous reconnecter.');
          return false;
        }
        
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('NetworkError') ||
            error.message.includes('fetch')) {
          setConnectionError('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
          return false;
        }
        
        setConnectionError(`Erreur de connexion à la base de données: ${error.message}`);
        return false;
      }
      
      setConnectionError(null);
      return true;
    } catch (error: any) {
      console.error('Failed to connect to Supabase:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setConnectionError('Impossible de se connecter au serveur. Vérifiez votre connexion internet et réessayez.');
        return false;
      }
      
      if (error.message?.includes('Invalid Refresh Token') || 
          error.message?.includes('Session Expired')) {
        console.log('Session expired during connection test, clearing auth state...');
        clearAuthState();
        await supabase.auth.signOut({ scope: 'global' });
        setConnectionError('Votre session a expiré. Veuillez vous reconnecter.');
        return false;
      }
      
      setConnectionError('Erreur de connexion. Veuillez réessayer dans quelques instants.');
      return false;
    }
  };

  const loadAppUser = async (authUser: User): Promise<AppUser | null> => {
    try {
      const { data, error } = await usersService.getCurrentUser();

      if (error) {
        console.error('Error loading app user:', error);
        
        // Handle session expired errors
        if (error.message?.includes('Invalid Refresh Token') || 
            error.message?.includes('Session Expired') ||
            error.message?.includes('session_expired')) {
          console.log('Session expired while loading user, clearing auth state...');
          clearAuthState();
          await supabase.auth.signOut({ scope: 'global' });
          throw new Error('Votre session a expiré. Veuillez vous reconnecter.');
        }
        
        throw new Error(`Erreur lors du chargement du profil: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error loading app user:', error);
      throw error;
    }
  };

  const checkSuperAdminStatus = async () => {
    try {
      const { isSuperAdmin: isSuper, error } = await usersService.isSuperAdmin();
      if (error) {
        console.error('Error checking super admin status:', error);
        
        // Handle session expired errors
        if (error.message?.includes('Invalid Refresh Token') || 
            error.message?.includes('Session Expired') ||
            error.message?.includes('session_expired')) {
          return false;
        }
        
        return false;
      }
      return isSuper;
    } catch (error) {
      console.error('Error checking super admin status:', error);
      return false;
    }
  };

  const loadCurrentCompany = async (companyId: string) => {
    try {
      const { data, error } = await companiesService.getById(companyId);
      if (error) {
        console.error('Error loading company:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error loading company:', error);
      return null;
    }
  };

  const setupAuth = async () => {
    try {
      setLoading(true);
      setConnectionError(null);

      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        setIsConfigured(false);
        setLoading(false);
        return;
      }

      // Test Supabase connection first
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        setLoading(false);
        return;
      }

      // Get initial session with error handling
      let initialSession: Session | null = null;
      try {
        const { data: { session: sessionData }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          
          if (sessionError.message?.includes('Invalid Refresh Token') || 
              sessionError.message?.includes('Session Expired') ||
              sessionError.message?.includes('session_expired')) {
            console.log('Session expired, clearing auth state...');
            clearAuthState();
            await supabase.auth.signOut({ scope: 'global' });
            setConnectionError('Votre session a expiré. Veuillez vous reconnecter.');
            setLoading(false);
            return;
          }
          
          setConnectionError(`Erreur d'authentification: ${sessionError.message}`);
          setLoading(false);
          return;
        }
        
        initialSession = sessionData;
      } catch (error: any) {
        console.error('Exception getting session:', error);
        
        if (error.message?.includes('Invalid Refresh Token') || 
            error.message?.includes('Session Expired')) {
          console.log('Session expired exception, clearing auth state...');
          clearAuthState();
          await supabase.auth.signOut({ scope: 'global' });
          setConnectionError('Votre session a expiré. Veuillez vous reconnecter.');
          setLoading(false);
          return;
        }
        
        setConnectionError('Erreur lors de la récupération de la session.');
        setLoading(false);
        return;
      }

      if (initialSession?.user) {
        try {
          const appUserData = await loadAppUser(initialSession.user);
          const isSuper = await checkSuperAdminStatus();
          
          setUser(initialSession.user);
          setAppUser(appUserData);
          setSession(initialSession);
          setIsSuperAdmin(isSuper);

          // Charger la compagnie sélectionnée pour les super admins
          const savedCompanyId = usersService.getSelectedCompany();
          if (isSuper && savedCompanyId) {
            setSelectedCompanyId(savedCompanyId);
            const company = await loadCurrentCompany(savedCompanyId);
            setCurrentCompany(company);
          } else if (appUserData?.company_id) {
            // Pour les utilisateurs normaux, charger leur compagnie
            const company = await loadCurrentCompany(appUserData.company_id);
            setCurrentCompany(company);
          }
        } catch (error) {
          console.error('Error loading app user:', error);
          setConnectionError(error instanceof Error ? error.message : 'Erreur lors du chargement du profil utilisateur');
          
          // If it's a session error, clear the state
          if (error instanceof Error && 
              (error.message.includes('session a expiré') || 
               error.message.includes('Invalid Refresh Token'))) {
            clearAuthState();
          }
        }
      }

      // Listen for auth changes with improved error handling
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !session) {
          console.log('User signed out or token refresh failed, clearing all state...');
          clearAuthState();
          return;
        }
        
        if (event === 'TOKEN_REFRESHED' && session) {
          console.log('Token refreshed successfully');
          setSession(session);
          return;
        }
        
        if (session?.user) {
          try {
            const appUserData = await loadAppUser(session.user);
            const isSuper = await checkSuperAdminStatus();
            
            setUser(session.user);
            setAppUser(appUserData);
            setSession(session);
            setIsSuperAdmin(isSuper);

            // Charger la compagnie appropriée
            const savedCompanyId = usersService.getSelectedCompany();
            if (isSuper && savedCompanyId) {
              setSelectedCompanyId(savedCompanyId);
              const company = await loadCurrentCompany(savedCompanyId);
              setCurrentCompany(company);
            } else if (appUserData?.company_id) {
              const company = await loadCurrentCompany(appUserData.company_id);
              setCurrentCompany(company);
            }
            
            // Clear any connection errors on successful auth
            setConnectionError(null);
          } catch (error) {
            console.error('Error loading app user during auth change:', error);
            
            if (error instanceof Error && 
                (error.message.includes('session a expiré') || 
                 error.message.includes('Invalid Refresh Token'))) {
              clearAuthState();
              setConnectionError('Votre session a expiré. Veuillez vous reconnecter.');
            } else {
              setConnectionError(error instanceof Error ? error.message : 'Erreur lors du chargement du profil utilisateur');
              clearAuthState();
            }
          }
        } else if (event !== 'SIGNED_OUT') {
          clearAuthState();
        }
      });

      setLoading(false);

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Setup auth error:', error);
      setConnectionError(error instanceof Error ? error.message : 'Erreur lors de l\'initialisation de l\'authentification');
      setLoading(false);
    }
  };

  const retryConnection = async () => {
    setConnectionError(null);
    await setupAuth();
  };

  const switchCompany = async (companyId: string) => {
    if (!isSuperAdmin) return;
    
    setSelectedCompanyId(companyId);
    usersService.switchToCompany(companyId);
    
    const company = await loadCurrentCompany(companyId);
    setCurrentCompany(company);
  };

  useEffect(() => {
    setupAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setConnectionError(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      if (error.message?.includes('Failed to fetch')) {
        setConnectionError('Erreur de connexion. Vérifiez votre connexion internet.');
      } else {
        setConnectionError('Erreur lors de la connexion.');
      }
      
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setConnectionError(null);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      return { error };
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      if (error.message?.includes('Failed to fetch')) {
        setConnectionError('Erreur de connexion. Vérifiez votre connexion internet.');
      } else {
        setConnectionError('Erreur lors de l\'inscription.');
      }
      
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting signOut process...');
      setConnectionError(null);
      
      // Nettoyer immédiatement l'état local
      clearAuthState();
      
      // Déconnexion de Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Supabase signOut error:', error);
        // Ne pas lancer d'erreur, car l'état local est déjà nettoyé
      }
      
      console.log('SignOut completed successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      // Même en cas d'erreur, on nettoie l'état local
      clearAuthState();
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setConnectionError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      if (error.message?.includes('Failed to fetch')) {
        setConnectionError('Erreur de connexion. Vérifiez votre connexion internet.');
      } else {
        setConnectionError('Erreur lors de la réinitialisation du mot de passe.');
      }
      
      return { error };
    }
  };

  const updateProfile = async (updates: Partial<AppUser>) => {
    if (!appUser) return { error: new Error('No user logged in') };

    try {
      setConnectionError(null);
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', appUser.id);

      if (!error) {
        setAppUser({ ...appUser, ...updates });
      }

      return { error };
    } catch (error: any) {
      console.error('Update profile error:', error);
      
      if (error.message?.includes('Failed to fetch')) {
        setConnectionError('Erreur de connexion. Vérifiez votre connexion internet.');
      } else if (error.message?.includes('Invalid Refresh Token') || 
                 error.message?.includes('Session Expired')) {
        clearAuthState();
        setConnectionError('Votre session a expiré. Veuillez vous reconnecter.');
      } else {
        setConnectionError('Erreur lors de la mise à jour du profil.');
      }
      
      return { error };
    }
  };

  const value = {
    user,
    appUser,
    session,
    loading,
    isConfigured,
    connectionError,
    isSuperAdmin,
    selectedCompanyId,
    currentCompany,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    retryConnection,
    switchCompany,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};