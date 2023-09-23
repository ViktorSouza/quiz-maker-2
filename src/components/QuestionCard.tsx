'use client'
import { MoreVertical } from 'lucide-react'
import { Question, Quiz } from '@prisma/client'
import useSWR from 'swr'
import { api, cn } from '../lib/utils'
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
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import QuestionEditorComponent from './QuestionEditorComponent'
import { Button, buttonVariants } from '@/components/ui/button'
import { useSession } from 'next-auth/react'

export function QuestionCard({ question }: { question: Question }) {
	const user = useSession()
	return (
		<div className='rounded-md flex flex-col  relative w-full bg-white dark:bg-slate-900 p-5'>
			<h1 className='text-2xl font-semibold text-blue-500 dark:text-blue-400'>
				{question.question}
			</h1>
			<p className='dark:text-slate-400 text-slate-600 mb-2'>
				{question.correctOption}
			</p>
			<div className='flex gap-5'>
				<QuestionEditorComponent
					isEditing
					buttonClassName={cn(
						buttonVariants({ variant: 'link' }),
						'p-0 !bg-transparent !hover:bg-transparent',
					)}
					question={question}
				/>
				<Popover>
					<PopoverTrigger className={cn(buttonVariants({ variant: 'link' }))}>
						Show Wrong Answers
					</PopoverTrigger>
					<PopoverContent>
						<ol className='list-decimal list-inside space-y-2'>
							{question.options.map((option) => (
								<li
									key={option}
									className=''>
									{option}
								</li>
							))}
						</ol>
					</PopoverContent>
				</Popover>
				<AlertDialog>
					<AlertDialogTrigger
						className={cn(buttonVariants({ variant: 'link' }), 'text-red-500')}
						disabled={question?.userId !== user.data?.user.id}>
						Delete
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
								disabled={true}
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
