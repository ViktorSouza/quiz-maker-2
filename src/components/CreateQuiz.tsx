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
import { Quiz, QuizCollection } from '@prisma/client'
import CreateCollection from './CreateCollection'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
type Inputs = {
	options: string[]
	correctOption: string
	question: string
	quizCollectionId: string
	tags: string[]
}
export default function CreateQuiz({
	isEditing = false,
	quiz,
}: {
	isEditing?: boolean
	quiz: Quiz
}) {
	const {
		register,
		handleSubmit,
		control,
		setValue,
		watch,
		formState: { errors },
	} = useForm<Inputs>({
		defaultValues: quiz,
	})
	const {
		fields: fieldsTag,
		append: appendTag,
		remove: removeTag,
	} = useFieldArray({ control, name: 'tags' })
	console.log('watch colletion:', watch('quizCollectionId'))
	if (errors) {
		console.log(errors)
	}
	const collections = useSWR<QuizCollection[]>(
		'/collections',
		(url: string) => api.get(url).then((res) => res.data.collections),
		{ keepPreviousData: true, fallbackData: [] },
	)

	const { fields, append, remove } = useFieldArray({
		name: 'options',
		keyName: 'id',
		rules: { minLength: 4, maxLength: 10, required: true },
		control,
	})
	const route = useRouter()

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		if (isEditing) {
			await api.patch(`/quizzes/${quiz.id}`, data)
		} else {
			const res = await api.post('/quizzes', data)
		}
		control._reset()
		route.refresh()
	}

	return (
		<Dialog>
			<DialogTrigger className='bg-blue-500 text-slate-100 px-4 py-2 rounded-md'>
				{isEditing ? 'Edit Quiz' : 'Create Quiz'}
			</DialogTrigger>
			<DialogContent>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='flex flex-col gap-5 max-h-screen overflow-y-scroll'>
					<h1 className='text-2xl font-semibold col-span-6'>Create Quiz</h1>
					<div className='flex flex-col'>
						<label
							htmlFor='question'
							className='text-sm font-medium'>
							Question
						</label>
						<input
							type='text'
							className='bg-slate-300 rounded-md py-2 px-3'
							{...register('question', { required: true })}
						/>
						{errors.question && (
							<span className='text-destructive text-sm'>
								{errors.question.type}
							</span>
						)}
					</div>
					<div className='flex gap-3'>
						<Popover>
							<PopoverTrigger
								asChild
								className='bg-slate-300'>
								<Button
									variant='outline'
									role='combobox'
									className='w-[200px] justify-between'>
									{collections
										? collections.data!.find(
												(collection) =>
													collection.id === watch('quizCollectionId'),
										  )?.name
										: 'Select framework...'}
									<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
								</Button>
							</PopoverTrigger>
							<PopoverContent className='w-[200px] p-0'>
								<Command>
									<CommandInput placeholder='Search collection...' />
									<CommandEmpty>No collection found.</CommandEmpty>
									<CommandGroup>
										{collections.data!.map((collection) => (
											<CommandItem
												value={collection.id}
												key={collection.id}
												onSelect={(currentValue: string) => {
													setValue(
														'quizCollectionId',
														currentValue === watch('quizCollectionId')
															? ''
															: collection.id,
													)
												}}>
												{' '}
												<Check
													className={cn(
														'mr-2 h-4 w-4',
														watch('quizCollectionId') === collection.name
															? 'opacity-100'
															: 'opacity-0',
													)}
												/>
												{collection.name}
											</CommandItem>
										))}
									</CommandGroup>
								</Command>
							</PopoverContent>
						</Popover>
						<Popover>
							<PopoverTrigger className='bg-destructive text-primary-foreground px-3 rounded-md'>
								<Plus size={16} />
							</PopoverTrigger>
							<PopoverContent>
								<CreateCollection />
							</PopoverContent>
						</Popover>
					</div>
					<div className='flex flex-col'>
						<label
							htmlFor='right-option'
							className='text-sm font-medium'>
							Right Option
						</label>
						<input
							type='text'
							className='bg-slate-300 rounded-md py-2 px-3'
							{...register('correctOption', { required: true })}
						/>
						{errors.correctOption && (
							<span className='text-destructive text-sm'>
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
								<div className='flex justify-stretch w-full gap-2'>
									<input
										title='Wrong option'
										type='text'
										className='bg-slate-300 dark:bg-slate-700 rounded-md py-2 px-3 w-full'
										{...register(`options.${index}`, { required: true })}
									/>
									<button
										className='bg-destructive text-primary-foreground px-3 rounded-md'
										title='Remove option'
										type='button'
										onClick={() => {
											remove(index)
										}}>
										<Trash2 size={16} />
									</button>
								</div>
								{errors?.options?.[index] && (
									<span className='text-destructive text-sm'>
										{errors.options[index]?.type}
									</span>
								)}
							</div>
						))}
						{errors.options && (
							<span className='text-destructive text-sm'>
								{errors.options.root?.type}
							</span>
						)}
						<button
							className=' w-full font-medium bg-slate-300 rounded-md px-4 py-2 text-primary flex items-center justify-center gap-2 hover:bg-slate-300'
							type='button'
							onClick={() => append('')}>
							<PlusCircle size={16} />
							Add Option
						</button>
					</div>
					<div className='space-y-2'>
						<h1 className='font-medium'>Tags</h1>
						{fieldsTag.map((option, index) => (
							<div
								className='flex flex-col'
								key={option.id}>
								<div className='flex justify-stretch w-full gap-2'>
									<input
										title='Wrong option'
										type='text'
										className='bg-slate-300 dark:bg-slate-700 rounded-md py-2 px-3 w-full'
										{...register(`tags.${index}`, { required: true })}
									/>
									<button
										className='bg-destructive text-primary-foreground px-3 rounded-md'
										title='Remove option'
										type='button'
										onClick={() => {
											removeTag(index)
										}}>
										<Trash2 size={16} />
									</button>
								</div>
							</div>
						))}
					</div>
					<button
						className=' w-full font-medium bg-slate-300 rounded-md px-4 py-2 text-primary flex items-center justify-center gap-2 hover:bg-slate-300'
						type='button'
						onClick={() => appendTag('')}>
						<PlusCircle size={16} />
						Add Option
					</button>
					<button className='bg-primary w-full rounded-md px-4 py-2 text-primary-foreground flex justify-center gap-2'>
						{isEditing ? 'Edit Quiz' : 'Create Quiz'}
					</button>
					<button
						className='bg-destructive text-primary-foreground px-4 py-2 rounded-md'
						onClick={() => control._reset()}>
						Reset
					</button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
