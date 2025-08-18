import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { hashPassword, verifyPassword, generateSessionToken } from '@/lib/auth';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'chairperson' | 'secretary';
  group_id: number | null;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
  hasRole: (role: User['role']) => boolean;
  hasAnyRole: (roles: User['role'][]) => boolean;
  canManageGroup: (groupId: number) => boolean;
  canManageMember: (memberGroupId: number | null) => boolean;
}

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: User['role'];
  group_id?: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const sessionToken = localStorage.getItem('session_token');
      if (sessionToken) {
        const { data: session, error } = await supabase
          .from('user_sessions')
          .select('*')
          .eq('session_token', sessionToken)
          .gt('expires_at', new Date().toISOString())
          .single();

        if (session && !error) {
          // Get user data
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user_id)
            .eq('is_active', true)
            .single();

          if (userData && !userError) {
            setUser(userData as User);
          } else {
            // Clear invalid session
            localStorage.removeItem('session_token');
          }
        } else {
          // Clear expired session
          localStorage.removeItem('session_token');
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
      localStorage.removeItem('session_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Get user by email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (userError || !userData) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Verify password
      if (!verifyPassword(password, userData.password_hash)) {
        return { success: false, error: 'Invalid password' };
      }

      // Create session
      const sessionToken = generateSessionToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session

      const { error: sessionError } = await supabase
        .from('user_sessions')
        .insert({
          user_id: userData.id,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString(),
        });

      if (sessionError) {
        return { success: false, error: 'Failed to create session' };
      }

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userData.id);

      // Store session token
      localStorage.setItem('session_token', sessionToken);
      setUser(userData as User);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    try {
      const sessionToken = localStorage.getItem('session_token');
      if (sessionToken) {
        // Remove session from database
        await supabase
          .from('user_sessions')
          .delete()
          .eq('session_token', sessionToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('session_token');
      setUser(null);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      // Check if user has admin role to create new users
      if (user?.role !== 'admin') {
        return { success: false, error: 'Only administrators can create new users' };
      }

      // Hash password
      const passwordHash = hashPassword(userData.password);

      const { data, error } = await supabase
        .from('users')
        .insert({
          ...userData,
          password_hash: passwordHash,
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Update local user state
      setUser({ ...user, ...data } as User);

      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const isAuthenticated = !!user;

  const hasRole = (role: User['role']) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: User['role'][]) => {
    return user ? roles.includes(user.role) : false;
  };

  const canManageGroup = (groupId: number) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.group_id === groupId && ['chairperson', 'secretary'].includes(user.role);
  };

  const canManageMember = (memberGroupId: number | null) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (!memberGroupId) return false;
    return user.group_id === memberGroupId && ['chairperson', 'secretary'].includes(user.role);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    register,
    updateProfile,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    canManageGroup,
    canManageMember,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
