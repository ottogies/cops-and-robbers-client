import { NumberPicker } from "./number-picker.js";

export class Room {

  constructor(client, container, id, title, capacity) {
    this.client = client;
    this.id = id;
    this.title = title;
    this.capacity = capacity;

    this.div = document.createElement('div');
    this.div.classList.add('room');
    container.append(this.div);

    const titlePartContainer = document.createElement('div');
    titlePartContainer.classList.add('part-container', 'title-part-container');

    const listPartContainer = document.createElement('div');
    listPartContainer.classList.add('part-container', 'list-part-container');
    
    const optionPartContainer = document.createElement('div');
    optionPartContainer.classList.add('part-container', 'option-part-container');

    const menuPartContainer = document.createElement('div');
    menuPartContainer.classList.add('part-container', 'menu-part-container');

    this.div.append(titlePartContainer);
    this.div.append(listPartContainer);
    this.div.append(optionPartContainer);
    this.div.append(menuPartContainer);
  
    this.titlePart = new TitlePart(titlePartContainer, this.title);
    this.roomPlayerList = new RoomPlayerList(this.client, listPartContainer, capacity);
    this.optionPart = new OptionPart(this.client, optionPartContainer);
    this.menuPart = new MenuPart(this.client, menuPartContainer);

    this.menuPart.onRoomStartButtonClick = () => {
      const gridX = this.optionPart.gridXPicker.value;
      const gridY = this.optionPart.gridYPicker.value;
      const noOfRobbers = this.optionPart.noOfRobberPicker.value;
      const noOfCops = this.roomPlayerList.players.length - noOfRobbers;
      this.client.requestGameStart(this.id, gridX, gridY, noOfCops, noOfRobbers);
    }

    this.menuPart.onRoomLeaveButtonClick = () => {
      this.client.requestRoomLeave(this.id);
    }

    this.client.onRoomPlayerLeave = (playerID) => {
      console.warn('onRoomPlayerLeave',playerID, this.client.id);
      if (playerID == this.client.id) return this.onRoomLeave();
      this.roomPlayerList.removePlayer(playerID);
      this.optionPart.noOfRobberPicker.setMax(Math.max(1, this.roomPlayerList.players.length - 1));
    }

    this.client.onRoomPlayerJoin = (playerId, username, index, isLocal, isSuper) => {
      this.addPlayer(playerId, username, isSuper, index);
    }
    
    this.onRoomLeave = () => {}
  }

  setCapacity(value) {

  }

  addPlayer(playerId, username, isSuper, index) {
    this.roomPlayerList.addPlayer(playerId, username, isSuper, index);
    this.optionPart.noOfRobberPicker.setMax(Math.max(1, this.roomPlayerList.players.length - 1));
  }

  getPlayer(playerId) {
    return this.roomPlayerList.getPlayer(playerId);
  }

  dispose() {
    this.div.remove();
  }

}

class TitlePart {

  constructor(container, title) {
    this.div = document.createElement('div');
    this.div.classList.add('title-part');
    container.append(this.div);

    const titleEl = document.createElement('div');
    titleEl.classList.add('title');
    titleEl.innerText = title;
    this.div.append(titleEl);
  }

}

class RoomPlayerList {
  
  constructor(client, container, capacity) {
    this.client = client;
    this.capacity = capacity;

    this.div = document.createElement('div');
    this.div.classList.add('list-part');
    this.div.classList.add('player-list');
    container.append(this.div);
    this.players = [];
    this.playerContainers = [];
    this.initialize();
  }

  initialize() {
    for (let i = 0; i < 4; i ++) {
      const roomPlayerContainer = document.createElement('div');
      roomPlayerContainer.classList.add('player-container');
      const content = document.createElement('div');
      content.classList.add('content');
      roomPlayerContainer.append(content);
      this.div.append(roomPlayerContainer);
      roomPlayerContainer.setAttribute('index', i);
      this.playerContainers.push(content);
      if (this.capacity <= i) {
        roomPlayerContainer.classList.add('disable');
      }
    }
  }

  addPlayer(playerId, username, isSuper, index) {
    const roomPlayerContainer = this.playerContainers[index];
    console.warn('add Player', playerId, isSuper, index);
    const roomPlayer = new RoomPlayer(roomPlayerContainer, playerId, username, isSuper);
    this.players.splice(index, 0, roomPlayer);
  }

  removePlayer(playerId) {
    let index = -1;
    for (let i = 0; i < this.players.length; i ++) {
      const p = this.players[i];
      if (p.id == playerId) index = i;
    }
    if (index == -1) return console.error('No such room player found! ' + playerId);
    this.players.splice(index, 1)[0].dispose();
  }

