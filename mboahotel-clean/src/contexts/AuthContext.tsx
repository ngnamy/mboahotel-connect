import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User as AuthUser } from '@supabase/supabase-js';
import type { User } from '../types';
import { requireSupabase, supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: RegisterData) => Promise<{ emailConfirmationRequired: boolean }>;
  updateProfile: (profile: Pick<User, 'firstName' | 'lastName' | 'phone'>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  authError: string | null;
  favoriteHotelIds: string[];
  isFavorite: (hotelId: string) => boolean;
  addFavorite: (hotelId: string) => void;
  removeFavorite: (hotelId: string) => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'client' | 'hotelier';
  businessName?: string;
  businessCity?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const getProfile = async (authUser: AuthUser): Promise<User> => {
  const client = requireSupabase();
  const { data: profile, error: profileError } = await client
    .from('profiles')
    .select('id,email,first_name,last_name,phone,role,created_at,updated_at')
    .eq('id', authUser.id)
    .single();

  if (profileError) throw profileError;

  const { data: application, error: applicationError } = await client
    .from('partner_applications')
    .select('status')
    .eq('user_id', authUser.id)
    .maybeSingle();

  if (applicationError) throw applicationError;

  return {
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    phone: profile.phone ?? undefined,
    role: profile.role,
    createdAt: new Date(profile.created_at),
    updatedAt: new Date(profile.updated_at),
    partnerApplicationStatus: application?.status ?? undefined,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [favoriteHotelIds, setFavoriteHotelIds] = useState<string[]>([]);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let active = true;
    let requestId = 0;

    const applySession = async (session: Session | null) => {
      const currentRequest = ++requestId;
      setToken(session?.access_token ?? null);
      setAuthError(null);

      if (!session) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const profile = await getProfile(session.user);
        if (active && currentRequest === requestId) setUser(profile);
      } catch (error) {
        console.error('Impossible de charger le profil Supabase:', error);
        if (active && currentRequest === requestId) {
          setUser(null);
          setAuthError('Votre session est active, mais votre profil est indisponible. Vérifiez que la migration Supabase a été appliquée.');
        }
      } finally {
        if (active && currentRequest === requestId) setIsLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      queueMicrotask(() => void applySession(session));
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        console.error('Impossible de restaurer la session Supabase:', error);
        setAuthError('La session du compte n’a pas pu être restaurée. Reconnectez-vous.');
        setIsLoading(false);
        return;
      }
      void applySession(data.session);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setFavoriteHotelIds([]);
      return;
    }

    const savedFavorites = localStorage.getItem(`mboa-hotel-favorites:${user.id}`);
    if (!savedFavorites) {
      setFavoriteHotelIds([]);
      return;
    }

    try {
      const parsedFavorites: unknown = JSON.parse(savedFavorites);
      if (Array.isArray(parsedFavorites) && parsedFavorites.every(id => typeof id === 'string')) {
        setFavoriteHotelIds(parsedFavorites);
      } else {
        console.error('Les favoris enregistrés ont un format invalide.');
        setFavoriteHotelIds([]);
      }
    } catch (error) {
      console.error('Impossible de lire les favoris enregistrés:', error);
      setFavoriteHotelIds([]);
    }
  }, [user?.id]);

  const isFavorite = (hotelId: string) => favoriteHotelIds.includes(hotelId);

  const addFavorite = (hotelId: string) => {
    if (!user || isFavorite(hotelId)) return;
    const nextFavorites = [...favoriteHotelIds, hotelId];
    localStorage.setItem(`mboa-hotel-favorites:${user.id}`, JSON.stringify(nextFavorites));
    setFavoriteHotelIds(nextFavorites);
  };

  const removeFavorite = (hotelId: string) => {
    if (!user || !isFavorite(hotelId)) return;
    const nextFavorites = favoriteHotelIds.filter(id => id !== hotelId);
    localStorage.setItem(`mboa-hotel-favorites:${user.id}`, JSON.stringify(nextFavorites));
    setFavoriteHotelIds(nextFavorites);
  };

  const login = async (email: string, password: string) => {
    const client = requireSupabase();
    setAuthError(null);
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.user || !data.session) throw new Error('La connexion n’a pas créé de session.');

    const profile = await getProfile(data.user);
    setToken(data.session.access_token);
    setUser(profile);
    return profile;
  };

  const register = async (userData: RegisterData) => {
    const client = requireSupabase();
    setAuthError(null);
    const { data, error } = await client.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone ?? '',
          requested_role: userData.role ?? 'client',
          business_name: userData.businessName ?? '',
          business_city: userData.businessCity ?? '',
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('Supabase n’a pas retourné le compte créé.');

    if (data.session) {
      const profile = await getProfile(data.user);
      setToken(data.session.access_token);
      setUser(profile);
    }

    return { emailConfirmationRequired: !data.session };
  };

  const refreshProfile = async () => {
    const client = requireSupabase();
    const { data, error } = await client.auth.getUser();
    if (error) throw error;
    if (!data.user) throw new Error('Aucun compte connecté.');
    setUser(await getProfile(data.user));
  };

  const updateProfile = async (profile: Pick<User, 'firstName' | 'lastName' | 'phone'>) => {
    if (!user) throw new Error('Connectez-vous pour modifier votre profil.');
    const client = requireSupabase();
    const { error } = await client
      .from('profiles')
      .update({
        first_name: profile.firstName.trim(),
        last_name: profile.lastName.trim(),
        phone: profile.phone?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) throw error;
    await refreshProfile();
  };

  const logout = async () => {
    const client = requireSupabase();
    const { error } = await client.auth.signOut();
    if (error) throw error;
    setUser(null);
    setToken(null);
    setAuthError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    updateProfile,
    refreshProfile,
    logout,
    isLoading,
    authError,
    favoriteHotelIds,
    isFavorite,
    addFavorite,
    removeFavorite,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
