import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from '../components/Providers'
import MainHeader from '../components/MainHeader'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Quiz Maker',
	description: 'Site where you can create and share your quizzes ',
}

import { cookies } from 'next/headers'
import Script from 'next/script'
export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html
			lang='en'
			className={`${cookies().get('theme')?.value == 'dark' && 'dark'}`}>
			<Script src='https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID' />
			<Script id='google-analytics'>
				{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-60PLMXVTW3');
        `}
			</Script>
			<body
				className={`${inter.className} text-primary bg-slate-50 dark:bg-slate-950 w-screen`}>
				<Providers>
					<MainHeader />
					<Toaster
						position='bottom-right'
						reverseOrder={false}
						gutter={8}
						containerClassName=''
						containerStyle={{}}
						toastOptions={{
							// Define default options
							className: 'bg-slate-100 dark:bg-slate-900 dark:text-slate-100',
							duration: 2000,
						}}
					/>
					<main className='p-5 mx-auto max-w-7xl'>{children}</main>
				</Providers>
			</body>
		</html>
	)
}
