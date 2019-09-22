import { AbstractClient } from "./abstract-client.js";
import { MockServer } from './mock-server.js';

export class Client extends AbstractClient {

    constructor(game) {
        super();
        this.game = game;

        // For debug
        // this.onCreateGame(1);


        // this.server.connect();
    }

    connect() {

        if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
            this.socket = new WebSocket('ws://localhost:12370');
        }
        else {
            this.socket = new WebSocket('ws://164.125.34.209:12370');
        }
        this.socket.onopen = this.onConnect;

        this.socket.onmessage = (e) => {
            const msg = e.data;
            console.log("Receive message", msg);
            // "vertex_create,(vertex_id),(x_pos),(y_pos)"
            // "vertex_create,1,50,50"

            const tokens = msg.split(',');
            const type = tokens[0];


            if (0) {}


            /** Base protocols **/
            else if (type == 'player_init') {
                const playerID = +tokens[1];
                this.id = playerID;
                this.onPlayerInit(playerID);
            }

            
            /** Lobby protocols **/
            else if (type == 'room_list') {
                const rooms = [];
                const numberOfRooms = +tokens[1];
                for (let i = 0; i < numberOfRooms; i ++) {
                    const baseIndex = 2 + 4 * i;
                    const roomID = +tokens[baseIndex];
                    const title = tokens[baseIndex + 1];
                    const capacity = +tokens[baseIndex + 2];
                    const noOfPlayers = +tokens[baseIndex + 3];
                    rooms.push({
                        id: roomID,
                        title: title,
                        capacity: capacity,
                        noOfPlayers: noOfPlayers
                    })
                }
                this.onRoomList(rooms);
            }
            else if (type == 'room_join_reject') {
                const roomID = +tokens[1];
                const responseCode = +tokens[2];
                this.onRoomJoinReject(roomID, responseCode);
            }
            else if (type == 'room_join_accept') {
                const roomID = +tokens[1];
                const title = tokens[2];
                const capacity = +tokens[3];
                this.onRoomJoinAccept(roomID, title, capacity);
            }


            /** Room protocol **/
            else if (type == 'room_player_join') {
                const playerID = +tokens[1];
                const username = tokens[2];
                const index = +tokens[3];
                const isLocal = !!+tokens[4];
                const isSuper = !!+tokens[5];
                this.onRoomPlayerJoin(playerID, username, index, isLocal, isSuper);
            }
            else if (type == 'room_player_leave') {
                const playerID = +tokens[1];
                this.onRoomPlayerLeave(playerID);
            }
            else if (type == 'room_destroy') {
                const roomID = +tokens[1];
                this.onRoomDestroy(roomID);
            }
            else if (type == 'game_start') {
                const gameID = +tokens[1];
                this.onGameStart(gameID);
            }


            /** Ingame protocol **/
            else if(type == "game_create"){
                var game_id = +tokens[1];
                this.onCreateGame(game_id);
            }
            else if(type == "role_select"){
                var player_id = +tokens[1];
                var role = tokens[2];
                this.onRoleSelect(player_id, role);
            }
            else if(type == "game_map_data_start") {
                this.onGameMapDataStart();
            }
            else if(type == "game_map_data_end") {
                this.onGameMapDataEnd();
            }
            else if(type == "vertex_create"){
                var vertex_id = +tokens[1];
                var x_pos = +tokens[2];
                var y_pos = +tokens[3];

                this.onCreateVertex(vertex_id,x_pos,y_pos);
            }
            else if(type == "edge_create"){
                var v1 = +tokens[1];  // vertex id 임 id를 
                var v2 = +tokens[2];
                this.onCreateEdge(v1,v2)
            }
            else if(type == "player_create"){
                var player_id = +tokens[1];
                var username = tokens[2];
                var islocal = +tokens[3];
                var jobtype = tokens[4];
                this.onCreatePlayer(player_id, username, islocal, jobtype);
            }
            else if(type == "game_role_data"){
                this.onGameRoleData();
            }
            else if(type == "agent_create"){
                var player_id = +tokens[1];
                var agent_id  = +tokens[2];
                var role = tokens[3];
                var vertex_id = +tokens[4];
                this.onCreateAgent(player_id,agent_id,role,vertex_id);
            }
            else if(type == "agent_move_turn"){
                var player_id = +tokens[1];
                var agent_id = +tokens[2];
                var playerTurnCount = +tokens[3];
                var agentTurnCount = +tokens[4];
                this.onAgentMoveTurn(player_id,agent_id,playerTurnCount,agentTurnCount);
            }
            else if(type == "agent_move"){
                var player_id = +tokens[1];
                var agent_id = +tokens[2];
                var vertex_id = +tokens[3];
                var last_vertex_id = +tokens[4];
                this.onMoveAgent(last_vertex_id, player_id,agent_id,vertex_id)
            }
            else if(type == "agent_caught") {
                var player_id = +tokens[1];
                var agent_id = +tokens[2];
                this.onAgentCaught(player_id, agent_id);
            }
            else if(type == "edge_weight") {
                var count = +tokens[1];
                var edgeWeights = [];
                var maxWeight = 0;
                for (var i = 0; i < count; i ++) {
                    var v1Id = +tokens[2 + i * 3];
                    var v2Id = +tokens[2 + i * 3 + 1];
                    var weight = +tokens[2 + i * 3 + 2];
                    edgeWeights.push([v1Id, v2Id, weight]);
                    maxWeight = Math.max(maxWeight, weight);
                }
                for (var i = 0; i < count; i ++) {
                    var v1Id = edgeWeights[i][0];
                    var v2Id = edgeWeights[i][1];
                    var weight = edgeWeights[i][2] / maxWeight;
                    this.onEdgeWeight(v1Id, v2Id, weight);
                }
            }
            else if(type == "vertex_weight") {
                var count = +tokens[1];
                var vertexWeights = [];
                var maxWeight = 0;
                for (var i = 0; i < count; i ++) {
                    var vId = +tokens[2 + i * 2];
                    var weight = +tokens[2 + i * 2 + 1];
                    vertexWeights.push([vId, weight]);
                    maxWeight = Math.max(maxWeight, weight);
                }
                for (var i = 0; i < count; i ++) {
                    var vId = vertexWeights[i][0];
                    var weight = vertexWeights[i][1] / 4;
                    this.onVertexWeight(vId, weight);
                }
            }
            else if(type == "agent_edge_weight") {
                var agentId = +tokens[1];
                var count = +tokens[2];
                var path = []; 
                for (var i = 0; i < count; i ++) {
                    var vId = +tokens[3 + i];
                    path.push(vId);
                }
                this.onAgentEdgePath(agentId, path);
            }
            else if(type == "agent_vertex_weight") {
                var agentId = +tokens[1];
                var count = +tokens[2];
                var vertices = []; 
                for (var i = 0; i < count; i ++) {
                    var vId = +tokens[3 + i];
                    vertices.push(vId);
                }
                this.onAgentVertexWeight(agentId, vertices);
            }
            else if(type == "game_end") {
                var role = tokens[1];
                this.onGameEnd(role);
            }
        }
    }

    createMock() {
        this.server = new MockServer(this);
        const server = this.server;
        this.socket = {
            onmessage: function(e) {},
            send: function(msg) {
                server.onMessage(msg);
            }
        };
    }


    requestUsername(name) {
        this.socket.send(['request_username', name].join(','));
    }

    /** Lobby Protocols **/



    /** Lobby Requests **/
    requestRoomList() {
        this.socket.send('request_room_list');
    }

    requestRoomCreate(title, capacity) {
        this.socket.send(['request_room_create',title,capacity].join(','));
    }

    requestRoomJoin(roomID) {
        this.socket.send(['request_room_join',roomID].join(','));
    }

    requestRoomLeave(roomID) {
        this.socket.send(['request_room_leave',roomID].join(','));
    }


    /** Room requests **/
    requestGameStart(roomID, gridX, gridY, noOfCops, noOfRobbers) {
        this.socket.send(['request_game_start', roomID, gridX, gridY, noOfCops, noOfRobbers].join(','));
    }


    /** Game requests **/
    requestRoleSelect(gameID, role) {
        this.socket.send(['request_game_role_select', gameID, role].join(','));
    }

    requestMapData(gameID) {
        this.socket.send(['request_map_data', gameID].join(','));
    }

    requestAgentMove(gameID, agentId, vertexId) {
        this.socket.send(['request_agent_move',gameID,agentId,vertexId].join(','));
    }

}