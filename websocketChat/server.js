const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const clients = new Map(); // To keep track of connected clients

wss.on('connection', (ws) => {
	console.log('New connection');

	// Assign a unique ID to each new connection
	const id = Date.now();
	clients.set(id, ws);
	ws.send(JSON.stringify({ type: 'id', id }));

	ws.on('message', (message) => {
		const data = JSON.parse(message);
		if (data.type === 'private') {
			const recipient = clients.get(data.recipientId);
			if (recipient && recipient.readyState === WebSocket.OPEN) {
				recipient.send(JSON.stringify({ type: 'message', from: id, message: data.message }));
			}
		}
	});

	ws.on('close', () => {
		console.log('Connection closed');
		clients.delete(id);
	});
});

console.log('WebSocket server is running on ws://localhost:8080');
