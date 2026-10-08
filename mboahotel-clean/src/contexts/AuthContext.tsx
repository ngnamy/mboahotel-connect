import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
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
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteHotelIds, setFavoriteHotelIds] = useState<string[]>([]);

  useEffect(() => {
    // Vérifier si un token existe dans le localStorage
    const savedToken = localStorage.getItem('mboa-hotel-token');
    const savedUser = localStorage.getItem('mboa-hotel-user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    
    setIsLoading(false);
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
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setToken(data.data.token);
        setUser(data.data.user);
        localStorage.setItem('mboa-hotel-token', data.data.token);
        localStorage.setItem('mboa-hotel-user', JSON.stringify(data.data.user));
      } else {
        throw new Error(data.message || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('Erreur login:', error);
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        setToken(data.data.token);
        setUser(data.data.user);
        localStorage.setItem('mboa-hotel-token', data.data.token);
        localStorage.setItem('mboa-hotel-user', JSON.stringify(data.data.user));
      } else {
        throw new Error(data.message || 'Erreur d\'inscription');
      }
    } catch (error) {
      console.error('Erreur register:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mboa-hotel-token');
    localStorage.removeItem('mboa-hotel-user');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    favoriteHotelIds,
    isFavorite,
    addFavorite,
    removeFavorite,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};