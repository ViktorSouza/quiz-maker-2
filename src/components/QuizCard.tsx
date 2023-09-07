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
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import CreateQuiz from './CreateQuiz'

export function QuizCard({ quiz }: { quiz: Quiz }) {
	const { data: quizAccurancy } = useSWR(
		`quizzes/accurancy/${quiz.id}`,
		(url: string) => api.get(url).then((res) => res.data.accurancy),
		{ fallbackData: 0 },
	)
	return (
		<div className='bg-slate-200 p-5 rounded-md gap-2 flex flex-col  relative'>
			<div className='right-3 absolute'></div>
			<h1 className='text-2xl'>{quiz.question}</h1>
			<p>
				Answer: <span className='font-medium'>{quiz.correctOption}</span>
			</p>
			<div>
				<span>Accurancy</span>

				<div className='w-full h-3 bg-slate-300 rounded-full'>
					<div
						className='bg-blue-500 rounded-full h-full'
						style={{
							width: `${quizAccurancy * 100}%`,
						}}></div>
				</div>
			</div>
			<Accordion
				type='single'
				collapsible>
				<AccordionItem value='item-1'>
					<AccordionTrigger>Wrong options</AccordionTrigger>
					<AccordionContent>
						<div className='flex gap-2 flex-wrap'>
							{quiz.options.map((option) => (
								<span
									key={option}
									className='bg-slate-300 px-2 rounded-md'>
									{option}
								</span>
							))}
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
			<div className='flex gap-5'>
				<CreateQuiz
					isEditing
					quiz={quiz}
				/>
				{/* <Popover>
					<PopoverTrigger className='bg-slate-300 dark:bg-slate-800 transition hover:bg-slate-200 dark:hover:bg-slate-700 text-primary px-4 py-2 rounded-md'>
						Edit
					</PopoverTrigger>
					<PopoverContent className='w-fit'></PopoverContent>
				</Popover> */}
				<AlertDialog>
					<AlertDialogTrigger className='bg-destructive text-primary-foreground px-4 py-2 rounded-md'>
						Delete
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete the
								quiz.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => {
									api
										.delete(`/quizzes/${quiz.id}`)
										.then((res) => console.log(res.data))
								}}>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	)
}
