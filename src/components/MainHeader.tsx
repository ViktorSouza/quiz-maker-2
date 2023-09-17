'use client'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { ToggleTheme } from './ToggleTheme'
import { Grip, LogOut, User } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
export default function MainHeader() {
	const session = useSession()
	return (
		<header className='w-screen border-b mb-5'>
			<div className='flex justify-between  p-5 w-full max-w-7xl mx-auto'>
				<Link href={'/'}>
					<h1 className='font-semibold text-blue-500 dark:text-blue-400 text-lg'>
						Quiz Maker 2.0
					</h1>
				</Link>
				<div className='flex gap-3'>
					{session.data?.user ? (
						<div className='flex gap-3 items-center'>
							<h2>{session.data.user.name}</h2>
							<Popover>
								<PopoverTrigger>
									<Grip size={20} />
								</PopoverTrigger>
								<PopoverContent className='flex flex-col justify-start gap-3 w-fit bg-slate-50 dark:bg-slate-900'>
									<ul className='space-y-2'>
										<li className='flex gap-2 items-center'>
											<User size={16} />
											<Link href={'/user/profile'}>Profile</Link>
										</li>
										<li>
											<ToggleTheme text='Toggle Theme' />
										</li>
									</ul>
									<hr />
									<ul>
										<li className='flex gap-2 items-center'>
											<LogOut size={16} />
											<button
												onClick={() => signOut({})}
												className='w-fit'>
												Sign out
											</button>
										</li>
									</ul>
								</PopoverContent>
							</Popover>
						</div>
					) : (
						<button onClick={() => signIn('google')}>Sign In</button>
					)}
				</div>
			</div>
		</header>
	)
}
