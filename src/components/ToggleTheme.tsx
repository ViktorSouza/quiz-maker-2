import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export function ToggleTheme() {
	const [theme, setTheme] = useTheme()
	return (
		<button
			accessKey='t'
			type='button'
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
		</button>
	)
}
