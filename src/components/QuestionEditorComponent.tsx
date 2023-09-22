'use client'
import { Plus, PlusCircle, Trash2 } from 'lucide-react'
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
import { api } from '../lib/utils'
// import { useRouter } from 'next/router'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Question, Quiz } from '@prisma/client'
import QuizEditorComponent from './QuizEditorComponent'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { useSession } from 'next-auth/react'
type Inputs = {
	options: string[]
	correctOption: string
	question: string
	quizId: string
}
export default function QuestionEditorComponent({
	isEditing = false,
	buttonClassName,
	question,
}: (
	| { isEditing: true; question: Question }
	| { isEditing?: false; question?: undefined }
) & { buttonClassName?: string }) {
	const {
		register,
		handleSubmit,
		control,
		setValue,
		watch,
		formState: { errors },
	} = useForm<Inputs>({
		defaultValues: isEditing ? question : undefined,
	})
	if (errors) {
		console.log(errors)
	}
	const quiz = useSWR<Quiz[]>(
		'/quizzes',
		(url: string) => api.get(url).then((res) => res.data.quizzes),
		{ keepPreviousData: true, fallbackData: [] },
	)

	const user = useSession()

	const { fields, append, remove } = useFieldArray({
		//@ts-ignore
		name: 'options',
		rules: { minLength: 4, maxLength: 10, required: true },
		control,
	})
	const route = useRouter()

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		if (isEditing && question?.id) {
			await api.patch(`/questions/${question.id}`, data)
		} else {
			await api.post('/questions', data)
		}
		control._reset()
		route.refresh()
	}

	return (
		<Dialog>
			<DialogTrigger
				disabled={question?.userId !== user.data?.user.id && isEditing}
				className={cn(
					'bg-slate-300 text-sm font-medium dark:bg-slate-800 transition hover:bg-slate-200 dark:hover:bg-slate-700 p-2 px-4 rounded-md w-max disabled:opacity-50',
					{ '!bg-blue-500 text-white': !isEditing },
					buttonClassName,
				)}>
				{isEditing ? 'Edit Question' : 'New Question'}
			</DialogTrigger>
			<DialogContent>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='flex flex-col max-h-screen gap-5 overflow-y-scroll'>
					<h1 className='col-span-6 text-2xl font-semibold'>Create Question</h1>
					<div className='flex flex-col'>
						<label
							htmlFor='question'
							className='text-sm font-medium'>
							Question
						</label>
						<input
							type='text'
							className='px-3 py-2 rounded-md input'
							{...register('question', { required: true })}
						/>
						{errors.question && (
							<span className='text-sm text-destructive'>
								{errors.question.type}
							</span>
						)}
					</div>
					<div>
						<label
							htmlFor='quizId'
							className='text-sm font-medium'>
							Quiz
						</label>
						<div className='flex gap-3'>
							<Popover>
								<PopoverTrigger
									asChild
									className='bg-slate-300 dark:bg-slate-900'>
									<Button
										variant='outline'
										role='combobox'
										className='w-[200px] justify-between'>
										{quiz.data!.length
											? quiz.data!.find((quiz) => quiz.id === watch('quizId'))
													?.name
											: 'Select quiz...'}
										<ChevronsUpDown className='w-4 h-4 ml-2 opacity-50 shrink-0' />
									</Button>
								</PopoverTrigger>
								<PopoverContent className='w-[200px] p-0'>
									<Command>
										<CommandInput placeholder='Search quiz...' />
										<CommandEmpty>No quiz found.</CommandEmpty>
										<CommandGroup>
											{quiz.data!.map((quiz) => (
												<CommandItem
													value={quiz.id}
													key={quiz.id}
													onSelect={(currentValue: string) => {
														setValue(
															'quizId',
															currentValue === watch('quizId') ? '' : quiz.id,
														)
													}}>
													<Check
														className={cn(
															'mr-2 h-4 w-4',
															watch('quizId') === quiz.name
																? 'opacity-100'
																: 'opacity-0',
														)}
													/>
													{quiz.name}
												</CommandItem>
											))}
										</CommandGroup>
									</Command>
								</PopoverContent>
							</Popover>
							<Popover>
								<PopoverTrigger className='px-3 bg-red-500 rounded-md text-primary-foreground dark:text-primary'>
									<Plus size={16} />
								</PopoverTrigger>
								<PopoverContent>
									<QuizEditorComponent />
								</PopoverContent>
							</Popover>
						</div>
					</div>
					<div className='flex flex-col'>
						<label
							htmlFor='right-option'
							className='text-sm font-medium'>
							Right Option
						</label>
						<input
							type='text'
							className='px-3 py-2 rounded-md input'
							{...register('correctOption', { required: true })}
						/>
						{errors.correctOption && (
							<span className='text-sm text-destructive'>
								{errors.correctOption.type}
							</span>
						)}
					</div>
					<div className='space-y-2'>
						<h2 className='text-base font-medium'>Wrong options</h2>
						{fields.map((option, index) => (
							<div
								className='flex flex-col'
								key={option.id}>
								<div className='flex w-full gap-2 justify-stretch'>
									<input
										title='Wrong option'
										type='text'
										className='w-full px-3 py-2 rounded-md input'
										{...register(`options.${index}`, { required: true })}
									/>
									<Button
										variant='outline'
										className='px-3 bg-red-500 rounded-md text-primary-foreground'
										title='Remove option'
										type='button'
										onClick={() => {
											remove(index)
										}}>
										<Trash2 size={16} />
									</Button>
								</div>
								{errors?.options?.[index] && (
									<span className='text-sm text-destructive'>
										{errors.options[index]?.type}
									</span>
								)}
							</div>
						))}
						{errors.options && (
							<span className='text-sm text-destructive'>
								{errors.options.root?.type}
							</span>
						)}
						<button
							className='flex items-center justify-center w-full gap-2 px-4 py-2 font-medium rounded-md  bg-slate-300 dark:bg-slate-900 text-primary hover:bg-slate-300'
							type='button'
							onClick={() => append('')}>
							<PlusCircle size={16} />
							Add Option
						</button>
					</div>
					<button className='flex justify-center w-full gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground'>
						{isEditing ? 'Edit Question' : 'Create Question'}
					</button>
					<button
						className='px-4 py-2 bg-red-500 rounded-md text-primary-foreground dark:text-primary'
						onClick={() => control._reset()}>
						Reset
					</button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
