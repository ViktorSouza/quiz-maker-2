'use client'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { ToggleTheme } from './ToggleTheme'
import { Grip, LogOut, User } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import SearchBar from './SearchBar'

export default function MainHeader() {
	const session = useSession()
	return (
		<header className='w-screen border-b mb-5'>
			<div className='flex justify-between items-center p-5 w-full max-w-7xl mx-auto gap-5 flex-shrink'>
				<Link href={'/'}>
					<h1 className='font-semibold text-blue-500 dark:text-blue-400 text-lg w-max'>
						Quiz Maker 2.0
					</h1>
				</Link>
				<SearchBar />
				<div className='flex gap-3'>
					<div className='flex gap-3 items-center'>
						{session.data?.user ? (
							<h2 className='hidden md:block'>{session.data.user.name}</h2>
						) : (
							<button onClick={() => signIn('google')}>Sign In</button>
						)}

						<Popover>
							<PopoverTrigger>
								<Grip size={24} />
							</PopoverTrigger>
							<PopoverContent className='flex flex-col justify-start gap-3 w-fit bg-slate-50 dark:bg-slate-900'>
								<ul className='space-y-2'>
									{session.data?.user && (
										<li className='flex gap-2 items-center'>
											<User size={16} />
											<Link href={'/user/profile'}>Profile</Link>
										</li>
									)}
									<li>
										<ToggleTheme text='Toggle Theme' />
									</li>
								</ul>
								<hr />
								<ul>
									{session.data?.user && (
										<li className='flex gap-2 items-center'>
											<LogOut size={16} />
											<button
												onClick={() => signOut({})}
												className='w-fit'>
												Sign out
											</button>
										</li>
									)}
								</ul>
							</PopoverContent>
						</Popover>
					</div>
				</div>
			</div>
		</header>
	)
}
