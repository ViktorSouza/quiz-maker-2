'use client'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { ToggleTheme } from './ToggleTheme'
import { Grip } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
export default function MainHeader() {
	const session = useSession()
	console.log(session)
	return (
		<header className='w-screen border-b  p-5 mb-5'>
			<div className='flex justify-between w-full max-w-7xl mx-auto'>
				<Link href={'/'}>
					<h1 className='font-semibold text-blue-500 dark:text-blue-400 text-lg'>
						Quiz Maker 2.0
					</h1>
				</Link>
				<ToggleTheme />
				{session.data?.user ? (
					<div className='flex gap-3 items-center'>
						<h2>{session.data.user.name}</h2>
						<Popover>
							<PopoverTrigger>
								<Grip />
							</PopoverTrigger>
							<PopoverContent className='flex flex-col'>
								<Link href={'/user/profile'}>Profile</Link>
								<button onClick={() => signOut({})}>Sign out</button>
							</PopoverContent>
						</Popover>
					</div>
				) : (
					<button onClick={() => signIn('google')}>Sign In</button>
				)}
			</div>
		</header>
	)
}
