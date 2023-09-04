import GoBack from '../../components/GoBack'
import { prisma } from '../../lib/db'
import { getCurrentUser } from '../../lib/utils'

export default async function Attempts() {
	const user = await getCurrentUser()
	const activities = await prisma.userPlay.findMany({
		where: {
			userId: user?.id ?? '',
		},
		orderBy: { createdAt: 'desc' },
		include: { Quiz: true },
	})
	return (
		<section className='col-span-2'>
			<GoBack />
			<h1 className='text-2xl font-semibold'>Your activities</h1>
			<div className='space-y-5 overflow-y-scroll h-96'>
				{activities.map((activity) => (
					<div
						key={activity.id}
						className='bg-slate-50 rounded-md px-4 py-2'>
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
		</section>
	)
}
