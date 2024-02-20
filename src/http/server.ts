import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser'
import { router } from './routes/router.js'

const app = express()
const server = createServer(app)
const io = new Server(server)

app.use(express.json())
app.use(cookieParser('poll-nlw-expert'))
app.use(router)

app.get('/', () => {
	io.on('connection', (socket) => {
		console.log(socket.id)
		socket.on('message', (message: string) => {
			console.log(message)
		})
	})
})

server.listen(3333, () => console.log('HTTP server running...🚀🚀'))
