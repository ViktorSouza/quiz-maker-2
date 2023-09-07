'use client'
import React from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { useFieldArray, useForm } from 'react-hook-form'
import { QuizCollection } from '@prisma/client'
import { Button } from './ui/button'
import { PlusCircle, Trash2 } from 'lucide-react'
import { api } from '../lib/utils'
export function EditCollection({ collection }: { collection: QuizCollection }) {
	const { handleSubmit, register, control } = useForm<
		Omit<QuizCollection, 'updatedAt' | 'createdAt' | 'userId' | 'id'>
	>({
		defaultValues: {
			description: collection.description,
			name: collection.name,
			tags: collection.tags,
		},
	})
	const { fields, append, remove } = useFieldArray({ control, name: 'tags' })
	return (
		<Dialog>
			<DialogTrigger className='bg-slate-300 dark:bg-slate-800 transition hover:bg-slate-200 dark:hover:bg-slate-700 p-2 px-4 rounded-md w-min'>
				Edit
			</DialogTrigger>
			<DialogContent>
				<form
					onSubmit={handleSubmit(async (data) => {
						await api.patch(`/collections/${collection.id}`, data)
					})}
					className='flex gap-3 flex-col'>
					<h1 className='text-2xl font-semibold col-span-6'>Edit Collection</h1>
					<div>
						<label
							htmlFor='name'
							className='text-sm font-medium'>
							Name
						</label>
						<input
							type='text'
							{...register('name')}
							className='bg-slate-300 dark:bg-slate-700 rounded-md py-2 px-3 w-full'
						/>
					</div>
					<div>
						<label
							htmlFor='description'
							className='text-sm font-medium'>
							Description
						</label>
						<input
							type='text'
							{...register('description')}
							className='bg-slate-300 dark:bg-slate-700 rounded-md py-2 px-3 w-full'
						/>
					</div>
					<div className='space-y-2'>
						<h1 className='font-medium'>Tags</h1>
						{fields.map((option, index) => (
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
											remove(index)
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
						onClick={() => append('')}>
						<PlusCircle size={16} />
						Add Option
					</button>
					<Button>Edit Collection</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
