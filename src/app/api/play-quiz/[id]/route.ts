import { NextApiRequest } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { z } from 'zod'
import { getCurrentUser } from '../../../../lib/utils'
import { Prisma, UserPlay } from '@prisma/client'

const schema = z.object({
	answer: z.string().nonempty('Please, provide the answer'),
})
export async function POST(
	req: Request,
	{ params }: { params: { id: string } },
) {
	const body = schema.parse(await req.json())
	const user = await getCurrentUser()
	if (!user) return NextResponse.json({}, { status: 401 })
	const question = await prisma.question.findUnique({
		where: {
			id: params.id,
		},
		include: {
			Quiz: {
				include: {
					_count: true,
				},
			},
		},
	})

	if (!question) return NextResponse.json({}, { status: 404 })

	let quizPlay = await prisma.quizPlay.findFirst({
		where: {
			userId: user.id,
			quizId: question.quizId,
		},
		orderBy: {
			id: 'desc',
		},
		include: {
			UserPlay: true,
			_count: true,
		},
	})

	if (
		!quizPlay ||
		question.Quiz?._count.questions === quizPlay._count.UserPlay
	) {
		quizPlay = await prisma.quizPlay.create({
			data: {
				userId: user.id,
				quizId: question.quizId,
			},
			include: {
				UserPlay: true,
				_count: true,
			},
		})
	}

	if (![...question.options, question?.correctOption].includes(body.answer))
		return NextResponse.json({}, { status: 400 })

	const userPlay = await prisma.userPlay.create({
		data: {
			quizPlayId: quizPlay.id,
			quizId: question.quizId,
			correctOption: question?.correctOption,
			selectedOption: body.answer,
			userId: user?.id,
			questionId: question?.id,
		},
	})
	await prisma.userPlay.update({
		where: {
			id: userPlay.id,
		},
		data: {
			QuizPlay: {
				connect: {
					id: userPlay?.quizPlayId,
				},
			},
		},
	})

	if (question?.correctOption === body.answer)
		return NextResponse.json({ message: 'correct', userPlay })
	else return NextResponse.json({ message: 'incorrect' })
}

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	const page = Number(req.nextUrl.searchParams.get('page')) || 0
	const user = await getCurrentUser()
	if (!user) return NextResponse.json({}, { status: 401 })

	let quizPlay = await prisma.quizPlay.findFirst({
		where: {
			userId: user.id,
			quizId: params.id,
		},
		orderBy: {
			id: 'desc',
		},
		include: {
			UserPlay: true,
			_count: true,
			quiz: { include: { _count: true } },
		},
	})

	console.log(user.id, params.id)
	console.log(quizPlay?.id, params.id)

	const findQuestionArgs: Prisma.QuestionFindFirstArgs = {
		where: {
			UserPlay: {
				//I actually don't know how this is working, but I will not change anything😳
				every: {
					OR: [
						{
							quizPlayId: { not: quizPlay?.id },
						},
						{ userId: { not: user.id } }, // Exclude questions played by the user
					],
				},
			},

			OR: [
				{
					userId: user?.id,
					quizId: params.id,
				},
				{
					quizId: params.id,
					Quiz: {
						visibility: 'Public',
					},
				},
			],
		},
	}

	const question = await prisma.question.findFirst(findQuestionArgs)
	const remaining = await prisma.question.count(
		findQuestionArgs as Prisma.QuestionCountArgs,
	)

	if (!quizPlay) {
		await prisma.quizPlay.create({
			data: {
				userId: user.id,
				quizId: question?.quizId ?? '',
			},
			include: {
				UserPlay: true,
				_count: true,
			},
		})
	}

	return NextResponse.json({ question, remaining })
}
