'use client'
import { MoreVertical } from 'lucide-react'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Quiz } from '@prisma/client'
import useSWR from 'swr'
import { api } from '../lib/utils'

export function QuizCard({ quiz }: { quiz: Quiz }) {
	const { data: quizAccurancy } = useSWR(
		`quizzes/accurancy/${quiz.id}`,
		(url: string) => api.get(url).then((res) => res.data.accurancy),
		{ fallbackData: 0 },
	)
	return (
		<div className='bg-slate-100 p-5 rounded-md gap-5 flex flex-col  relative'>
			<div className='right-0 absolute'>
				<Popover>
					<PopoverTrigger>
						<MoreVertical />
					</PopoverTrigger>
					<PopoverContent className='w-fit'>Remove :D</PopoverContent>
				</Popover>
			</div>
			<h1 className='text-center text-2xl'>{quiz.question}</h1>
			<div className='w-full h-3 bg-slate-300 rounded-full'>
				<div
					className='bg-blue-500 rounded-full h-full'
					style={{
						width: `${quizAccurancy * 100}%`,
					}}></div>
			</div>
			<div className='flex gap-2 flex-wrap'>
				{quiz.options.map((option) => (
					<span
						key={option}
						className='bg-slate-300 px-2 rounded-md'>
						{option}
					</span>
				))}
			</div>
		</div>
	)
}
