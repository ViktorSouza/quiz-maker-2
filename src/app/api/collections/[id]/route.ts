import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '../../../../lib/db'
import { getCurrentUser } from '../../../../lib/utils'

//TODO add meaningful messages here :D
const patchSchema = z.object({
	description: z.string().nonempty(),
	name: z.string().nonempty(),
	tags: z.array(z.string().nonempty()),
})
export async function PATCH(
	req: Request,
	{ params }: { params: { id: string } },
) {
	const body = patchSchema.parse(await req.json())
	const user = await getCurrentUser()
	if (!user)
		return NextResponse.json(
			{
				message: 'You must be logged in',
			},
			{ status: 400 },
		)
	const collection = await prisma.quizCollection.update({
		where: { id: params.id, userId: user.id },
		data: body,
	})
	return NextResponse.json({ collection })
}
