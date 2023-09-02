import { prisma } from '../../../lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { NextApiHandler, PageConfig } from 'next'
import { z } from 'zod'
import { getCurrentUser } from '../../../lib/utils'

export async function GET(req: NextRequest) {
	const page = Number(req.nextUrl.searchParams.get('page')) || 0
	const user = await getCurrentUser()
	console.log('ugauga', user)

	const quizzes = await prisma.quiz.findMany({
		where: {
			userId: user?.id,
		},
		skip: page * 10,
		take: 10,
	})
	return NextResponse.json({ quizzes })
}

export async function POST(req: Request) {
	const body = await req.json()
	const user = await getCurrentUser()

	const quiz = await prisma.quiz.create({
		data: {
			userId: user?.id,
			//TODO use zod here
			...body,
		},
	})
	return NextResponse.json({ quiz })
}
