import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { supabase } from './supabase'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        try {
          console.log('Attempting login with:', credentials.email)
          
          // Intentar hacer login con Supabase
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          })

          console.log('Supabase auth result:', { data, error })

          if (error) {
            console.error('Supabase auth error:', error)
            return null
          }

          if (!data.user) {
            console.log('No user data returned')
            return null
          }

          // Obtener el perfil del usuario
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()

          console.log('Profile fetch result:', { profile, profileError })

          if (profileError) {
            console.error('Profile fetch error:', profileError)
            return null
          }

          if (!profile) {
            console.log('No profile found')
            return null
          }

          console.log('Login successful for user:', profile.name)
          
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
