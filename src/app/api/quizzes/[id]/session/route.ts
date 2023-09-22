import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/db'
import { getCurrentUser } from '../../../../../lib/utils'

export async function POST(
	req: Request,
	{ params }: { params: { id: string /* Quiz's ID */ } },
) {
	const quizId = params.id
	const user = await getCurrentUser()

	if (!user) return NextResponse.json({}, { status: 401 })

	let quizPlay = await prisma.quizPlay.findFirst({
		where: {
			userId: user.id,
			quizId,
		},
		include: {
			_count: true,
			quiz: {
				include: {
					_count: {
						select: {
							questions: true,
							UserPlay: {
								where: {
									userId: user.id,
									quizId,
								},
							},
						},
					},
				},
			},
		},
	})

	if (!quizPlay)
		return NextResponse.json(
			{ message: 'You can not use this method without completing a quiz' },
			{ status: 401 },
		)

	//Detects if the User has completed the quiz
	if (quizPlay.quiz?._count.questions === quizPlay._count.UserPlay)
		quizPlay = await prisma.quizPlay.create({
			data: {
				userId: user.id,
				quizId,
			},
			include: {
				_count: true,
				quiz: { include: { _count: true } },
			},
		})
	return NextResponse.json({
		quizPlay,
		bah: {
			quizQuestions: quizPlay.quiz?._count.questions,
			userPlays: quizPlay._count.UserPlay,
		},
	})
}
