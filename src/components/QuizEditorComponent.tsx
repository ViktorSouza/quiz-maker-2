'use client'
import React, { useRef, useState } from 'react'
import { Button } from './ui/button'
import { api, cn } from '../lib/utils'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select'
import { useFieldArray, useForm } from 'react-hook-form'
import { Quiz, Prisma, Visibility } from '@prisma/client'
import { PlusCircle, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'

type Form = Omit<Quiz, 'createdAt' | 'updatedAt'>

type QuizEditorComponentProps = (
	| {
			isEditing: true
			quiz: Quiz
	  }
	| {
			isEditing?: false
			quiz?: undefined
	  }
) & { className?: string }

export default function QuizEditorComponent({
	className,
	isEditing = false,
	quiz,
}: QuizEditorComponentProps) {
	const visibility = useRef(null)
	const form = useForm<Form>({ defaultValues: quiz ?? undefined })

	const {
		fields: fieldsTag,
		append: appendTag,
		remove: removeTag,
	} = useFieldArray({
		control: form.control,
		//@ts-ignore
		name: 'tags',
	})

	const router = useRouter()
	const user = useSession()
	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		// this part is for stopping parent forms to trigger their submit
		// sometimes not true, e.g. React Native
		event?.preventDefault?.()
		// prevent any outer forms from receiving the event too
		event?.stopPropagation?.()

		return form.handleSubmit(async (values) => {
			isEditing
				? await api.patch(`quizzes/${quiz?.id}`, values)
				: await api.post('quizzes', values)
			if (isEditing) toast.success('Quiz edited with success')
			else toast.success('Quiz created with success')

			router.refresh()
		})(event)
	}

	return (
		<Dialog>
			<DialogTrigger
				disabled={quiz?.userId !== user.data?.user.id && isEditing}
				className={cn(
					'bg-slate-300 text-sm disabled:opacity-50 font-medium dark:bg-slate-800 transition hover:bg-slate-200 dark:hover:bg-slate-700 p-2 px-4 rounded-md w-max',
					{ '!bg-blue-500 text-white': !isEditing },
					className,
				)}>
				{isEditing ? 'Edit' : 'New Quiz'}
			</DialogTrigger>
			<DialogContent>
				<div className='space-y-2'>
					<h1 className='col-span-6 text-2xl font-semibold'>Quiz Editor</h1>
					<form
						onSubmit={onSubmit}
						className='space-y-2'>
						<div className='flex flex-col'>
							<label
								htmlFor='name'
								className='text-sm font-medium'>
								Name
							</label>
							<input
								type='text'
								{...form.register('name')}
								placeholder='Quiz name'
								className='input'
							/>
						</div>
						<div className='flex flex-col'>
							<label
								htmlFor='description'
								className='text-sm font-medium'>
								Description
							</label>
							<textarea
								cols={30}
								className='input'
								{...form.register('description')}
								rows={10}></textarea>
						</div>
						<div>
							<label
								htmlFor='visibility'
								className='text-sm font-medium'>
								Visibility
							</label>
							<Select
								onValueChange={(value: Visibility) =>
									form.setValue('visibility', value)
								}>
								<SelectTrigger className='w-[180px] input'>
									{' '}
									<SelectValue
										placeholder={form.watch('visibility') ?? 'Visibility'}
									/>
								</SelectTrigger>
								<SelectContent ref={visibility}>
									<SelectItem value='Private'>Private</SelectItem>
									<SelectItem value='Public'>Public</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className='space-y-2'>
							<h1 className='font-medium'>Tags</h1>
							{fieldsTag.map((option, index) => (
								<div
									className='flex flex-col'
									key={option.id}>
									<div className='flex w-full gap-2 justify-stretch'>
										<input
											title='Wrong option'
											type='text'
											className='w-full px-3 py-2 rounded-md input'
											{...form.register(`tags.${index}`, { required: true })}
										/>
										<button
											className='px-3 bg-red-500 rounded-md text-primary-foreground'
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
							className='flex items-center justify-center w-full gap-2 px-4 py-2 font-medium rounded-md  bg-slate-300 dark:bg-slate-900 text-primary hover:bg-slate-300'
							type='button'
							onClick={() => appendTag('')}>
							<PlusCircle size={16} />
							Add Option
						</button>
						<Button
							type='submit'
							className='w-full'
							variant={'color'}>
							{isEditing ? 'Edit' : 'Create'} Quiz
						</Button>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	)
}
