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
			_count: {
				select: {
					UserPlay: {
						where: {
							correctOption: {
								equals: prisma.userPlay.fields.selectedOption,
							},
						},
					},
				},
			},

			quiz: {
				include: {
					_count: true,
				},
			},
		},
		orderBy: {
			id: 'desc',
		},
	})
	const isQuizCompleted =
		quizPlay?.quiz?._count.questions === quizPlay?._count.UserPlay

	console.log(quizPlay?.quiz?._count.questions, quizPlay?._count.UserPlay)

	console.assert(isQuizCompleted)

	if (isQuizCompleted)
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
	else
		return NextResponse.json(
			{ message: 'You can not use this method without completing a quiz' },
			{ status: 401 },
		)

	//Detects if the User has completed the quiz
	return NextResponse.json({
		quizPlay,
		bah: {
			quizQuestions: quizPlay.quiz?._count.questions,
			userPlays: quizPlay._count.UserPlay,
		},
	})
}
