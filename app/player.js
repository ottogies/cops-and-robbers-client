import { Agent } from "./agent.js";
import { Vertex } from "./vertex.js";
import { Game } from './game.js';

/**
  @class Game

  @param {Game} game
*/
export class Player {

    //the class constructor
    /**
     * constructor description
     * @param  {Game} game [description]
     */

    constructor(id, username, role, game) {
        this.id = id;
        this.username = username;
        this.role = role;
        
        this.game = game;
        this.agents = [];  //이걸 구조체로 정의해서

        // const currentVertex = agent.position;
        // const availableVertices = this.getVerticesBy(currentVertex,1);
            
    }

    requestPlaceAgent(noOfAgents) {
        let promise = this.selectVertex();
        promise.then((vertex) => {
            vertex.setColor('orange');
        });
    }

    /** 
     * @param {Agent} agent
     * @param {Vertex} vertex  
     */  
    requestMoveAgent(agentId) {
        return new Promise(resolve => {
            const agent = this.getAgentById(agentId); 
            agent.setActive(true);
            if (!agent) return;

            const currentVertex = agent.position;
            const availableVertices = this.getVerticesBy(currentVertex,1);
            
            for (let i = 0; i < availableVertices.length; i ++) {
                const vertex = availableVertices[i];
                console.log(vertex);
                vertex.setHighlight("pink");
                
            }

            let vertexPromise = this.selectVertex(availableVertices);
            vertexPromise.then((vertex) => {
              console.warn('chk',vertex);
               //if(vertex)가 거리가 1이하인 vertex이면 resolve
                    resolve(vertex);
                    agent.setActive(false);
                    for (let i = 0; i < availableVertices.length; i ++) {
                        const vertex = availableVertices[i];
                        console.log(vertex);
                        vertex.setHighlight('');
                    }
            });
        });
    }

    getVerticesBy(currentVertex, distlimit){
        //현재 vertex와 거리가 distlimit 이하인 vertex들을 return 

        const result = [];        
        const queue = [];
        //방문했다는 visit 
        const visit = new Set(); 

        queue.push({
            vertex: currentVertex,
            distance: 0
        });
        visit.add(currentVertex);

        while (queue.length) {

            const first = queue.pop();
            result.push(first.vertex);
            visit.add(first.vertex);
            console.log(first)

            for(var i = 0; i <  first.vertex.edges.length; i++){
                const neighbor = first.vertex.edges[i];
                //방문했는지 확인
                if(visit.has(neighbor)){
                    continue;
                }
                var distance = first.distance + 1;
                
                if(distance <= distlimit){
                    queue.push({
                        vertex: neighbor,
                        distance : distance
                    })
                }

            }
        }
        return result;

        // 거리가 1이하인 vertex 객체들을 return해준다 
    }

    async selectAgent(){
        var promise = new Promise((resolve) => {
            var clickCallback = (e) => {
                const target = e.target;
                const type = target.getAttribute('type');
                if (type == 'agent'){

                    const agentId = target.getAttribute('agent_id');
                    const agent = this.game.getAgentById(agentId);
                   
                    resolve(agent);
                    document.removeEventListener('click', clickCallback);
                }
            };
            document.addEventListener('click', clickCallback);
        });
        return promise;   
        
    }

   async selectVertex(availableVertices){
        var promise = new Promise((resolve) => {
            var clickCallback = (e) => {
                
                const target = e.target;
                const type = target.getAttribute('type');
                if (type == 'vertex' ){ //여기서 availablevertex인지 확인 하면 안될까?
                    const vertexId = target.getAttribute('vertex_id');
                    const vertex = this.game.getVertexById(vertexId);
                    var idx = availableVertices.indexOf(vertex);
                    if (idx >= 0){
                        resolve(vertex);
                        document.removeEventListener('click', clickCallback);
                        
                    }
                }
            };
            document.addEventListener('click', clickCallback);
        });
        return promise;

        
    }

    addAgent(agent){
        this.agents.push(agent);
    }

    removeAgent(agent) {
        let index = this.getAgentIndex(agent);
        this.agents.splice(index, 1);
        agent.remove();
    }

    getAgentIndex(agent) {
        let index = -1;
        for (let i = 0; i < this.agents.length; i ++) {
            if (this.agents[i].id == agent.id) index = i;
        }
        return index;
    }

    getAgentById(agentId){
      for (var i = 0; i< this.agents.length; i++){
        var agent = this.agents[i];
        if (agent.id == agentId)return agent;
      }
      return null;
    }

}