import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { getCurrentUser } from '../../../../lib/utils'
import { z } from 'zod'
import { Quiz } from '@prisma/client'

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	//TODO activate this
	//prisma.quiz.delete({
	// 	where: {
	// 		id: params.id,
	// 	},
	// })
	const quiz = await prisma.quiz.findUnique({
		where: {
			id: params.id,
		},
	})

	return NextResponse.json({
		message: 'OK',
		quiz,
	})
}

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	const quiz = await prisma.quiz.findUnique({
		where: {
			id: params.id,
		},
	})

	return NextResponse.json({
		quiz,
	})
}

const patchSchema = z.object({
	question: z.string().nonempty(),
	// quizCollectionId: z.string().nonempty(),
	correctOption: z.string().nonempty(),
	options: z.array(z.string().nonempty()),
	// tags: z.array(z.string().nonempty()),
})

export async function PATCH(
	req: Request,
	{ params }: { params: { id: string } },
) {
	const body = patchSchema.parse(await req.json())
	const user = await getCurrentUser()
	if (!user)
		return NextResponse.json(
			{
				message: 'You must be logged in',
			},
			{ status: 400 },
		)
	const quiz = await prisma.quiz.update({
		where: { id: params.id, userId: user.id },
		data: body,
	})
	return NextResponse.json({ quiz })
}
