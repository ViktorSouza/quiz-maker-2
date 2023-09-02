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
			quizId: id,
			correctOption: { equals: prisma.userPlay.fields.selectedOption },
		},
	})
	const allQuizzes = await prisma.userPlay.count({
		where: {
			userId: user?.id,
			quizId: id,
		},
	})
	console.log('accurancyyyyyyyyyyyy', correctQuizzes, allQuizzes, id)
	return NextResponse.json({ accurancy: correctQuizzes / allQuizzes })
}
