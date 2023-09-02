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
		<main className='max-w-7xl mx-auto grid grid-cols-8 gap-3'>
			<h1 className='text-2xl font-semibold col-span-6'>Collections</h1>
			<div className='flex items-stretch gap-3 col-span-2'>
				<CreateQuiz />
				<Link
					href={'attempts'}
					className='bg-slate-300 text-primary px-4 py-2 rounded-md'>
					My attempts
				</Link>
			</div>
			{/* <section className='col-span-2'>
					<h1 className='text-2xl font-semibold'>Your activities</h1>
					<div className='space-y-5 overflow-y-scroll h-96'>
						{activities.map((activity) => (
							<div
								key={activity.id}
								className='bg-slate-100 rounded-md px-4 py-2'>
								<h1 className='text-xl'>{activity.Quiz?.question}</h1>
								You selected:{' '}
								<span
									className={`${
										activity.selectedOption === activity.correctOption
											? 'text-green-500'
											: 'text-red-500'
									}`}>
									{activity.selectedOption}
								</span>
								<br />
								Correct answer: {activity.correctOption}
							</div>
						))}
					</div>
				</section> */}

			{/* <section className='col-span-4'>
				<div className='grid gap-2 grid-cols-4'>
					{quizzes.map((quiz) => (
						<QuizCard
							key={quiz.id}
							quiz={quiz}></QuizCard>
					))}
				</div>
			</section> */}

			<section className='col-span-6 my-5 grid grid-cols-6 gap-5'>
				<span className='text-sm font-light col-span-3'>Collection</span>
				<span className='text-sm font-light'>Questions</span>
				<span className='text-sm font-light'>Updated</span>

				{collections.map((collection) => (
					<div
						key={collection.id}
						className='bg-slate-100 px-4  py-1 rounded-md grid gap-5 col-span-6 grid-cols-6 items-center'>
						<div className='col-span-2'>
							<h1>{collection.name}</h1>
							<p className='text-xs'>
								Created:{' '}
								{collection.createdAt.toLocaleDateString(undefined, {
									day: '2-digit',
									month: 'short',
									year: 'numeric',
								})}
							</p>
						</div>
						<button className='bg-slate-300 p-2 px-4 rounded-md w-min'>
							Edit
						</button>
						<span>{collection._count.quizzes}</span>
						<span>
							{collection.updatedAt.toLocaleDateString(undefined, {
								day: '2-digit',
								month: 'short',
								year: 'numeric',
							})}
						</span>
						<Link
							href={'/play/quiz'}
							className='bg-blue-500 px-4 py-2 rounded-md text-primary-foreground text-center'>
							Play
						</Link>
						{/* <ul className=' flex gap-3'>
							{collection.tags.map((tag) => (
								<li key={tag}>
									<span className='bg-slate-300 px-1 rounded-md'>{tag}</span>
								</li>
							))}
						</ul> */}
					</div>
				))}
			</section>
			<section className='col-span-2'>
				<h1 className='text-2xl font-semibold'>Your activities</h1>
				<ActivityChart activities={activities} />
			</section>
		</main>
	)
}
