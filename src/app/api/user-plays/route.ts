import { getCurrentUser } from '@/lib/utils'
import { prisma } from '../../../lib/db'
import { NextResponse } from 'next/server'
import { Quiz, UserPlay } from '@prisma/client'

export async function GET(req: Request) {
	const user = await getCurrentUser()

	if (!user)
		return NextResponse.json(
			{ message: 'You must be logged in' },
			{ status: 401 },
		)
	const userPlays = await prisma.userPlay.findMany({
		where: {
			userId: user?.id ?? '',
		},
		orderBy: { createdAt: 'desc' },
		include: { Quiz: true },
	})
	return NextResponse.json({ userPlays })
}
