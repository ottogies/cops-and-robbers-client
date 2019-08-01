import { AbstractClient } from "./abstract-client.js";

export class MockClient extends AbstractClient {

    constructor(game) {
        super();
        this.game = game;
    }

    responseAgentPlace(message) {
        for (var i = 0; i < message.length; i ++) {
            var msg = msessage[i];
            var playerId = msg.playerId;
            var agentId = msg.agentId;
            var vertexId = msg.vertexId;
            this.onCreateAgent(
                playerId,
                agentId,
                vertexId);
        }
    }

    responseAgentMove(message) {
        setTimeout(() => {
            this.onMoveAgent(

                message.currentvertexID,message.playerId,message.agentId,message.vertexId);
        }, 500)

        

        // var agentId = msg.agentId;
        // var from = msg.vertexId;
        // var to  = msg.vertexId; 

        // this.onMoveAgent(agentId,from,to);    
    }
    
}