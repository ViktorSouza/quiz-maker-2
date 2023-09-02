'use client'

import { SessionProvider } from 'next-auth/react'
import { QuizzesProvider } from '../contexts/QuizzesContext'

export default function Providers(props: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<QuizzesProvider>{props.children}</QuizzesProvider>
		</SessionProvider>
	)
}
