import { NextApiRequest } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { z } from 'zod'
import { getCurrentUser } from '../../../../lib/utils'

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

	const quiz = await prisma.quiz.findUnique({
		where: {
			id: params.id,
		},
	})

	if (!quiz) return NextResponse.json({}, { status: 404 })

	if (![...quiz.options, quiz?.correctOption].includes(body.answer))
		return NextResponse.json({}, { status: 400 })

	const userPlay = await prisma.userPlay.create({
		data: {
			correctOption: quiz?.correctOption,
			selectedOption: body.answer,
			userId: user?.id,
			quizId: quiz?.id,
		},
	})

	if (quiz?.correctOption === body.answer) {
		return NextResponse.json({ message: 'correct', userPlay, bah: 'sim' })
	} else {
		return NextResponse.json({ message: 'incorrect' })
	}
}

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	const page = Number(req.nextUrl.searchParams.get('page')) || 0
	const user = await getCurrentUser()

	const quizzes = await prisma.quiz.findMany({
		where: {
			userId: user?.id,
			quizCollectionId: params.id,
		},
		skip: page * 10,
		take: 10,
	})
	return NextResponse.json({ quizzes })
}
