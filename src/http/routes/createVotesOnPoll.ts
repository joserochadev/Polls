import { randomUUID } from 'node:crypto'
import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { redis } from '../../lib/redis.js'

export async function createVotesOnPoll(request: Request, response: Response) {
	const votesOnPollBody = z.object({
		pollOptionId: z.string().uuid(),
	})

	const votesOnPollParams = z.object({
		id: z.string().uuid(),
	})

	const { pollOptionId } = votesOnPollBody.parse(request.body)
	const { id: pollId } = votesOnPollParams.parse(request.params)

	let { sessionId } = request.signedCookies

	if (sessionId) {
		const userPreviousVoteOnPoll = await prisma.vote.findUnique({
			where: {
				sessionId_pollId: {
					sessionId,
					pollId,
				},
			},
		})

		if (userPreviousVoteOnPoll && userPreviousVoteOnPoll.pollOptionId !== pollOptionId) {
			// Apagar o voto anterior
			// Criar um novo
			await prisma.vote.delete({
				where: {
					id: userPreviousVoteOnPoll.id,
				},
			})

			await redis.zincrby(pollId, -1, userPreviousVoteOnPoll.pollOptionId)
		} else if (userPreviousVoteOnPoll) {
			return response.status(400).send({ message: 'You already vote on this poll' })
		}
	}

	if (!sessionId) {
		sessionId = randomUUID()

		response.cookie('sessionId', sessionId, {
			path: '/',
			maxAge: 60 * 60 * 24 * 30, // 30 dias
			signed: true,
			httpOnly: true,
		})
	}

	await prisma.vote.create({
		data: {
			sessionId,
			pollId,
			pollOptionId,
		},
	})

	await redis.zincrby(pollId, 1, pollOptionId)

	return response.status(201).send()
}
