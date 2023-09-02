'use client'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
export default function MainHeader() {
	const session = useSession()
	console.log(session)
	return (
		<header className='w-screen border-b border-slate-300 p-5 mb-5'>
			<div className='flex justify-between w-full max-w-7xl mx-auto'>
				<Link href={'/'}>
					<h1 className='font-semibold text-blue-500 text-lg'>
						Quiz Maker 2.0
					</h1>
				</Link>
				{session.data?.user ? (
					<div>
						<h2>{session.data.user.name}</h2>
						{/* <img
							title='Avatar'
							className='rounded-full'
							src={session.data.user.image ?? ''}></img> */}
					</div>
				) : (
					<button onClick={() => signIn('google')}>Sign In</button>
				)}
			</div>
		</header>
	)
}
