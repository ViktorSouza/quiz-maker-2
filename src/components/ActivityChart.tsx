'use client'
import { Question, Quiz, UserPlay } from '@prisma/client'
import colors from 'tailwindcss/colors'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	BarElement,
	Tooltip,
	Legend,
	ChartData,
	Point,
	ChartOptions,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(
	CategoryScale,
	BarElement,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
)

export default function ActivityChart({
	activities,
}: {
	activities: (UserPlay & { Question: Question })[]
}) {
	const dateFormat: Intl.DateTimeFormatOptions = {
		day: '2-digit',
		month: '2-digit',
		// year: 'numeric',
	}

	const oneDay = 1000 * 60 * 60 * 24

	const days: [key: string, value: number][] = []
	const amountOfDays = 7

	for (let day = 0; day <= amountOfDays; day++) {
		days.push([
			new Date(Date.now() - oneDay * (amountOfDays - day)).toLocaleDateString(
				undefined,
				dateFormat,
			),
			0,
		])
	}
	const daysObject = Object.fromEntries(days)

	const uga = activities.reduce((prev, curr, index) => {
		const day = new Date(curr.createdAt).toLocaleDateString(
			undefined,
			dateFormat,
		)
		if (!days.find((value) => value[0] == day)) return prev

		return { ...prev, [day]: (prev[day] || 0) + 1 }
	}, daysObject as Record<string, number>)

	const options: ChartOptions<'bar'> = {
		elements: { line: { tension: 0.4 } },
		plugins: { legend: { display: false } },

		responsive: true,
		scales: {
			x: {
				grid: { display: false },
				ticks: { maxTicksLimit: 15, color: colors.slate[500] },
			},
			y: {
				grid: { display: false },
				ticks: { maxTicksLimit: 3, color: colors.slate[500] },
			},
		},
	}

	const data: ChartData<'bar', (number | Point | null)[], unknown> = {
		labels: Object.keys(uga),

		datasets: [
			{
				data: Object.values(uga),
				backgroundColor: colors.blue[500],
				borderColor: colors.blue[500],
				borderRadius: 5,
			},
		],
	}
	return (
		<div className='w-full bg-slate-100 p-4 dark:bg-slate-900 rounded-md'>
			<Bar
				data={data}
				options={options}
			/>
		</div>
	)
}
