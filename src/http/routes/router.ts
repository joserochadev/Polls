import { Router } from 'express'
import { createPoll } from './createPoll.js'
import { getPollById } from './getPollById.js'
import { createVotesOnPoll } from './createVotesOnPoll.js'
import { pollResults } from '../ws/pollResults.js'

export const router = Router()

router.post('/polls', createPoll)

router.get('/polls/:id', getPollById)

router.post('/polls/:id/votes', createVotesOnPoll)
