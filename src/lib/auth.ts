import { NextAuthOptions } from 'next-auth'
import { SupabaseAdapter } from '@auth/supabase-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { supabase } from './supabase'

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  }),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Intentar hacer login con Supabase
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          })

          if (error || !data.user) {
            return null
          }

          // Obtener el perfil del usuario
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()

          if (!profile) {
            return null
          }

          return {
            id: data.user.id,
            email: data.user.email,
            name: profile.name,
            weight: profile.weight,
            height: profile.height,
            gender: profile.gender,
            goals: profile.goals,
            targetWeight: profile.target_weight,
            membershipStatus: profile.membership_status,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.weight = user.weight
        token.height = user.height
        token.gender = user.gender
        token.goals = user.goals
        token.targetWeight = user.targetWeight
        token.membershipStatus = user.membershipStatus
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.weight = token.weight as number
        session.user.height = token.height as number
        session.user.gender = token.gender as string
        session.user.goals = token.goals as string[]
        session.user.targetWeight = token.targetWeight as number
        session.user.membershipStatus = token.membershipStatus as string
      }
      return session
    }
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'jwt',
  },
}
