export class Chat {

  constructor(client, parent) {
    this.client = client;
    this.div = document.createElement('div');
    this.div.classList.add('chat');
    parent.append(this.div);

    this.messageContainer = document.createElement('div');
    this.messageContainer.classList.add('message-container');
    this.div.append(this.messageContainer);

    const inputContainer = document.createElement('div');
    const input = document.createElement('input');
    const enter = document.createElement('div');
    inputContainer.classList.add('input-container');
    input.setAttribute('placeholder', '메세지를 입력하세요');
    input.classList.add('input');
    enter.classList.add('enter');
    enter.innerText = '전송';
    inputContainer.append(input);
    inputContainer.append(enter);
    this.div.append(inputContainer);
  }

  addMessage(message) {
    const el = document.createElement('div');
    el.classList.add('message');
    el.innerText = message;
    this.messageContainer.append(el);
    this.messageContainer.scrollTop = this.div.scrollHeight;
  }

}