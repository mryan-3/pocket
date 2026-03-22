'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'

interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  preferences?: {
    budgetMin: number
    budgetMax: number
    favoriteCategories: string[]
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth-me'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/auth/me')
        return response.data.data
      } catch (error) {
        return null
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout')
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth-me'], null)
      window.location.href = '/'
    },
  })

  const logout = () => logoutMutation.mutate()

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
