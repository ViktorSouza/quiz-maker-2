'use client'
import { Quiz, User } from '@prisma/client'
import { Bookmark } from 'lucide-react'
import React from 'react'
import { api, cn } from '../lib/utils'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
export function PublicQuizCard({
	quiz,
	isFavorite,
}: {
	quiz: Quiz & { User: { id: string; name: string } | null } & {
		_count: {
			User: number
			questions: number
			users: number
			UserPlay: number
		}
	}
	isFavorite: boolean
}) {
	const router = useRouter()
	return (
		<div
			key={quiz.id}
			className='bg-white p-3 px-6 rounded-md flex flex-col justify-between dark:bg-slate-900'>
			<div className='flex justify-between items-center w-full'>
				<Link href={`/quizzes/${quiz.id}`}>
					<h1 className='text-2xl font-semibold col-span-6 text-blue-500 dark:text-blue-400'>
						{quiz.name}
					</h1>
				</Link>
				<button
					title='Add to favorites'
					className={cn(
						'p-2 py-1 items-center bg-slate-200 dark:bg-slate-800 rounded-md flex gap-2',
						{
							'bg-yellow-300 dark:bg-yellow-500/50': isFavorite,
						},
					)}
					onClick={async () => {
						isFavorite
							? await api.delete(`user/favorites/${quiz.id}`)
							: await api.post(`user/favorites/${quiz.id}`)
						router.refresh()
					}}>
					<Bookmark size={16} />
					{quiz._count.users}
				</button>
			</div>
			<p className='text-slate-700 dark:text-slate-300'>{quiz.description}</p>
			<p>{quiz._count.questions} questions</p>
			<div className='flex justify-between'>
				<p className='text-sm text-slate-500'>
					by <span>{quiz.User?.name}</span>
				</p>
				<p className='text-sm text-slate-500'>
					last updated on {new Date(quiz.updatedAt).toLocaleDateString()}
				</p>
			</div>
		</div>
	)
}
