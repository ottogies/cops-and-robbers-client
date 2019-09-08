export class SideInfo {

  constructor(parent, game) {
    this.div = document.createElement('div');
    this.div.classList.add('side-info');
    this.game = game;
    parent.append(this.div);
  }

  update() {
    this.div.innerHTML = '';
    const playersContainer = document.createElement('div');
    console.log(this.game.players);
    this.game.players.forEach(player => {
      const uPlayer = new Player(playersContainer, this.game, player);
    })
    this.div.append(playersContainer);
  }

}

class Player {

  constructor(parent, game, player) {
    this.div = document.createElement('div');
    this.div.classList.add('player');

    const nameContainer = document.createElement('div');
    this.div.append(nameContainer);
    nameContainer.innerText = player.username;
    const agentsContainer = document.createElement('div');
    this.div.append(agentsContainer);

    player.agents.forEach(agent => {
      const uAgent = new Agent(agentsContainer, game, player, agent, agent.role);
      uAgent.setTurn(game.currentTurnAgent == agent);
    })

    parent.append(this.div);
  }

}

class Agent {

  constructor(parent, game, player, agent, role) {
    this.div = document.createElement('div');
    this.div.classList.add('agent');
    this.div.classList.add(role);
    parent.append(this.div);

    this.div.addEventListener('click', e => {
      game.vertices.forEach(v => {
        v.div.classList.remove('h');
        v.edgeMap.forEach(edge => edge.div.classList.remove('h'));
      })
      agent.highlightPath();
    })
  }

  setTurn(value) {
    if (value) {
      this.div.classList.add('turn');
    }
    else {
      this.div.classList.remove('turn');
    }
  }

}