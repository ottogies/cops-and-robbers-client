import { LandingScreen } from "./landing-screen.js";
import { Room } from "./room.js";
import { Client } from "./client.js";
import { Lobby } from "./lobby.js";
import { Game } from "./game.js";

export class App {

  constructor() {
    this.client = new Client();

    this.landingScreen = new LandingScreen();

    this.div = document.createElement('div');
    this.div.id = 'app';
    document.body.append(this.div);
    

    this.client.onConnect = () => {
      console.log('connected!');
      this.showLandingScreen();
    }

    this.client.onRoomJoinAccept = (roomID, title, capacity) => {
      if (this.lobby) this.lobby.dispose();
      this.room = new Room(this.client, this.div, roomID, title, capacity);

      this.room.onRoomLeave = () => {
        this.room.dispose();
        this.lobby = new Lobby(this.client, this.div);
      }
    }

    this.client.onGameStart = (gameID) => {
      console.log(this.lobby, this.room);
      if (this.lobby) this.lobby.dispose();
      if (this.room) this.room.dispose();
      alert('Game started!');
      this.game = new Game(this.client, this.div, gameID);
    }

    this.client.connect();
    
  }

  showLandingScreen() {
    this.landingScreen.show(this.div)
    this.landingScreen.onPlayButtonClick = () => {
      this.landingScreen.dispose();
      this.createLobby();
    }
  }

  createLobby() {
    this.lobby = new Lobby(this.client, this.div);
  }

  createRoom(roomId) {
    new Room(this.div);
  }

}
