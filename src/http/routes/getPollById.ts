import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { Request, Response } from 'express'
import { redis } from '../../lib/redis.js'

export async function getPollById(request: Request, response: Response) {
	const pollId = z.object({
		id: z.string().uuid({ message: 'Invalid UUID' }),
	})

	const { id } = pollId.parse(request.params)

	const poll = await prisma.poll.findUnique({
		where: {
			id,
		},
		include: {
			option: {
				select: {
					id: true,
					title: true,
				},
			},
		},
	})

	if (!poll) {
		return response.status(404).send({ message: 'Poll not found' })
	}

	const result = await redis.zrange(id, 0, -1, 'WITHSCORES')

	const votes = result.reduce((obj, line, index) => {
		if (index % 2 === 0) {
			const score = result[index + 1]
			Object.assign(obj, {
				[line]: Number(score),
			})
		}

		return obj
	}, {} as Record<string, number>)

	console.log(votes)

	return response.json({
		poll: {
			id: poll.id,
			title: poll.title,
			options: poll.option.map((option) => {
				return {
					id: option.id,
					title: option.title,
					score: option.id in votes && votes[option.id],
				}
			}),
		},
	})
}
