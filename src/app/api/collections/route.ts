import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { getCurrentUser } from '../../../lib/utils'
import { z } from 'zod'

export async function GET() {
	const user = await getCurrentUser()
	if (!user)
		return NextResponse.json(
			{ message: 'You need to login in order to access this route' },
			{ status: 401 },
		)
	const collections = await prisma.quizCollection.findMany({
		where: {
			userId: user.id,
		},
	})
	return NextResponse.json({ collections })
}
export async function POST(req: Request) {
	const user = await getCurrentUser()
	const body = await req.json()
	//TODO add a schema
	const { name, description, tags } = body
	const collection = await prisma.quizCollection.create({
		data: {
			description,
			tags,
			name,
			userId: user?.id ?? '',
		},
	})
	return NextResponse.json({ collection })
}
