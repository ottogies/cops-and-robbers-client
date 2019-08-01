class SVertex {
	constructor(id, x, y) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.edges = [];
	}

	addEdge(neighbor) {
		this.edges.push(neighbor);
	}

	hasEdge(neighbor) {
		for (let i = 0; i < this.edges.length; i ++)
			if (this.edges[i] == neighbor) return true;
		return false;
	}
}

class SPlayer {
	constructor(id) {
		this.id = id;
		this.agents = [];
	}

	addAgent(agent) {
		this.agents.push(agent);
	}

	removeAgent(agent) {
		let index = -1;
		for (let i = 0; i < this.agents.length; i ++) {
			if (this.agents[i] == agent) index = i;
		}
		this.agents.splice(index, 1);
	}

	hasAgent(agent) {
		for (let i = 0; i < this.agents.length; i ++) {
			if (this.agents[i] == agent) return true;
		}
	}
}

class SAgent {
	constructor(id, playerId, role, position) {
		this.id = id;
		this.playerId = playerId;
		this.role = role;
		this.position = position;
	}

	moveTo(vertex) {
		this.position = vertex;
	}
}

class SCop extends SAgent {
	constructor(id, playerId, position) {
		super(id, playerId, 'cop', position);
	}
}

class SRobber extends SAgent {
	constructor(id, playerId, position) {
		super(id, playerId, 'robber', position);
	}
}

export class MockServer {

	constructor(client) {
		this.client = client;
		this.map = this.createMap();
		this.playerMap = new Map();
		this.agents = [];
		this.agentMap = new Map();
		this.nextTurnAgentIndex = 0;
	}

	connect() {
		this.start();
	}

	start() {
		this.send(`game_create,0`);
		this.map.forEach(vertex => {
			this.send(`vertex_create,${vertex.id},${vertex.x},${vertex.y}`);
		})
		this.map.forEach(vertex => {
			vertex.edges.forEach(edge => {
				this.send(`edge_create,${vertex.id},${edge.id}`);
			})
		})
		this.createPlayersAndAgents();
		this.processTurn();
	}

	onMessage(message) {
		const tokens = message.split(',');
		console.log(tokens + '뭐가뭔지 알기위해');
		const type = tokens[0];
		console.log(`[Server] Got message, ${message}`)
		switch (type) {
		case 'request_agent_move':
			const playerId = +tokens[1];
			const agentId = +tokens[2];
			const vertexId = +tokens[3];
			this.processRequestAgentMove(playerId, agentId, vertexId);
		break;
		}
	}

	processRequestAgentMove(playerId, agentId, vertexId) {
		const agent = this.getAgentById(agentId);
		const lastVertex = agent.position;
		const vertex = this.getVertexById(vertexId);
		agent.moveTo(vertex);
		this.send(`agent_move,${playerId},${agentId},${vertex.id},${lastVertex.id}`);

		const caughtMap = new Map();
		// Check if robber got caught
		for (let i = 0; i < this.agents.length; i ++) {
			const robber = this.agents[i];
			if (robber.role == 'cop') continue;
			for (let j = 0; j < this.agents.length; j ++) {
				const cop = this.agents[j];
				if (cop.role == 'robber') continue;
				if (robber.position == cop.position) {
					caughtMap.set(robber, cop);
				}
			}
		}
		console.log(caughtMap);
		caughtMap.forEach((cop, robber) => {
			this.send(`robber_caught,${cop.id},${robber.id}`);
			this.removeAgent(robber);
		});

		this.processTurn();
	}

	processTurn() {
		this.nextTurnAgentIndex = this.nextTurnAgentIndex % this.agents.length;
		const currentTurnAgentIndex = this.nextTurnAgentIndex;
		const currentTurnAgent = this.agents[currentTurnAgentIndex];
		this.send(`request_agent_move,${currentTurnAgent.playerId},${currentTurnAgent.id}`);
		this.nextTurnAgentIndex = (this.nextTurnAgentIndex + 1) % this.agents.length;
	}

	createMap() {
		const X = 5;
		const Y = 5;
		const DX = [1, 0, -1, 0];
		const DY = [0, 1, 0, -1];
		const map = [];
		const vertices = [];
		for (let y = 0; y < Y; y ++) {
			const row = [];
			for (let x = 0; x < X; x ++) {
				const vertex = new SVertex(y * X + x, x * 50, y * 50);
				vertices.push(vertex);
				row.push(vertex);
			}
			map.push(row);
		}
		for (let y = 0; y < Y; y ++) {
			for (let x = 0; x < X; x ++) {
				const cur = map[y][x];
				for (let k = 0; k < 2; k ++) {
					const nx = x + DX[k];
					const ny = y + DY[k];
					if (nx >= X || nx < 0 || ny >= Y || ny < 0) continue;
					const next = map[ny][nx];
					if (Math.random() > 0.7) {
						console.log(`Remove edge ${x},${y} --> ${nx},${ny}`)
						continue;
					}
					cur.addEdge(next);
					next.addEdge(cur);
				}
			}
		}
		// Check if SCC == 1
		const queue = [];
		const visit = new Set();
		queue.push(map[0][0]);
		visit.add(map[0][0]);
		while (queue.length) {
			const cur = queue.shift();
			for (let i = 0; i < cur.edges.length; i ++) {
				const next = cur.edges[i];
				if (visit.has(next)) continue;
				visit.add(next);
				queue.push(next);
			}
		}
		if (visit.size == vertices.length) {
			const ret = new Map();
			for (let i = 0; i < vertices.length; i ++) {
				const vertex = vertices[i];
				ret.set(vertex.id, vertex);
			}
			return ret;
		}
		else {
			console.log('SCC Check failed. Retry');
			return this.createMap();
		}
	}

	createPlayersAndAgents() {
		const p1 = new SPlayer(0);
		const a1 = new SRobber(0, 0, this.map.get(3));
		p1.addAgent(a1);

		const p2 = new SPlayer(1);
		const a2 = new SCop(1, 1, this.map.get(7));
		const a3 = new SCop(2, 1, this.map.get(17));
		p2.addAgent(a2);
		p2.addAgent(a3);
		
		this.playerMap.set(0, p1);
		this.playerMap.set(1, p2);
		this.agents.push(a1);
		this.agents.push(a2);
		this.agents.push(a3);
		this.agentMap.set(0, a1);
		this.agentMap.set(1, a2);
		this.agentMap.set(2, a3);

		this.send(`player_create,${p1.id}`)
		this.send(`player_create,${p2.id}`)
		this.send(`agent_create,${p1.id},${a1.id},${a1.role},${a1.position.id}`);
		this.send(`agent_create,${p2.id},${a2.id},${a2.role},${a2.position.id}`);
		this.send(`agent_create,${p2.id},${a3.id},${a3.role},${a3.position.id}`);
	}

	getAgentById(id) {
		return this.agentMap.get(id);
	}
	
	getVertexById(id) {
		return this.map.get(id);
	}

	getPlayerByAgent(agent) {
		let ret;
		this.playerMap.forEach(player => {
			if (player.hasAgent(agent)) ret = player;
		})
		return ret;
	}

	removeAgent(agent) {
		let index = -1;
		for (let i = 0; i < this.agents.length; i++) {
			if (this.agents[i] == agent) index = i;
		}
		this.agents.splice(index, 1);
		this.agentMap.delete(agent.id);
		this.getPlayerByAgent(agent).removeAgent(agent);
	}

	send(message) {
		this.client.socket.onmessage({
			data: message
		})
	}

}


console.log(new MockServer());