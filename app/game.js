import { Vertex } from "./vertex.js";
import { Agent } from "./agent.js";
import { Player } from "./player.js";
import { AbstractClient } from "./abstract-client.js";
import { Cop } from "./cop.js";
import { Robber } from "./robber.js";
import { RoleSelect } from "./role-select.js";

/**
 * git add *
 * git commit -m "message"
 * git push
 */

export class Game {

  /** 
   * @param {AbstractClient} client  
   */  
  constructor(client, container, id) {
    this.id = id;
    this.client = client;
    this.vertices = [];
    this.players = [];

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
    this.headertext.innerText = "Cops and Robbers!";
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
    this.section.innerText = "section";
    this.section.classList.add('section');
    this.ingameContainer.append(this.section);
    //게임 나올곳 
    
    this.aside = document.createElement('aside');
    this.aside.className = "aside";
    this.aside.innerText = "aside";
    this.aside.classList.add('aside');
    this.ingameContainer.append(this.aside);
    // 변화에 따른 

    this.footer  = document.createElement('footer');
    this.footer.className = "footer";
    this.footer.innerText = "footer";
    this.footer.classList.add('footer');
    this.div.append(this.footer);
    
    //이것도 고정된 값


    // 그래프 크기에 따라 section크기에 대해 vertex 크기를 조절해야댐

    // document.body.append(this.footer);
    
    this.client.onCreateVertex = (vertexId, x, y) => {
      this.createVertex(vertexId, x, y);
    }
    this.client.onCreateEdge = (v1Id, v2Id) => {
      this.createEdge(v1Id,v2Id);
    }
    this.client.onCreatePlayer = (playerId, isLocal, type) => {
        this.createPlayer(playerId, isLocal, type);
    }
    this.client.onCreateAgent = (playerId, agentId, role, vertexId) => {
        this.createAgent(playerId, agentId, role, vertexId);        
    }
    this.client.onMoveAgent = (currentVertexId,playerId,agentId, vertexId) => {
        this.moveAgent(currentVertexId, playerId, agentId, vertexId);
    }
    this.client.onRequestAgentPlace = (playerId, numberOfAgents) => {
        this.requestPlaceAgent(playerId, numberOfAgents)
    }
    this.client.onAgentMoveTurn = (playerId, agentId) => {
      if (this.client.id != playerId) return;
      this.agentMoveTurn(playerId, agentId);
    }

    // 이 밑에꺼 고쳐
    // this.client.onAgentCaught = (playerId, agentId) => {

    // }
    // this.client.onGameEnd() = (role) => {

    // }

    // TODO
    // this.client.onAgentCaught = (playerId, agentId) => {
    //   implement..
    // }
    // this.client.onGameEnd = 

  }

  sizeofMap(){
    console.log(3);
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
    
    let width = xMax - xMin ;
    let height = yMax - yMin ;
    this.div = document.getElementById("section");
    
    this.div.style.width =   width + "px";
    this.div.style.height =  height + "px";  
    // 이게 맞는건가 ? 지금 크기를 하나도 못받아옴

    
     // 여기서 외곽 x,y 좌표 구했고  받을걸로 외곽구역을 그리고 
     // vertex의 크기 조절 해야대나?---> 안해도 될듯?
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
    var requestPromise = player.requestMoveAgent(agentId);
    requestPromise.then(result => {
      this.client.requestAgentMove(this.id, agentId, result.id);
    });
  }

  createPlayer(id,isLocal,type) {
    const player = new Player(id, this);
    this.players.push(player);
  }

  createVertex(id, x, y) {
    let vertex = new Vertex(this.section, id, x, y);
    this.vertices.push(vertex);
    this.sizeofMap()
  }

  createEdge(v1Id, v2Id) {
    var v1 = this.getVertexById(v1Id);
    var v2 = this.getVertexById(v2Id);
    console.log(v1,v2);
    var edge = v1.addEdge(this.section, v2);
    console.log(edge);

  }

  createAgent(playerId, agentId, role, vertexId) {
    let agent = null;
    var player = this.getPlayerById(playerId);
    var vertex = this.getVertexById(vertexId);
    if (role == 'cop') {
      agent = new Cop(this.section, agentId, vertex);
    }
    else {
      agent = new Robber(this.section, agentId, vertex);
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

   }

  caughtRobber(copId, robberId) {
    var cop = this.getAgentById(copId);
    var robber = this.getAgentById(robberId);
    console.log(cop,robber);

    const textDiv = document.createElement('div');
    textDiv.classList.add("caughtstyle");
    textDiv.innerHTML = "<span><b><font color='blue' , size ='10'>Caught!</font></b></span>";
    

    document.getElementById('game').append(textDiv);
    setTimeout(() => {
      textDiv.remove();
    }, 2000)

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
    for (var i = 0; i < this.vertices.length; i ++) {
      
      var vertex = this.vertices[i];
      if (vertex.id == vertexId) return vertex;
    }
    return null;
  }



}