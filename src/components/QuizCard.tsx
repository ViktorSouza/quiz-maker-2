import { Quiz } from '@prisma/client'
import Link from 'next/link'
import QuizEditorComponent from './QuizEditorComponent'
import { Bookmark, Lock } from 'lucide-react'

export default function QuizCard({
	quiz,
	isQuizAlreadyPlayed,
	isFavorite,
}: {
	isQuizAlreadyPlayed: boolean
	isFavorite: boolean
	quiz: Quiz & {
		_count: {
			User: number
			questions: number
		}
	}
}) {
	return (
		<div
			key={quiz.id}
			className='bg-slate-100 dark:bg-slate-900 p-4 rounded-md grid gap-5 col-span-6 grid-cols-4 md:grid-cols-6 items-center'>
			<Link
				href={`/quizzes/${quiz.id}`}
				className='col-span-2'>
				<div className='flex gap-2 items-center '>
					<h1>{quiz.name}</h1>
					{quiz.visibility === 'Private' && (
						<Lock
							size={12}
							className='text-sm text-slate-500'
						/>
					)}
					{isFavorite && (
						<Bookmark
							className='text-yellow-500'
							size={12}
						/>
					)}
				</div>
				<p className='text-xs text-slate-500'>
					Created:{' '}
					{quiz.createdAt.toLocaleDateString(undefined, {
						day: '2-digit',
						month: 'short',
						year: 'numeric',
					})}
				</p>
			</Link>
			<QuizEditorComponent
				isEditing
				quiz={quiz}
			/>
			<span className='md:inline-block hidden'>{quiz._count.questions}</span>
			<span className='md:inline-block hidden'>
				{quiz.updatedAt.toLocaleDateString(undefined, {
					day: '2-digit',
					month: 'short',
					year: 'numeric',
				})}
			</span>
			<Link
				href={`/play/quiz/${quiz.id}`}
				className='bg-blue-500 transition  hover:bg-blue-400 px-4 py-2 rounded-md text-slate-100 text-center'>
				{isQuizAlreadyPlayed ? 'Continue' : 'Play'}
			</Link>
		</div>
	)
}
