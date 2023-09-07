'use client'
import useSWR from 'swr'
import { api } from '../../../lib/utils'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
type UserForm = {
	name: string
}
export default function Profile() {
	const { data: user } = useSession({
		required: true,
		onUnauthenticated() {},
	})

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserForm>({
		defaultValues: { name: '' },
		values: user?.user,
	})
	const route = useRouter()
	if (!user?.user) {
		return 'Loading...'
	}
	return (
		<div>
			<h1 className='text-2xl font-semibold col-span-6'>{user.user?.name}</h1>
			<form
				className='space-y-2'
				onSubmit={handleSubmit(async (data) => {
					await api.patch('/user', data)
					route.refresh()
				})}>
				<div className='flex flex-col'>
					<label
						htmlFor='name'
						className='text-sm font-medium'>
						Name
					</label>
					<input
						type='text'
						className='bg-slate-300 rounded-md py-2 px-3'
						{...register('name', { required: true })}
					/>
					{errors.name && (
						<span className='text-destructive text-sm'>{errors.name.type}</span>
					)}
				</div>
				<button className='bg-primary w-full rounded-md px-4 py-2 text-primary-foreground flex justify-center gap-2'>
					Edit User
				</button>
			</form>
		</div>
	)
}
