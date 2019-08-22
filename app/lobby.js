export class Lobby {

  constructor(client, container) {
    this.client = client;

    this.div = document.createElement('div');
    this.div.classList.add('lobby');
    container.append(this.div);

    this.roomListContainer = document.createElement('div');
    this.roomListContainer.classList.add('room-list-container');
    this.buttonsContainer = document.createElement('div');
    this.buttonsContainer.classList.add('buttons-container');
    this.topContainer = document.createElement('div');
    this.topContainer.classList.add('top-container');

    this.buttonRoomCreate = document.createElement('div');
    this.buttonRoomCreate.innerText = '방 만들기';
    this.buttonsContainer.append(this.buttonRoomCreate);
    this.buttonRoomCreate.addEventListener('click', () => {
      this.createRoom();
    })

    const refreshButton = document.createElement('div');
    refreshButton.classList.add('btn-refresh');
    refreshButton.innerText = '새로고침';
    this.topContainer.append(refreshButton);
    refreshButton.addEventListener('click', () => {
      this.roomList.refresh();
    });

    this.div.append(this.topContainer);
    this.div.append(this.roomListContainer);
    this.div.append(this.buttonsContainer);

    this.roomList = new RoomList(client, this.roomListContainer);

    client.onRoomJoinReject = (roomID, responseCode) => {
      alert('Room Join Rejected! ' + roomID + ', code = ', responseCode);
    }

    anime({
      targets: [this.div],
      opacity: [0, 1],
      translateY: [-20, 0],
      duration: 300,
      easing: 'linear'
    });
  }

  createRoom() {
    const title = prompt('Title?');
    const capacity = +prompt('Capacity?')
    this.client.requestRoomCreate(title, capacity);
  }

  dispose() {
    this.div.remove();
  }

}

class RoomList {

  constructor(client, container) {
    this.client = client;
    this.div = document.createElement('div');
    this.div.classList.add('room-list');
    container.append(this.div);
    this.rooms = [];

    const top = document.createElement('div');
    top.classList.add('room-list-header');
    top.innerHTML = `
      <div class='no'>번호</div>
      <div class='title'>방 제목</div>
      <div class='capacity'>인원</div>
    `
    this.div.append(top);

    client.onRoomList = (rooms) => {
      this.clear();
      rooms.forEach(room => {
        this.addRoom(room.id, room.title, room.noOfPlayers, room.capacity);
      })
    }

    client.requestRoomList();
  }

  clear() {
    this.rooms.forEach(room => room.dispose());
    this.rooms = [];
  }

  addRoom(id, title, currentPlayerNo, capacity) {
    const room = new Room(this.client, this.div, id, title, currentPlayerNo, capacity);
    this.rooms.push(room);
  }

  getRoomByID(id) {
    for (let i = 0; i < this.rooms.length; i ++) {
      if (this.rooms[i].id == id) return this.rooms[i];
    }
  }

  refresh() {
    this.client.requestRoomList();
  }

}

class Room {

  constructor(client, container, id, title, currentPlayerNo, capacity) {
    this.client = client;
    this.id = id;
    this.title = title;
    this.currentPlayerNo = currentPlayerNo;
    this.capacity = capacity;

    this.div = document.createElement('div');
    this.div.classList.add('room-list-item');
    container.append(this.div);
    
    this.idContainer = document.createElement('div');
    this.titleContainer = document.createElement('div');
    this.capacityContainer = document.createElement('div');

    this.idContainer.classList.add('id');
    this.titleContainer.classList.add('title');
    this.capacityContainer.classList.add('capacity');

    this.idContainer.innerText = id;
    this.titleContainer.innerText = title;
    this.capacityContainer.innerText = currentPlayerNo + '/' + capacity;

    this.div.append(this.idContainer);
    this.div.append(this.titleContainer);
    this.div.append(this.capacityContainer);

    this.div.addEventListener('click', () => {
      this.client.requestRoomJoin(this.id);
    });
  }
  
  dispose() {
    this.div.remove();
  }

}