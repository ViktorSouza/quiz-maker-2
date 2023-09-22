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
			questions: { skip: page, take: 10 },
			User: true,
			_count: { select: { questions: true } },
		},
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
				<p className='dark:text-slate-400 text-slate-600'>{quiz.User?.name}</p>
				<p>
					{plays}{' '}
					<span className='dark:text-slate-400 text-slate-600'>
						Sessions played by you
					</span>
				</p>
				<p>
					{publicPlays}{' '}
					<span className='dark:text-slate-400 text-slate-600'>
						times played
					</span>
				</p>
			</div>
			<h1 className='text-2xl font-semibold col-span-6'>Questions</h1>
			<div
				className='space-y-5
			'>
				{quiz.questions.length === 0
					? 'No questions found'
					: quiz.questions.map((question) => (
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
