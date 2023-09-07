import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { getCurrentUser } from '../../../lib/utils'
import { z } from 'zod'

export async function GET() {
	const user = await getCurrentUser()
	if (!user) return NextResponse.json(undefined, { status: 401 })
	const userFromPrisma = await prisma.user.findUnique({
		where: {
			id: user.id,
		},
	})
	return NextResponse.json({ user: userFromPrisma })
}

const patchSchema = z.object({
	name: z.string().max(127, 'The chosen name is too big'),
})
export async function PATCH(req: Request) {
	const user = await getCurrentUser()
	const body = patchSchema.parse(await req.json())
	if (!user) return NextResponse.json(undefined, { status: 401 })
	const userFromPrisma = await prisma.user.update({
		where: {
			id: user.id,
		},
		data: body,
	})
	return NextResponse.json({ user: userFromPrisma })
}
