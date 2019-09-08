export class Chat {

  constructor(client, parent) {
    this.client = client;
    this.div = document.createElement('div');
    this.div.classList.add('chat');
    parent.append(this.div);
  }

  addMessage(message) {
    const el = document.createElement('div');
    el.classList.add('message');
    el.innerText = message;
    this.div.append(el);
    this.div.scrollTop = this.div.scrollHeight;
  }

}