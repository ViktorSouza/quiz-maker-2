'use client'
import { Quiz, UserPlay } from '@prisma/client'
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
	activities: (UserPlay & { Quiz: Quiz })[]
}) {
	const dateFormat: Intl.DateTimeFormatOptions = {
		day: '2-digit',
		month: '2-digit',
		// year: 'numeric',
	}

	const oneDay = 1000 * 60 * 60 * 24

	const days: [key: string, value: number][] = []

	for (let day = 0; day <= 7; day++) {
		days.push([
			new Date(Date.now() - oneDay * (7 - day)).toLocaleDateString(
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
		//TODO fix when the activity's date is older than a week
		return { ...prev, [day]: (prev[day] || 0) + 1 }
	}, daysObject as Record<string, number>)

	const options: ChartOptions<'bar'> = {
		elements: { line: { tension: 0.4 } },
		plugins: { legend: { display: false } },

		responsive: true,
		scales: {
			x: { grid: { display: false }, ticks: { color: colors.slate[500] } },
			y: { grid: { display: false }, ticks: { color: colors.slate[500] } },
		},
	}

	const data: ChartData<'bar', (number | Point | null)[], unknown> = {
		labels: Object.keys(uga),

		datasets: [
			{
				data: Object.values(uga),
				backgroundColor: colors.blue[500],
				borderColor: colors.blue[500],
				borderRadius: 10,
			},
		],
	}
	console.log(uga)
	return (
		<div>
			<Bar
				data={data}
				options={options}
			/>
		</div>
	)
}
