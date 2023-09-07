import { EditCollection } from '@/components/EditCollection'
import Image from 'next/image'
import CreateQuiz from '@/components/CreateQuiz'
import { Prisma, Quiz, UserPlay } from '@prisma/client'
import { api, getCurrentUser } from '../lib/utils'
import { QuizCard } from '../components/QuizCard'
import ActivityChart from '@/components/ActivityChart'
import Link from 'next/link'
import { prisma } from '../lib/db'

export default async function Home({
	searchParams,
}: {
	searchParams: { [key: string]: string }
}) {
	const page = Number(searchParams.page || '0') || 0
	const user = await getCurrentUser()
	const activities = await prisma.userPlay.findMany({
		where: {
			userId: user?.id ?? '',
		},
		orderBy: { createdAt: 'desc' },
		include: { Quiz: true },
	})
	console.log(activities)
	const quizzes = await prisma.quiz.findMany({
		where: {
			userId: user?.id ?? '',
		},
		skip: page * 10,
		take: 10,
	})

	const collections = await prisma.quizCollection.findMany({
		where: {
			userId: user?.id,
		},
		include: {
			_count: true,
		},
	})

	return (
		<div className='grid grid-cols-8 gap-3'>
			<h1 className='text-2xl font-semibold col-span-6'>Collections</h1>
			<div className='flex items-stretch gap-3 col-span-2'>
				<CreateQuiz isEditing={false} />
				<Link
					href={'attempts'}
					className='bg-slate-300 dark:bg-slate-800 transition hover:bg-slate-200 dark:hover:bg-slate-700 text-primary px-4 py-2 rounded-md'>
					My attempts
				</Link>
			</div>

			<section className='col-span-6 my-5 grid grid-cols-6 gap-5'>
				<span className='text-sm font-light col-span-3 pl-4'>Collection</span>
				<span className='text-sm font-light'>Questions</span>
				<span className='text-sm font-light'>Updated</span>

				{collections.map((collection) => (
					<div
						key={collection.id}
						className='bg-slate-200 dark:bg-slate-900 px-4  py-1 rounded-md grid gap-5 col-span-6 grid-cols-6 items-center'>
						<Link
							href={`/collections/${collection.id}`}
							className='col-span-2'>
							<h1>{collection.name}</h1>
							<p className='text-xs'>
								Created:{' '}
								{collection.createdAt.toLocaleDateString(undefined, {
									day: '2-digit',
									month: 'short',
									year: 'numeric',
								})}
							</p>
						</Link>
						<EditCollection collection={collection} />
						<span>{collection._count.quizzes}</span>
						<span>
							{collection.updatedAt.toLocaleDateString(undefined, {
								day: '2-digit',
								month: 'short',
								year: 'numeric',
							})}
						</span>
						<Link
							href={`/play/quiz/${collection.id}`}
							className='bg-blue-500 transition  hover:bg-blue-400 px-4 py-2 rounded-md text-slate-100 text-center'>
							Play
						</Link>
					</div>
				))}
			</section>
			<section className='col-span-2'>
				<h1 className='text-2xl font-semibold'>Your activities</h1>
				<ActivityChart activities={activities} />
			</section>
		</div>
	)
}
