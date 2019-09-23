import { Vertex } from "./vertex.js";
import { Agent } from "./agent.js";
import { Player } from "./player.js";
import { AbstractClient } from "./abstract-client.js";
import { Cop } from "./cop.js";
import { Robber } from "./robber.js";
import { RoleSelect } from "./role-select.js";
import { SideInfo } from "./side-info.js";
import { Chat } from "./chat.js";

/**
 * git add *
 * git commit -m "message"
 * git push
 */

 //그래프 크기 조절 할줄 알아야댐
 //해야할것 section 하위객체 하나 둬서 그안에 그래프 그리게
 //잡혔을때 애니메이션 

export class Game {

  /** 
   * @param {AbstractClient} client  
   */  
  constructor(client, container, id) {
    window.game = this;

    this.id = id;
    this.client = client;
    this.vertices = [];
    this.vertexMap = new Map();
    this.players = [];
    this.playerTurnCount = 0;
    this.agentTurnCount = 0;

    this.copVision = 2;
    this.robberVision = 2;

    this.div = document.createElement('div');
    this.div.classList.add('ingame');
    // ingame 크기랑 ingamecontainer크기랑 전부 변할수 있나? 
    container.append(this.div);

    
    this.header = document.createElement('header');
    this.header.className = "header";
    this.header.classList.add('header');
    this.div.append(this.header);

    this.headertext = document.createElement('headertext');
    this.headertext.className = "headertext";
    this.headertext.classList.add('headertext');
    this.header.append(this.headertext);


    //헤더는 어차피 고정된 값

    this.ingameContainer = document.createElement('div');
    this.ingameContainer.classList.add('ingameContainer');
   // this.ingameContainer.style.width 
    this.div.append(this.ingameContainer);

    this.roleSelector = new RoleSelect(client, this.div, this);
    this.client.onGameMapDataStart = () => {
      this.roleSelector.dispose();
    }

    //html 정적으로 생성한거 동적으로 여기다 옮겨 적기 
    //css에서 재정의 해야댐
    //container 에 넣기 div에 다 넣으면됨 
    //flex를 이용해서


    // this.headertext = document.createElement('div');
    // this.headertext.className = "headertext";
    // this.headertext.classList.add(this.headertext);
    // this.headertext.innerText ="cops and robbers!"
    // this.header.append(this.headertext);
    

    this.section = document.createElement("section");
    this.section.id = "section";
    this.section.className = "section";
    this.section.classList.add('section');
    this.ingameContainer.append(this.section);
    
    //게임 나올곳
    this.map = document.createElement("div");
    this.map.id = "map";
    this.map.className = "map";
    this.map.classList.add("map");
    this.section.append(this.map); 
    
    this.aside = document.createElement('aside');
    this.aside.className = "aside";
    this.aside.classList.add('aside');
    this.ingameContainer.append(this.aside);
    // 변화에 따른 

    const weightToggle = document.createElement('input');
    weightToggle.setAttribute('type', 'checkbox');
    weightToggle.addEventListener('change', e => {
      this.toggleWeightMap(weightToggle.checked);
    })
    this.aside.append(weightToggle);

    this.sideInfo = new SideInfo(this.aside, this);
    this.sideInfo.update();

    this.footer = document.createElement('footer');
    this.footer.className = "footer";
    this.footer.classList.add('footer');
    this.div.append(this.footer);

    this.chat = new Chat(client, this.footer);
    
    //이것도 고정된 값


    // 그래프 크기에 따라 section크기에 대해 vertex 크기를 조절해야댐

    // document.body.append(this.footer);

    
    this.client.onCreateVertex = (vertexId, x, y) => {
      this.createVertex(vertexId, x, y);
      this.sideInfo.update();
    }
    this.client.onCreateEdge = (v1Id, v2Id) => {
      this.createEdge(v1Id,v2Id);
      this.sideInfo.update();
    }
    this.client.onCreatePlayer = (playerId, username, isLocal, type) => {
      this.createPlayer(playerId, username, isLocal, type);
      this.sideInfo.update();
    }
    this.client.onGameMapDataEnd = () => {
      this.client.requestAgentCreate(this.id);
    }
    this.client.onGameRoleData = () => {
      this.client.requestMapData(this.id);
    }
    this.client.onCreateAgent = (playerId, agentId, role, vertexId) => {
      this.createAgent(playerId, agentId, role, vertexId);        
      this.sideInfo.update();
    }
    this.client.onMoveAgent = (currentVertexId,playerId,agentId, vertexId) => {
        this.moveAgent(currentVertexId, playerId, agentId, vertexId);
      this.sideInfo.update();
    }
    this.client.onRequestAgentPlace = (playerId, numberOfAgents) => {
        this.requestPlaceAgent(playerId, numberOfAgents)
      this.sideInfo.update();
    }
    this.client.onAgentMoveTurn = (playerId, agentId, playerTurnCount, agentTurnCount) => {
      this.playerTurnCount = playerTurnCount;
      this.agentTurnCount = agentTurnCount;
      this.agentMoveTurn(playerId, agentId);
      this.sideInfo.update();
    }
    this.client.onAgentCaught = (playerId, agentId) => {
      this.caughtRobber(playerId, agentId);
      this.sideInfo.update();
    }
    this.client.onGameEnd = (role) => {
      this.gameEnd(role);
      this.sideInfo.update();
    }

    this.client.onEdgeWeight = (v1Id, v2Id, weight) => {
      this.updateEdgeWeight(v1Id, v2Id, weight);
      this.sideInfo.update();
    }
    this.client.onVertexWeight = (vId, weight) => {
      this.updateVertexWeight(vId, weight);
      this.sideInfo.update();
    }
    this.client.onAgentEdgePath = (agentId, path) => {
      this.updateAgentEdgePath(agentId, path);
      this.sideInfo.update();
    }
    this.client.onAgentVertexWeight = (agentId, vertices) => {
      this.updateAgentVertexWeight(agentId, vertices);
      this.sideInfo.update();
    }

    // TODO
    // this.client.onAgentCaught = (playerId, agentId) => {
    //   implement..
    // }
    // this.client.onGameEnd = 

  }
   