  getPlayer(playerId) {
    for (let i = 0; i < this.players.length; i ++) {
      const p = this.players[i];
      if (p.id == player) return player;
    }
  }

}

class RoomPlayer {

  constructor(container, playerId, username, isSuper) {
    this.id = playerId;
    this.username = username;
    this.isSuper = isSuper;
    this.div = document.createElement('div');
    this.div.classList.add('player');
    this.div.innerText = username;
    container.append(this.div);
  }

  dispose() {
    this.div.remove();
  }

}

class OptionPart {

  constructor(client, container) {
    this.client = client;

    this.div = document.createElement('div');
    this.div.classList.add('option-part');
    container.append(this.div);

    const gridOption = document.createElement('div');
    gridOption.classList.add('grid');
    this.div.append(gridOption);
    {
      const ex = document.createElement('div');
      ex.classList.add('opt-label');
      ex.style.display = 'inline-block';
      ex.innerText = '그리드 크기 ';
      gridOption.append(ex);
    }
    this.gridXPicker = new NumberPicker(gridOption, 5, 3, 10);
    {
      const ex = document.createElement('div');
      ex.style.display = 'inline-block';
      ex.innerText = ' X ';
      gridOption.append(ex);
    }
    this.gridYPicker = new NumberPicker(gridOption, 5, 3, 10);
     
    {
      const _ = document.createElement('div');
      _.classList.add('_');
      this.div.append(_);
      _.innerText = '_'
    }

    const copVisionOption = document.createElement('div');
    copVisionOption.classList.add('cop-vision');
    this.div.append(copVisionOption);
    {
      const ex = document.createElement('div');
      ex.classList.add('opt-label');
      ex.style.display = 'inline-block';
      ex.innerText = '경찰 시야 제한';
      copVisionOption.append(ex);
    }
    this.copVisionPicker = new NumberPicker(copVisionOption, 1, 0, 5);

    const robberVisionOption = document.createElement('div');
    robberVisionOption.classList.add('robber-vision');
    this.div.append(robberVisionOption);
    {
      const ex = document.createElement('div');
      ex.classList.add('opt-label');
      ex.style.display = 'inline-block';
      ex.innerText = '도둑 시야 제한';
      robberVisionOption.append(ex);
    }
    this.robberVisionPicker = new NumberPicker(robberVisionOption, 1, 0, 5);


    const copAgentNum = document.createElement('div');
    copAgentNum.classList.add('cop-num');
    this.div.append(copAgentNum);
    {
      const ex = document.createElement('div');
      ex.classList.add('opt-label');
      ex.style.display = 'inline-block';
      ex.innerText = '도둑의 수';
      copAgentNum.append(ex);
    }
    this.noOfRobberPicker = new NumberPicker(copAgentNum, 1, 1, 1);
    // this.copNumPicker = new NumberPicker(copAgentNum, 1, 0, 5);

    // const robberAgentNum = document.createElement('div');
    // robberAgentNum.classList.add('robber-num');
    // this.div.append(robberAgentNum);
    // {
    //   const ex = document.createElement('div');
    //   ex.classList.add('opt-label');
    //   ex.style.display = 'inline-block';
    //   ex.innerText = '인당 도둑 개수';
    //   robberAgentNum.append(ex);
    // }
    // this.robberNumPicker = new NumberPicker(robberAgentNum, 1, 0, 5);
  }

}

class MenuPart {

  constructor(client, container) {
    this.client = client;

    this.div = document.createElement('div');
    this.div.classList.add('menu-part');
    container.append(this.div);

    const startButtonContainer = document.createElement('div');
    startButtonContainer.classList.add('button-container');

    const leaveButtonContainer = document.createElement('div');
    leaveButtonContainer.classList.add('button-container');

    this.startButton = document.createElement('div');
    this.startButton.classList.add('button-start');
    this.startButton.innerText = '게임 시작'
    startButtonContainer.append(this.startButton);

    this.leaveButton = document.createElement('div');
    this.leaveButton.classList.add('button-leave');
    this.leaveButton.innerText = '나가기'
    leaveButtonContainer.append(this.leaveButton);

    this.div.append(startButtonContainer);
    this.div.append(leaveButtonContainer);

    this.startButton.addEventListener('click', () => this.onRoomStartButtonClick());
    this.onRoomStartButtonClick = () => {}

    this.leaveButton.addEventListener('click', () => this.onRoomLeaveButtonClick());
    this.onRoomLeaveButtonClick = () => {}
  }

}