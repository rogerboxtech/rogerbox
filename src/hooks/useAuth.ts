'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'

export interface UserProfile {
  id: string
  name: string
  email: string
  weight: number
  height: number
  gender: 'male' | 'female' | 'other'
  goals: string[]
  targetWeight: number | null
  membershipStatus: 'inactive' | 'active' | 'expired'
}

export function useAuth() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const register = async (userData: {
    name: string
    email: string
    password: string
  }) => {
    setIsLoading(true)
    setError(null)

    try {
      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      })

      if (authError) {
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error('Error al crear el usuario')
      }

      // Crear perfil en la tabla profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: userData.name,
          email: userData.email,
          weight: 0, // Se llenará en el onboarding
          height: 0, // Se llenará en el onboarding
          gender: 'other', // Se llenará en el onboarding
          goals: [], // Se llenará en el onboarding
          target_weight: null,
          membership_status: 'inactive',
        })

      if (profileError) {
        throw new Error(profileError.message)
      }

      return { success: true, userId: authData.user.id }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials: {
    email: string
    password: string
  }) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error('Credenciales incorrectas')
      }

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de login'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await signOut({ redirect: false })
  }

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!(session?.user as any)?.id) return { success: false, error: 'No hay sesión activa' }

    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', (session?.user as any)?.id)

      if (error) {
        throw new Error(error.message)
      }

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar perfil'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user: session?.user as UserProfile | undefined,
    isLoading: status === 'loading' || isLoading,
    isAuthenticated: !!session,
    error,
    register,
    login,
    logout,
    updateProfile,
  }
}
