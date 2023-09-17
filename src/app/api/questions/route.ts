import { prisma } from '../../../lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '../../../lib/utils'
import { Prisma } from '@prisma/client'
import { z } from 'zod'

export async function GET(req: NextRequest) {
	const page = Number(req.nextUrl.searchParams.get('page')) || 0
	const user = await getCurrentUser()

	const quizzes = await prisma.quiz.findMany({
		where: {
			userId: user?.id,
		},
		skip: page * 10,
		take: 10,
	})
	return NextResponse.json({ quizzes })
}

const createQuestionSchema = z.object({
	options: z.array(z.string()),
	correctOption: z.string(),
	question: z.string(),
	quizId: z.string(),
	userId: z.string(),
})
export async function POST(req: Request) {
	const body = await req.json()
	const user = await getCurrentUser()

	const quizCreateArgs: Prisma.QuestionCreateArgs['data'] =
		createQuestionSchema.parse({
			userId: user?.id,
			...body,
		})
	const quiz = await prisma.question.create({
		data: quizCreateArgs,
	})
	return NextResponse.json({ quiz })
}
