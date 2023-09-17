'use client'
import { MoreVertical } from 'lucide-react'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Question, Quiz } from '@prisma/client'
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
import QuestionEditorComponent from './QuestionEditorComponent'
import { Button } from '@/components/ui/button'

export function QuestionCard({ question }: { question: Question }) {
	const { data: quizAccurancy } = useSWR(
		`questions/accurancy/${question.id}`,
		(url: string) => api.get(url).then((res) => res.data.accurancy),
		{ fallbackData: 0 },
	)
	return (
		<div className='bg-white dark:bg-slate-900 p-5 rounded-md gap-2 flex flex-col  relative'>
			<div className='right-3 absolute'></div>
			<h1 className='text-2xl'>{question.question}</h1>
			<p>
				Answer: <span className='font-medium'>{question.correctOption}</span>
			</p>
			<div>
				<span>Accurancy</span>

				<div className='w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full'>
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
							{question.options.map((option) => (
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
				<QuestionEditorComponent
					isEditing
					question={question}
				/>
				<AlertDialog>
					<AlertDialogTrigger>
						<Button variant={'destructive'}>Delete</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete the
								question.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								className='bg-red-500 text-slate-100'
								onClick={() => {
									api.delete(`/questions/${question.id}`)
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
