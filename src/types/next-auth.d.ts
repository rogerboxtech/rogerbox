declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      weight: number
      height: number
      gender: string
      goals: string[]
      targetWeight: number | null
      membershipStatus: string
    }
  }

  interface User {
    id: string
    name: string
    email: string
    weight: number
    height: number
    gender: string
    goals: string[]
    targetWeight: number | null
    membershipStatus: string
  }
}
