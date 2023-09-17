'use client'
import React, { createContext, useEffect, useState, useContext } from 'react'

const ThemeContext = createContext<{
	theme: string
	setTheme: React.Dispatch<React.SetStateAction<string>>
}>({ theme: 'light', setTheme: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState(() => {
		if (typeof window !== 'undefined') {
			const storedTheme = localStorage.getItem('theme')
			return storedTheme ?? 'light'
		}
		return 'light'
	})

	useEffect(() => {
		localStorage.setItem('theme', theme)
		document.cookie = `theme=${theme}`
		document.documentElement.classList.toggle('dark', theme === 'dark')
	}, [theme])

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export function useTheme() {
	const { theme, setTheme } = useContext(ThemeContext)
	return [theme, setTheme] as const
}
