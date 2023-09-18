import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/db'
import { getCurrentUser } from '../../../../../lib/utils'

export async function GET(
	req: Request,
	{ params }: { params: { id: string } },
) {
	const id = params.id
	const user = await getCurrentUser()
	const correctQuizzes = await prisma.userPlay.count({
		where: {
			userId: user?.id,
			questionId: id,
			correctOption: { equals: prisma.userPlay.fields.selectedOption },
		},
	})
	const allQuizzes = await prisma.userPlay.count({
		where: {
			userId: user?.id,
			questionId: id,
		},
	})
	return NextResponse.json({ accuracy: correctQuizzes / allQuizzes })
}
