import GoBack from '@/components/GoBack'
import { notFound } from 'next/navigation'
import { QuizCard } from '../../../components/QuizCard'
import { prisma } from '../../../lib/db'
import { getCurrentUser } from '../../../lib/utils'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function Collection({
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

	const collection = await prisma.quizCollection.findUnique({
		where: {
			id: params.id,
		},
		include: {
			quizzes: true,
		},
	})

	if (!collection) return notFound()
	return (
		<section className='col-span-4 w-full'>
			<GoBack />
			<h1 className='text-2xl font-semibold col-span-6'>{collection.name}</h1>
			<div className='grid gap-2 grid-cols-4'>
				{collection.quizzes.map((quiz) => (
					<QuizCard
						key={quiz.id}
						quiz={quiz}></QuizCard>
				))}
			</div>
		</section>
	)
}
