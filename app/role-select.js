export class RoleSelect {

  constructor(client, container, game) {
    this.game = game;
    this.div = document.createElement('div');
    this.div.classList.add('role-select');

    this.div.style.position = 'absolute';

    const textContainer = document.createElement('div');
    textContainer.classList.add('text-container');
    textContainer.innerText = '역할을 선택하세요';
    this.div.append(textContainer);

    const roleContainer = document.createElement('div');
    roleContainer.classList.add('role-container');
    this.div.append(roleContainer);

    this.copSelect = new RoleSelectButton(roleContainer, 'cop', 'Cop');
    this.robberSelect = new RoleSelectButton(roleContainer, 'robber', 'Robber');

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
    this.icon.classList.add('icon', role);
    this.label = document.createElement('div');
    this.countLabel = document.createElement('div');
    this.countLabel.classList.add('label', role);
    this.div.classList.add('role', role);

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