  //여기서 map의 크기를 section과 비율을 통해 해야댐
  sizeofMap(){
    var xMin = Infinity;
    var xMax = -Infinity;
    var yMin = Infinity;
    var yMax = -Infinity;

    for(let i = 0 ; i < this.vertices.length ; i++){   
        if(this.vertices[i].x < xMin ){
          xMin = this.vertices[i].x;
        }
        if(this.vertices[i].x > xMax){
          xMax = this.vertices[i].x;
        }
        if(this.vertices[i].y < yMin){
          yMin = this.vertices[i].y;
        }
        if(this.vertices[i].y > yMax ){
          yMax = this.vertices[i].y; 
        }
        
    }
    
    
    let mapwidth = xMax - xMin ;
    let mapheight = yMax - yMin ;

    this.section = document.getElementById('section');
    let sectionwidth =  this.section.offsetWidth - 80; 
    let sectionheight = this.section.offsetHeight - 80; 

    let rwidth = sectionwidth/mapwidth ; 
    let rheight = sectionheight/mapheight;

    let ratio = Math.min(rwidth, rheight);

    this.map.style.transform = 'scale(' + ratio + ')';

    const scaledMapWidth = mapwidth * ratio;
    const scaledMapHeight = mapheight * ratio;

    const paddingWidth = this.section.offsetWidth - scaledMapWidth;
    const paddingHeight = this.section.offsetHeight - scaledMapHeight;

    this.map.style.left = (paddingWidth / 2) + 'px';
    this.map.style.top = (paddingHeight / 2) + 'px';

    // this.div = document.getElementById("map");

   //여기서 결정하면 안됨
    
    // this.div = document.getElementById("section");
    
    // this.div.style.width =   width + "px";
    // this.div.style.height =  height + "px";  

    this.map.style.width =   mapwidth + "px";
    this.map.style.height =  mapheight + "px"; 

    this.width = mapwidth;
    this.height = mapheight;
  
    if(sectionwidth < mapwidth){
  
     
    }
    else if(sectionwidth > mapwidth){

    }

    
  }
    
  

  /** 
   * @param {number} playerId
   * @param {noOfAgents} noOfAgents  
   */  
  requestPlaceAgent(playerId, noOfAgents) {
    const player = this.getPlayerById(playerId);
    player.requestPlaceAgent(noOfAgents);
  }

  agentMoveTurn(playerId,agentId) {
    const player = this.getPlayerById(playerId);
    const agent = player.getAgentById(agentId);
    if (this.currentTurnAgent) {
      this.currentTurnAgent.position.setTurn(false);
    }
    this.currentTurnAgent = agent;
    if (this.currentTurnAgent) this.currentTurnAgent.position.setTurn(true);
    this.chat.addMessage(`${player.username}님의 차례입니다. (${this.agentTurnCount}번째 턴)`);
    if (this.client.id != playerId) return;
    var requestPromise = player.requestMoveAgent(agentId);
    requestPromise.then(result => {
      this.client.requestAgentMove(this.id, agentId, result.id);
    });
  }

  createPlayer(id,username,isLocal,type) {
    const player = new Player(id, username, type, this);
    this.players.push(player);
  }

  createVertex(id, x, y) {
    let vertex = new Vertex(this.map, id, x, y);
    this.vertices.push(vertex);
    this.vertexMap.set(id, vertex);
    this.sizeofMap()
  }

  createEdge(v1Id, v2Id) {
    var v1 = this.getVertexById(v1Id);
    var v2 = this.getVertexById(v2Id);
    console.log(v1,v2);
    var edge = v1.addEdge(this.map, v2);
    console.log(edge);

  }

