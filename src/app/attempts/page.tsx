import { BreadCrumbs } from '../../components/Breadcrumbs'
import GoBack from '../../components/GoBack'
import { prisma } from '../../lib/db'
import { getCurrentUser } from '../../lib/utils'
import PaginationServer from '../../components/PaginationServer'

export default async function Attempts({
	searchParams,
}: {
	searchParams: {
		[key: string]: string
	}
}) {
	const user = await getCurrentUser()
	const pageAmount = 10
	const page = Number(searchParams.page || 0) || 0
	const activities = await prisma.userPlay.findMany({
		where: {
			userId: user?.id ?? '',
		},

		orderBy: { createdAt: 'desc' },
		include: { Question: true },
		take: pageAmount,
		skip: page * pageAmount,
	})
	let totalPages = await prisma.userPlay.count({
		where: { userId: user?.id ?? '' },
	})
	totalPages = Math.floor((totalPages ?? 0) / pageAmount)
	const breadCrumbs = [{ name: 'Attempts', url: '/attempts' }]
	return (
		<section className='col-span-2'>
			<div className='flex justify-between mb-5'>
				<BreadCrumbs breadCrumbs={breadCrumbs} />
				<GoBack />
			</div>
			<h1 className='text-2xl font-semibold'>Your activities</h1>
			<div className='space-y-5 overflow-y-scroll'>
				{' '}
				{activities.map((activity) => (
					<div
						key={activity.id}
						className='bg-white dark:bg-slate-900 rounded-md px-4 py-2'>
						<h1 className='text-xl'>{activity.Question?.question}</h1>
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
			<PaginationServer
				totalPages={totalPages}
				page={page}
			/>
		</section>
	)
}
