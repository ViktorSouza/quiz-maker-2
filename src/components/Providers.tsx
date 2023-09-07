'use client'

import { SessionProvider } from 'next-auth/react'
import { QuizzesProvider } from '../contexts/QuizzesContext'
import { ThemeProvider } from '../hooks/useTheme'

export default function Providers(props: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<ThemeProvider>
				<QuizzesProvider>{props.children}</QuizzesProvider>
			</ThemeProvider>
		</SessionProvider>
	)
}
