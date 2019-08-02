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
        this.onRoleSelect = (playerID, role) => {}
        this.onCreateGame = (gameId) => {}
        this.onGameMapDataStart = () => {}
        this.onCreateVertex = (vertexId, x, y) => {}
        this.onCreateEdge = (v1Id, v2Id) => {}
        this.onGameMapDataEnd = () => {}
        this.onCreatePlayer = (playerId, isLocal, type) => {}
        this.onCreateAgent = (playerId, agentId, role, vertexId) => {}
        this.onMoveAgent = (currentVertexId,playerId,agentId, vertexId) => {}
        this.onRequestAgentPlace = (playerId, numberOfAgents) => {}
        this.onAgentMoveTurn = (playerId, agentId) => {}
        this.onAgentCaught = (playerId, agentId) => {}
        this.onGameEnd = (role) => {}
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


    /** Game requests **/
    requestRoleSelect(gameID, role) {

    }
    
    requestAgentMove(gameID, agentId, vertexId) {

    }

}