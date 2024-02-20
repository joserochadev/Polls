import { Socket } from 'socket.io'

export async function pollResults(socket: Socket) {
	socket.on('message', (message: string) => {
		socket.send(`you send: ${message}`)
	})
}
