import { Game } from "./game.js";

export class AbstractClient {

    constructor() {
        this.onConnect = () => {}

        /** Common protocols **/
        this.onPlayerInit = (playerId) => {}

        /** Lobby protocols **/
        this.onRoomList = (rooms) => {}
        this.onRoomJoinReject = (roomID, responseCode) => {}
        this.onRoomJoinAccept = (roomID, title, capacity) => {}

        /** Room protocols **/
        this.onRoomPlayerJoin = (playerId, index, isLocal, isSuper) => {}
        this.onRoomPlayerLeave = (playerID) => {}
        this.onRoomDestroy = (roomID) => {}

        /** InGame protocols **/
        this.onGameStart = (gameID) => {}
        this.onCreateGame = (gameId) => {}
        this.onCreateVertex = (vertexId, x, y) => {}
        this.onCreateEdge = (v1Id, v2Id) => {}
        this.onCreatePlayer = (playerId, isLocal, type) => {}
        this.onCreateAgent = (playerId, agentId, role, vertexId) => {}
        this.onMoveAgent = (currentVertexId,playerId,agentId, vertexId) => {}
        this.onRequestAgentPlace = (playerId, numberOfAgents) => {}
        this.onRequestAgentMove = (playerId, agentId) => {}
    }


    /** Lobby Requests **/
    requestRoomList() {

    }

    requestRoomCreate(title, capacity) {

    }

    requestRoomJoin(roomID) {

    }

    requestRoomLeave(roomID) {
        
    }



    /** Room requests **/
    requestGameStart(roomID) {

    }


    onCreateGame(gameId) {
        this.game = new Game(this);
    } 

    onCreateVertex(vertexId, x, y) {
        this.game.createVertex(vertexId, x, y);
    }

    onCreateEdge(v1Id, v2Id) {
        this.game.createEdge(v1Id,v2Id);
    }

    onCreatePlayer(playerId, isLocal, type) {
        this.game.createPlayer(playerId, isLocal, type);
    }

    onCreateAgent(playerId, agentId, role, vertexId) {
        this.game.createAgent(playerId, agentId, role, vertexId);        
    }

    onMoveAgent(currentVertexId,playerId,agentId, vertexId) {
        this.game.moveAgent(currentVertexId, playerId, agentId, vertexId);
    }
    
    onRequestAgentPlace(playerId, numberOfAgents) {
        this.game.requestPlaceAgent(playerId, numberOfAgents)
    }
    
    onRequestAgentMove(playerId, agentId) {
        this.game.requestMoveAgent(playerId, agentId);
    }

    /** 
     * @param {Array.<{playerId: number, agentId: number, vertexId: number}>} message  
     */  
    responseAgentPlace(message) {
        /*
        [{
            playerId: number,
            agentId: number,
            vertexId: number
        }, {
            playerId: number,
            agentId: number,
            vertexId: number
        }, {
            playerId: number,
            agentId: number,
            vertexId: number
        }]
        */
    }

    /** 
     * @param {Object} message
     * @param {number} message.agentId
     * @param {number} message.vertexId
     */  
    responseAgentMove(message) {

        /*
            agentId : number,
            vertexId :number
         */
        
    }

}