'use client'
import { Question, Quiz } from '@prisma/client'
import { api, shuffle, cn } from '../../../../lib/utils'
// import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useMemo, useEffect, useState } from 'react'
import { ArrowLeft, StepBack, StepBackIcon } from 'lucide-react'
import useSWR from 'swr'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '../../../../components/ui/button'

export default function Play() {
	const pathName = usePathname()
	const [selectedOption, setSelectedOption] = useState<string | null>(null)
	const [page, setPage] = useState(0)
	const router = useRouter()
	const summary = useSWR<{
		correctPlays: number
		totalPlays: number
	}>(`/quizzes/${pathName.slice(11)}/session/summary`, (url) => {
		return api.get(url).then((res) => {
			return res.data
		})
	})

	const { data, isLoading, error, mutate } = useSWR<{
		question: Question
		remaining: number
	}>(
		`/play-quiz/${pathName.slice(11)}?page=${page}`,
		(url) => {
			return api.get(url).then((res) => {
				return res.data
			})
		},
		{
			revalidateOnFocus: false,
		},
	)

	const [selectedQuiz, setSelectedQuiz] = useState(0)
	const [isAnswerCorrect, setIsAnswerCorrect] = useState<true | false | null>(
		null,
	)

	let question = data?.question
	/* TODO remove the new Set() */
	const shuffledQuestion = useMemo(
		() =>
			shuffle(
				Array.from(
					new Set([...(question?.options ?? []), question?.correctOption]),
				),
			),
		[question],
	)

	if (error) return 'Error :('
	if (isLoading) return 'Loading...'
	if (!question?.id || !data?.remaining)
		return (
			<div className='mx-auto max-w-lg bg-slate-100 dark:bg-slate-900 p-5 rounded-md'>
				<h1 className='text-2xl font-medium mb-3'>Congratulations🎉</h1>
				<p className='dark:text-slate-400 text-slate-60 mb-5'>
					You finished the quiz! Now, you can start a new one.
				</p>
				<div className='mb-5'>
					<p>
						Accuracy:{' '}
						{(
							((summary.data?.correctPlays ?? 0) /
								(summary.data?.totalPlays ?? 0)) *
							100
						).toFixed(1)}
						%
					</p>
					<p>Correct answers: {summary.data?.correctPlays}</p>
					<p>
						Wrong answers:{' '}
						{(summary.data?.totalPlays ?? 0) -
							(summary.data?.correctPlays ?? 0)}
						
					</p>
					<p>Total: {summary.data?.totalPlays}</p>
				</div>
				<div className='flex items-center gap-5'>
					<Button
						variant={'color'}
						onClick={() => {
							api.post(`/quizzes/${pathName.slice(11)}/session`).then(() => {
								mutate()
							})
						}}>
						New Session
					</Button>
					<Link
						className='flex gap-3 items-center'
						href={'/'}>
						<ArrowLeft size={16} /> Back
					</Link>
				</div>
			</div>
		)

	if (selectedQuiz > data?.remaining) return "You've played all quizzes"

	const submitQuiz = async () => {
		const res: { message: 'correct' | 'incorrect' } = await api
			.post(`play-quiz/${question?.id}`, { answer: selectedOption })
			.then((res) => res.data)
		setIsAnswerCorrect(res.message === 'correct')
	}

	return (
		<div className=''>
			<h1 className='text-2xl font-semibold'>Questions</h1>
			<span className='text-sm'>
				Question {selectedQuiz + 1} of {data?.remaining}
			</span>
			<h1 className='text-2xl font-medium mb-3'>{question.question}</h1>
			<ul className='mb-5 flex flex-col gap-3 justify-stretch'>
				{shuffledQuestion.map((option, index) => (
					<li
						className={`flex items-center space-x-2  ${
							selectedOption === option && 'shadow-xl'
						} p-2 rounded-md items-center bg-white dark:bg-slate-900`}
						key={crypto.randomUUID()}>
						<button
							disabled={!!isAnswerCorrect}
							onClick={() => {
								setIsAnswerCorrect(null)
								setSelectedOption(option)
							}}
							className={`flex gap-3 w-full items-center`}>
							<div
								className={cn(
									`rounded-md p-5 flex justify-center items-center  h-5 w-5 bg-slate-200 dark:bg-slate-800`,
									{
										'bg-slate-900 text-primary-foreground dark:bg-slate-100 dark:bg-primary':
											selectedOption === option,
										'!bg-red-500':
											!isAnswerCorrect &&
											selectedOption === option &&
											isAnswerCorrect !== null,
										'!bg-green-500':
											isAnswerCorrect && selectedOption === option,
									},
								)}>
								{'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.at(index)}
							</div>{' '}
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
					<Button
						variant={'color'}
						onClick={() => {
							setSelectedOption(null)
							setIsAnswerCorrect(null)
							summary.mutate()
							mutate()
						}}>
						Next Question
					</Button>
				) : (
					<Button
						variant='color'
						disabled={selectedOption === null}
						onClick={submitQuiz}>
						Submit
					</Button>
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
