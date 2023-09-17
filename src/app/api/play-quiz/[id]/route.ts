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

	const question = await prisma.question.findUnique({
		where: {
			id: params.id,
		},
	})

	if (!question) return NextResponse.json({}, { status: 404 })

	if (![...question.options, question?.correctOption].includes(body.answer))
		return NextResponse.json({}, { status: 400 })

	const userPlay = await prisma.userPlay.create({
		data: {
			correctOption: question?.correctOption,
			selectedOption: body.answer,
			userId: user?.id,
			questionId: question?.id,
		},
	})

	if (question?.correctOption === body.answer) {
		return NextResponse.json({ message: 'correct', userPlay })
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

	const questions = await prisma.question.findMany({
		where: {
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
		// skip: page * 10,
		// take: 10,
	})
	console.log(questions)
	return NextResponse.json({ questions })
}
