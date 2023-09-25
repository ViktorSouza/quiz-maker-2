import PaginationServer from '@/components/PaginationServer'
import { BreadCrumbs } from '@/components/Breadcrumbs'
import GoBack from '@/components/GoBack'
import { notFound } from 'next/navigation'
import { QuestionCard } from '../../../components/QuestionCard'
import { prisma } from '../../../lib/db'
import { getCurrentUser } from '../../../lib/utils'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Pagination } from '../../../components/Pagination'

export default async function Quiz({
	params,
	searchParams,
}: {
	params: { id: string }
	searchParams: { [key: string]: string }
}) {
	const page = Number(searchParams.page || '0') || 0
	const user = await getCurrentUser()

	const validIdRegEx = /^[0-9a-fA-F]{24}$/
	if (!RegExp(validIdRegEx).exec(params.id)) {
		//TODO improve this
		return 'Invalid id'
	}

	const quiz = await prisma.quiz.findUnique({
		where: {
			id: params.id,

			OR: [
				{
					visibility: 'Private',
					userId: user?.id,
				},
				{
					visibility: 'Public',
				},
			],
		},
		include: {
			User: true,
			_count: { select: { questions: true } },
		},
	})
	if (!quiz) return notFound()
	const questions = await prisma.question.findMany({
		where: {
			quizId: quiz?.id,
		},
		skip: page,
		take: 10,
	})

	const publicPlays = await prisma.quizPlay.count({
		where: {
			quizId: params.id,
		},
	})
	const plays = await prisma.quizPlay.count({
		where: {
			quizId: params.id,
			userId: user?.id,
		},
	})

	const totalPages = Math.floor((quiz?._count.questions ?? 0) / 10)
	const lastQuizPlayed =
		user?.id &&
		(await prisma.quizPlay.findFirst({
			where: {
				userId: user.id,
				quizId: quiz.id,
			},
			orderBy: {
				id: 'desc',
			},
			include: {
				UserPlay: { where: { userId: user?.id } },
				_count: true,
				quiz: { include: { _count: true } },
			},
		}))
	const isQuizSessionConcluded =
		lastQuizPlayed &&
		(lastQuizPlayed?._count.UserPlay === 0 ||
			lastQuizPlayed?._count.UserPlay === quiz._count.questions)

	const isQuizAlreadyPlayed =
		//Prevent Typescript error
		!isQuizSessionConcluded && !!('id' in (lastQuizPlayed || {}))

	if (!quiz) return notFound()
	const breadCrumbs = [
		{ name: 'Quizzes', url: '/quizzes' },
		{
			name: quiz.name,
			url: `/quizzes/${quiz.id}`,
		},
	]
	return (
		<section className='col-span-4 w-full'>
			<span className='text-red-500'>*still working on</span>
			<div className='flex justify-between mb-5'>
				<BreadCrumbs breadCrumbs={breadCrumbs} />
				<GoBack />
			</div>
			<div className='mb-5'>
				<h1 className='text-2xl font-semibold'>{quiz.name}</h1>
				<p>
					<span className='dark:text-slate-400 text-slate-600'>created by</span>{' '}
					{quiz.User?.name}
				</p>
				<div className='flex gap-5'>
					<p>
						{plays}{' '}
						<span className='dark:text-slate-400 text-slate-600'>
							sessions played by you
						</span>
					</p>
					<p>
						{publicPlays}{' '}
						<span className='dark:text-slate-400 text-slate-600'>
							times played
						</span>
					</p>
				</div>
			</div>
			<div className='flex justify-between mb-5'>
				<h1 className='text-2xl font-semibold col-span-6'>Questions</h1>

				<Link
					href={`/play/quiz/${quiz.id}`}
					className='bg-blue-500 transition  hover:bg-blue-400 px-4 py-2 rounded-md text-slate-100 text-center'>
					{isQuizAlreadyPlayed ? 'Continue' : 'Play'}
				</Link>
			</div>
			<div className='grid grid-cols-2 gap-2 mb-5'>
				{questions.length === 0
					? 'No questions found'
					: questions.map((question) => (
							<QuestionCard
								key={question.id}
								question={question}></QuestionCard>
					  ))}
			</div>
			<PaginationServer
				page={page}
				totalPages={totalPages}
			/>
		</section>
	)
}
