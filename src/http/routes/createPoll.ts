import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export async function createPoll(request: Request, response: Response) {
	const createPollBody = z.object({
		title: z.string(),
		options: z.array(z.string()),
	})

	const { title, options } = createPollBody.parse(request.body)

	const poll = await prisma.poll.create({
		data: {
			title,
			option: {
				createMany: {
					data: options.map((option) => {
						return { title: option }
					}),
				},
			},
		},
	})

	// await prisma.pollOption.createMany({
	// 	data: options.map((option) => {
	// 		return { title: option, pollId: poll.id }
	// 	}),
	// })

	return response.status(201).json({ pollId: poll.id, options })
}
