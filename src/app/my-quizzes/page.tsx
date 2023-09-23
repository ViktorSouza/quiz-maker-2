import QuizCard from '@/components/QuizCard'
import Image from 'next/image'
import QuestionEditorComponent from '@/components/QuestionEditorComponent'
import { api, getCurrentUser } from '@/lib/utils'
import { QuestionCard } from '../../components/QuestionCard'
import ActivityChart from '@/components/ActivityChart'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import QuizEditorComponent from '@/components/QuizEditorComponent'
import PaginationServer from '@/components/PaginationServer'

export default async function Home({
	searchParams,
}: {
	searchParams: { [key: string]: string }
}) {
	const page = Number(searchParams.page || '0') || 0
	const user = await getCurrentUser()
	if (!user) return 'You must be logged in'

	const activities = user?.id
		? await prisma.userPlay.findMany({
				where: {
					userId: user.id,
				},
				orderBy: { createdAt: 'desc' },
				include: { Question: true },
		  })
		: undefined

	const quiz = await prisma.quiz.findMany({
		where: {
			OR: [
				{
					userId: user?.id,
				},
				{
					users: {
						some: { id: user?.id },
					},
				},
			],
		},
		skip: page,

		take: 10,
		include: {
			_count: true,
		},
	})
	const totalPages = Math.floor(
		((await prisma.quiz.count({ where: { userId: user?.id } })) ?? 0) / 10,
	)

	return (
		<div className='grid grid-cols-8 gap-3'>
			<h1 className='text-2xl font-semibold col-span-2'>Quizzes</h1>
			<div className='flex items-stretch gap-3 col-span-6 justify-end'>
				<QuestionEditorComponent />
				<QuizEditorComponent />
				<Link
					href={'/'}
					className='bg-slate-200 text-sm font-medium dark:bg-slate-900 transition hover:bg-slate-300  dark:hover:bg-slate-700 text-primary px-4 py-2 rounded-md'>
					Public Quizzes
				</Link>
			</div>

			<section className='col-span-6'>
				<section className='col-span-6 grid grid-cols-6 text-slate-500'>
					<span className='text-sm font-medium col-span-3 pl-4'>Quiz</span>
					<span className='text-sm font-medium'>Questions</span>
					<span className='text-sm font-medium'>Updated</span>
				</section>
				<section className='col-span-6 my-5 grid grid-cols-6 gap-5'>
					{quiz.map(async (quiz) => {
						const lastQuizPlayed = await prisma.quizPlay.findFirst({
							where: {
								userId: user.id,
								quizId: quiz.id,
							},
							orderBy: {
								id: 'desc',
							},
							include: {
								UserPlay: true,
								_count: true,
								quiz: { include: { _count: true } },
							},
						})
						const isQuizSessionConcluded =
							lastQuizPlayed?._count.UserPlay === 0 ||
							lastQuizPlayed?._count.UserPlay === quiz._count.questions
						return (
							<QuizCard
								isQuizAlreadyPlayed={
									!isQuizSessionConcluded && !!lastQuizPlayed?.id
								}
								isFavorited={quiz.usersIds.includes(user.id)}
								key={quiz.id}
								quiz={quiz}
							/>
						)
					})}
				</section>
				<PaginationServer
					page={page}
					totalPages={totalPages}
				/>
			</section>
			<section className='col-span-2 '>
				{activities && (
					<>
						<h1 className='text-2xl font-semibold'>Your activities</h1>
						<ActivityChart activities={activities} />{' '}
					</>
				)}
			</section>
		</div>
	)
}
