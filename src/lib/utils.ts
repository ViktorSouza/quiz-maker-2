import { type ClassValue, clsx } from 'clsx'
import { getServerSession } from 'next-auth'
import { twMerge } from 'tailwind-merge'
import { authOptions } from '../app/api/auth/[...nextauth]/route'
import axios from 'axios'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const getCurrentUser = async () => {
	const user = await getServerSession(authOptions)
	return user?.user as
		| ({
				id: string
		  } & {
				name?: string | null
				email?: string | null
				image?: string | null
		  })
		| null
}
export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL })

export function shuffle(array: any[]) {
	let currentIndex = array.length,
		randomIndex

	// While there remain elements to shuffle.
	while (currentIndex > 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex)
		currentIndex--

		// And swap it with the current element.
		;[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		]
	}

	return array
}
