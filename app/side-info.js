export class SideInfo {

  constructor(parent, game) {
    this.div = document.createElement('div');
    this.div.classList.add('side-info');
    this.game = game;
    parent.append(this.div);




    

    this.turnCountContainer = document.createElement('div');
    this.turnCountContainer.classList.add('turn-count-container');
    const playerTurnCountLabel = document.createElement('div');
    const agentTurnCountLabel = document.createElement('div');
    playerTurnCountLabel.innerText = '전체 턴';
    agentTurnCountLabel.innerText = 'Agent 턴';
    this.turnCountContainer.append(playerTurnCountLabel);
    this.turnCountContainer.append(agentTurnCountLabel);
    this.playerTurnCount = document.createElement('div');
    this.agentTurnCount = document.createElement('div');
    this.turnCountContainer.append(this.playerTurnCount);
    this.turnCountContainer.append(this.agentTurnCount);
  }

  update() {
    this.div.innerHTML = '';
    const playersContainer = document.createElement('div');
    this.game.players.forEach(player => {
      const uPlayer = new Player(playersContainer, this.game, player);
    })
    this.div.append(this.turnCountContainer);
    this.div.append(playersContainer);

    this.playerTurnCount.innerText = this.game.playerTurnCount;
    this.agentTurnCount.innerText = this.game.agentTurnCount;
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

    const icon = document.createElement('div');
    icon.classList.add('icon');
    this.div.append(icon);
    const label = document.createElement('div');
    label.classList.add('label');
    this.div.append(label);
    label.innerText = 'Agent';

    if (agent.fog) {
      const fog = document.createElement('div');
      fog.classList.add('fog');
      icon.append(fog);
    }
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