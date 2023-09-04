'use client'
import { Quiz } from '@prisma/client'
import { api, shuffle } from '../../../../lib/utils'
// import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useMemo, useEffect, useState } from 'react'
import { ArrowLeft, StepBack, StepBackIcon } from 'lucide-react'
import useSWR from 'swr'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Play({}) {
	const pathName = usePathname()
	const [selectedOption, setSelectedOption] = useState<string | null>(null)
	const [page, setPage] = useState(0)

	const {
		data: quizzes,
		isLoading,
		error,
	} = useSWR<Quiz[]>(`/play-quiz/${pathName.slice(11)}?page=${page}`, (url) => {
		return api.get(url).then((res) => {
			return res.data.quizzes
		})
	})

	const [selectedQuiz, setSelectedQuiz] = useState(0)
	const [isAnswerCorrect, setIsAnswerCorrect] = useState<true | false | null>(
		null,
	)
	const quiz = quizzes?.[selectedQuiz]

	/* TODO remove the new Set() */
	const shuffledQuiz = useMemo(
		() =>
			shuffle(
				Array.from(new Set([...(quiz?.options ?? []), quiz?.correctOption])),
			),
		[quiz],
	)

	if (error) return 'Error :('
	if (isLoading) return 'Loading...'
	if (!quizzes) return '???'
	if (!quiz) return 'No quizzes to learn'

	if (selectedQuiz > quizzes.length) return "You've played all quizzes"

	const submitQuiz = async () => {
		const res: { message: 'correct' | 'incorrect' } = await api
			.post(`play-quiz/${quiz.id}`, { answer: selectedOption })
			.then((res) => res.data)
		console.log(res)
		setIsAnswerCorrect(res.message === 'correct')
	}

	return (
		<div className='mx-auto w-96 bg-slate-100 p-5'>
			<h1 className='text-2xl font-medium mb-3'>{quiz.question}</h1>
			<ul className='mb-5 space-y-2'>
				{shuffledQuiz.map((option) => (
					<li
						className='flex items-center space-x-2'
						key={option}>
						<button
							onClick={() => setSelectedOption(option)}
							className='flex gap-3'>
							<div
								className={`rounded-full ${
									selectedOption === option ? 'bg-blue-500' : 'bg-slate-300'
								} h-5 w-5`}></div>{' '}
							<span>{option}</span>
						</button>
					</li>
				))}
			</ul>
			{isAnswerCorrect !== null && (
				<div>{isAnswerCorrect ? "You're correct!" : 'Wrong answer'}</div>
			)}
			<div className='flex gap-3 items-center'>
				{isAnswerCorrect ? (
					<button
						className='bg-blue-500 px-4 py-2 rounded-md text-primary-foreground disabled:opacity-50'
						onClick={() => {
							setSelectedOption(null)
							setIsAnswerCorrect(null)
							setSelectedQuiz((curr) => curr + 1)
						}}>
						Next Question
					</button>
				) : (
					<button
						className='bg-blue-500 px-4 py-2 rounded-md text-primary-foreground disabled:opacity-50'
						disabled={selectedOption === null}
						onClick={submitQuiz}>
						Submit
					</button>
				)}
				<Link
					className='flex gap-3 items-center'
					href={'/'}>
					<ArrowLeft size={16} /> Back
				</Link>
			</div>
		</div>
	)
}
