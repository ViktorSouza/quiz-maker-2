import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from '../components/Providers'
import MainHeader from '../components/MainHeader'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
}

import { cookies } from 'next/headers'
export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html
			lang='en'
			className={`${cookies().get('theme')?.value == 'dark' && 'dark'}`}>
			<body
				className={`${inter.className} text-primary bg-slate-100 dark:bg-slate-950 `}>
				<Providers>
					<MainHeader />
					<main className='max-w-7xl mx-auto p-5'>{children}</main>
				</Providers>
			</body>
		</html>
	)
}
