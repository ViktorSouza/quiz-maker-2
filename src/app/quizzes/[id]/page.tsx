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
		},
		include: {
			questions: { skip: page, take: 10 },
			_count: { select: { questions: true } },
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

			<h1 className='text-2xl font-semibold col-span-6'>Questions</h1>
			<div className='grid gap-2 grid-cols-4'>
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
