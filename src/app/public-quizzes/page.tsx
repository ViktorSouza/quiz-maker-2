import { PublicQuizCard } from '@/components/PublicQuizCard'
import { Bookmark } from 'lucide-react'
import QuizCard from '../../components/QuizCard'
import { prisma } from '../../lib/db'
import { getCurrentUser } from '../../lib/utils'
import PaginationServer from '../../components/PaginationServer'

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
			<h1 className='text-2xl font-semibold col-span-6'>Public Quizzes</h1>
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
				<PaginationServer
					page={page}
					totalPages={totalPages}
				/>
			</section>
		</>
	)
}
