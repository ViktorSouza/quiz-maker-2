'use client'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
export function ToggleTheme({ text = '' }: { text?: string }) {
	const [theme, setTheme] = useTheme()
	const [isClient, setIsClient] = useState(false)

	useEffect(() => {
		setIsClient(true)
	}, [])

	if (!isClient) return null
	return (
		<button
			accessKey='t'
			type='button'
			className='flex items-center gap-2'
			onFocus={(e) => {
				e.preventDefault()
				e.target.focus({ preventScroll: true })
			}}
			autoFocus={false}
			onClick={() => {
				setTheme((current) => (current === 'light' ? 'dark' : 'light'))
			}}
			title='Toggle theme'>
			<i>{theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}</i>
			{text}
		</button>
	)
}
