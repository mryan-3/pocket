'use client';

import { useAuthContext } from '@/components/providers/auth-provider';

export function useAuth() {
  const context = useAuthContext();
  
  return {
    user: context.user,
    isLoading: context.isLoading,
    isAuthenticated: context.isAuthenticated,
    logout: context.logout
  };
}
