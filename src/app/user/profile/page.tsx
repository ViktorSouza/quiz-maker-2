'use client'
import useSWR from 'swr'
import { api } from '../../../lib/utils'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
type UserForm = {
	name: string
}
export default function Profile() {
	const { data: user, update } = useSession({
		required: true,
	})

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserForm>({
		defaultValues: { name: '' },
		values: user?.user?.name ? { name: user.user.name } : undefined,
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
					update()
					route.refresh()
					toast('User updated🎉')
				})}>
				<div className='flex flex-col'>
					<label
						htmlFor='name'
						className='text-sm font-medium'>
						Name
					</label>
					<input
						type='text'
						className='input'
						{...register('name', { required: true })}
					/>
					{errors.name && (
						<span className='text-destructive text-sm'>{errors.name.type}</span>
					)}
				</div>
				<Button variant='color'>Edit User</Button>
			</form>
		</div>
	)
}
