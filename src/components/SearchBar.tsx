'use client'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function SearchBar() {
	const [value, setValue] = useState('')
	const throttledValue = useThrottle(value, 1000)
	const router = useRouter()
	useEffect(() => {
		router.push(`?search=${throttledValue}`)
	}, [throttledValue])
	return (
		<div className='bg-slate-200 dark:bg-slate-900 px-4 p-2 rounded-md flex gap-2 items-center  w-auto'>
			<input
				type='text'
				onChange={(e) => setValue(e.target.value)}
				className='bg-transparent w-full'
				placeholder='Search for a quiz'
			/>
			<Search size={16} />
		</div>
	)
}

const useThrottle = (value: any, limit: number) => {
	const [throttledValue, setThrottledValue] = useState(value)
	const lastRan = useRef(Date.now())

	useEffect(() => {
		const handler = setTimeout(function () {
			if (Date.now() - lastRan.current >= limit) {
				setThrottledValue(value)
				lastRan.current = Date.now()
			}
		}, limit - (Date.now() - lastRan.current))

		return () => {
			clearTimeout(handler)
		}
	}, [value, limit])

	return throttledValue
}
