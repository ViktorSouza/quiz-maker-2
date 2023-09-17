import { PublicQuizCard } from '@/components/PublicQuizCard'
import { Bookmark } from 'lucide-react'
import QuizCard from '../components/QuizCard'
import { prisma } from '../lib/db'
import { getCurrentUser } from '../lib/utils'
import PaginationServer from '../components/PaginationServer'
import Link from 'next/link'
import QuizEditorComponent from '../components/QuizEditorComponent'
import QuestionEditorComponent from '../components/QuestionEditorComponent'

export default async function PublicQuizzes({
	params,
	searchParams,
}: {
	params: { id: string }
	searchParams: { [key: string]: string }
}) {
	const user = await getCurrentUser()
	const page = Number(searchParams.page || '0') || 0
	const quizzes = await prisma.quiz.findMany({
		where: {
			visibility: 'Public',
			name: { contains: searchParams.search },
		},
		include: {
			_count: true,
			User: { select: { name: true, id: true } },
			users: true,
		},
		skip: page,
		take: 10,
	})
	const totalPages = Math.floor(
		((await prisma.quiz.count({ where: { visibility: 'Public' } })) ?? 0) / 10,
	)
	return (
		<>
			<div className='flex justify-between'>
				<h1 className='justify-self-start text-2xl font-semibold col-span-6'>
					Public Quizzes
				</h1>
				<div className='flex items-stretch gap-3 col-span-6 justify-end'>
					<QuestionEditorComponent />
					<QuizEditorComponent />
					<Link
						href={'my-quizzes'}
						className='bg-slate-200 text-sm font-medium dark:bg-slate-900 transition hover:bg-slate-300  dark:hover:bg-slate-700 text-primary px-4 py-2 rounded-md'>
						My Quizzes
					</Link>
				</div>
			</div>
			<section className='col-span-6 my-5 grid grid-cols-2 gap-5'>
				{quizzes.map((quiz) => {
					return (
						<PublicQuizCard
							key={quiz.id}
							isFavorite={quiz.users
								.map((user) => user.id)
								.includes(user?.id ?? '')}
							quiz={quiz}
						/>
					)
				})}
			</section>
			<PaginationServer
				page={page}
				totalPages={totalPages}
			/>
		</>
	)
}
