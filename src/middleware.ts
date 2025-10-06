import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware() {
    // Add any custom middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/onboarding/:path*']
}