  createAgent(playerId, agentId, role, vertexId) {
    let agent = null;
    var player = this.getPlayerById(playerId);
    var vertex = this.getVertexById(vertexId);
    if (role == 'cop') {
      agent = new Cop(this.map, agentId, vertex);
    }
    else {
      agent = new Robber(this.map, agentId, vertex);
    }
    player.addAgent(agent);
  }
  
  // IdenCaught(CopId, RobberId, vertexId){
  //   var cop  = this.getAgentById(CopID);
  //   var robber = this.getAgentById(RobberId);
  //   if(cop.position == robber.position){

  //   }
  // }

  moveAgent(currentVertexId, playerId, agentId,vertexId) {
    var player = this.getPlayerById(playerId);
    var vertex = this.getVertexById(vertexId);
    var agent = this.getAgentById(agentId);
    console.log(vertex,agent);

    // if(currentvertexId == vertexId){

    // }
    // else if(Math.abs(currentvertexId - verteId) == 1 || currentvertexId - verteId) == 3 ){

    // }
    // else{}
    agent.setPosition(vertex);
    this.updateVision();
    this.updateVertices();
  }

  updateVision() {
    const localPlayer = this.getPlayerById(this.client.id);

    let visionSet = new Set();
    let q = [];
    this.players.forEach(player => {
      if (player.role == localPlayer.role) {
        player.agents.forEach(agent => {
          q.push({
            position: agent.position,
            cost: 0
          });
        })
      }
    })
    const visionLimit = (localPlayer.role == 'cop' ? this.copVision : this.robberVision);
    while (q.length) {
      const cur = q.shift();
      if (cur.cost > visionLimit) continue;
      const position = cur.position;
      position.edges.forEach(neighbor => {
        if (visionSet.has(neighbor)) return;
        visionSet.add(neighbor);
        q.push({
          position: neighbor,
          cost: cur.cost + 1
        });
      })
    }

    this.vertices.forEach(v => {
      if (visionSet.has(v)) v.setFog(false);
      else v.setFog(true);
    });
    this.players.forEach(player => {
      player.agents.forEach(agent => {
        if (visionSet.has(agent.position)) agent.setFog(false);
        else agent.setFog(true);
      })
    })
  }

  updateVertices() {
    this.vertices.forEach(v => v.update());
  }

  caughtRobber(playerId, robberId) {
    // var cop = this.getAgentById(copId);
    var robber = this.getAgentById(robberId);

    const caughtstyle = document.createElement('div');
    caughtstyle.classList.add("caughtstyle");
    this.div.append(caughtstyle);

    const caughttext = document.createElement("div");
    caughttext.classList.add("caughttext");
    caughttext.innerText = 'Catch!';
    this.div.append(caughttext);

    // document.getElementById('game').append(textDiv);
    // setTimeout(() => {
    //   caughtstyle.remove();
    // }, 5000)



    const robberPlayer = this.getPlayerByAgent(robber);
    robberPlayer.removeAgent(robber);
  }

  remoevAgent(agent) {
     agent.remove();
  }

  getPlayerById(playerId) {
    for (var i = 0; i< this.players.length; i++){
      var player = this.players[i];
      if (player.id == playerId) return player;
    }
    return null;
  }

  getPlayerByAgent(targetAgent) {
    for (var i = 0 ; i< this.players.length; i++){
      var player = this.players[i];
      var agent = player.getAgentById(targetAgent.id);
      if(agent == null){
        continue;
      }
      else{
        return player;
      }
    }
  }

  getAgentById(agentId) {
    for (var i = 0 ; i< this.players.length; i++){
      var player = this.players[i];
      var agent = player.getAgentById(agentId);
      if(agent == null){
        continue;
      }
      else{
        return agent;
      }
    }
  }

  getVertexById(vertexId) {
    return this.vertexMap.get(+vertexId);
    for (var i = 0; i < this.vertices.length; i ++) {
      
      var vertex = this.vertices[i];
      if (vertex.id == vertexId) return vertex;
    }
    return null;
  }

  updateEdgeWeight(v1Id, v2Id, weight) {
    const v1 = this.getVertexById(v1Id);
    const edge1 = v1.getEdge(v2Id);
    const v2 = this.getVertexById(v2Id);
    const edge2 = v2.getEdge(v1Id);
    edge1.setWeight(weight);
    edge2.setWeight(weight);
  }

  updateVertexWeight(vId, weight) {
    const v = this.getVertexById(vId);
    v.setWeight(weight);
  }

  updateAgentEdgePath(agentId, path) {
    const agent = this.getAgentById(agentId);
    path = path.map(vId => this.getVertexById(vId));
    agent.setPath(path);
  }

  updateAgentVertexWeight(agentId, vertices) {
    const agent = this.getAgentById(agentId);
    vertices = vertices.map(vId => this.getVertexById(vId));
    agent.setVertices(vertices);
  }

  toggleWeightMap(value) {
    this.vertices.forEach(v => {
      v.toggleWeight(value);
      v.edgeMap.forEach(e => e.toggleWeight(value));
    })
  }





}