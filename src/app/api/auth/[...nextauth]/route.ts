import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/db'
import { AuthOptions } from 'next-auth'

export const authOptions: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID ?? '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
		}),
	],
	callbacks: {
		async signIn({ user }) {
			// Handle successful authentication
			// Save user data using Prisma
			if (!user?.email || !user?.name) return false
			if (await prisma.user.count({ where: { email: user.email ?? '' } }))
				return true
			await prisma.user.create({
				data: {
					email: user.email ?? '',
					name: user.name ?? '',
					// Additional fields
				},
			})
			return true
		},
		jwt({ token, user, account, profile }) {
			return { ...token }
		},
		async session({ session, token }) {
			// Populate session with user data from the database

			const userData = await prisma.user.findUnique({
				where: { email: token?.email ?? '' },
			})
			if (userData) session.user = userData
			return session
		},
	},
}
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
