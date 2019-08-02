export class RoleSelect {

  constructor(client, container, game) {
    this.game = game;
    this.div = document.createElement('div');
    this.div.classList.add('role-select');

    this.copSelect = new RoleSelectButton(this.div, 'cop', 'Cop');
    this.robberSelect = new RoleSelectButton(this.div, 'robber', 'Robber');

    this.copSelect.onClick = () => {
      client.requestRoleSelect(game.id, 'cop');
    }
    this.robberSelect.onClick = () => {
      client.requestRoleSelect(game.id, 'robber');
    }

    client.onRoleSelect = (playerId, role) => {
      let roleButton;
      if (role == 'cop') roleButton = this.copSelect;
      else roleButton = this.robberSelect;
      if (client.id == playerId) {
        roleButton.setActive(true);
      }
      roleButton.setCount(roleButton.count + 1);
    }

    container.append(this.div);
  }
  
  dispose() {
    this.div.remove();
  }

}

class RoleSelectButton {

  constructor(container, role, label) {
    this.div = document.createElement('div');
    this.icon = document.createElement('div');
    this.label = document.createElement('div');
    this.countLabel = document.createElement('div');

    this.label.innerText = label;

    this.div.append(this.icon);
    this.div.append(this.label);
    this.div.append(this.countLabel);

    this.setCount(0);

    container.append(this.div);

    this.onClick = () => {}

    this.div.addEventListener('click', () => this.onClick());
  }

  setCount(val) {
    this.count = val;
    this.countLabel.innerText = val;
  }

  setActive(val) {
    if (val) this.div.classList.add('active');
    else this.div.classList.remove('active');
  }

}