import { NextResponse } from 'next/server'
import { prisma } from '../../../../../../lib/db'
import { getCurrentUser } from '../../../../../../lib/utils'

export async function GET(
	req: Request,
	{ params }: { params: { id: string /* Quiz's ID */ } },
) {
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
		include: { _count: true },
	})
	if (!quizPlay) return NextResponse.json({}, { status: 401 })

	const correctPlays = await prisma.userPlay.count({
		where: {
			quizPlayId: quizPlay.id,
			correctOption: { equals: prisma.userPlay.fields.selectedOption },
		},
	})
	return NextResponse.json({
		correctPlays,
		totalPlays: quizPlay._count.UserPlay,
	})
}
