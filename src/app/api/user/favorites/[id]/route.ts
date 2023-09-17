import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/utils'
import { prisma } from '../../../../../lib/db'

export async function POST(
	req: Request,
	{ params }: { params: { id: string } },
) {
	const user = await getCurrentUser()
	if (!user)
		return NextResponse.json(
			{ message: 'You need to login in order to access this route' },
			{ status: 401 },
		)

	await prisma.quiz.update({
		where: {
			id: params.id,
		},
		data: {
			users: { connect: { id: user.id ?? '' } },
		},
	})
	return NextResponse.json({})
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } },
) {
	const user = await getCurrentUser()
	if (!user)
		return NextResponse.json(
			{ message: 'You need to login in order to access this route' },
			{ status: 401 },
		)
	await prisma.quiz.update({
		where: {
			id: params.id,
		},
		data: {
			users: { disconnect: { id: user.id ?? '' } },
		},
	})
	return NextResponse.json({})
}
