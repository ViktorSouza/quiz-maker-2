import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { getCurrentUser } from '../../../lib/utils'
import { z } from 'zod'
import { $Enums } from '@prisma/client'

export async function GET() {
	const user = await getCurrentUser()
	if (!user)
		return NextResponse.json(
			{ message: 'You need to login in order to access this route' },
			{ status: 401 },
		)
	const quizzes = await prisma.quiz.findMany({
		where: {
			OR: [
				{
					visibility: 'Public',
				},
				{ userId: user.id },
			],
		},
	})
	return NextResponse.json({ quizzes })
}

const createQuizSchema = z.object({
	visibility: z.enum(['Public', 'Private']),
	tags: z.array(z.string()).optional(),
	name: z.string(),
	description: z.string().optional(),
})

export async function POST(req: Request) {
	const user = await getCurrentUser()
	const body = createQuizSchema.parse(await req.json())
	//TODO add a schema

	const quiz = await prisma.quiz.create({
		data: {
			...body,
			userId: user?.id ?? '',
		},
	})
	return NextResponse.json({ quiz })
}
