export class LandingScreen {

  constructor(client) {
    this.client = client;
    this.onPlayButtonClick = () => {}

    this.div = document.createElement('div');
    this.div.id = 'landing';

    this.titleContainer = document.createElement('div');
    this.titleContainer.classList.add('title-container');
    this.div.append(this.titleContainer);

    this.elCops = document.createElement('div');
    this.elAnd = document.createElement('div');
    this.elRobbers = document.createElement('div');
    this.elCops.classList.add('title', 'cops');
    this.elAnd.classList.add('title', 'and');
    this.elRobbers.classList.add('title', 'robbers');
    this.elCops.innerHTML = '<img src="./res/cops.png">';
    this.elAnd.innerHTML = '<img src="./res/and.png">';
    this.elRobbers.innerHTML = '<img src="./res/robbers.png">';
    this.titleContainer.append(this.elCops);
    this.titleContainer.append(this.elAnd);
    this.titleContainer.append(this.elRobbers);

    this.playButton = document.createElement('div');
    this.playButton.classList.add('btn-play');
    const playButtonContent = document.createElement('div');
    playButtonContent.classList.add('btn-play-content');
    this.playButton.append(playButtonContent);
    playButtonContent.innerText = 'PLAY!';

    const footer = document.createElement('div');
    footer.classList.add('sfooter');
    footer.innerHTML = `
      <div style='font-weight: bold'>Team 오뚜기</div>
      <div>정보컴퓨터공학부 2019년도 전기 졸업과제</div>
    `

    this.div.append(this.playButton);
    this.div.append(footer);

    this.bindEvents();
  }

  show(parent) {
    parent.append(this.div);
    anime({
      targets: [this.elCops, this.elAnd, this.elRobbers],
      translateX: [-50, 0],
      translateY: [-50, 0],
      opacity: [0, 1],
      delay: anime.stagger(400),
      duration: 900,
      direction: 'forwards',
    });
    anime({
      targets: [this.playButton],
      translateY: [-50, 0],
      opacity: [0, 1],
      delay: 1300,
      duration: 1000
    })
  }

  bindEvents() {
    this.playButton.addEventListener('click', () => {
      anime({
        targets: [this.div],
        opacity: [1, 0],
        translateY: [0, -20],
        duration: 300,
        easing: 'linear'
      })
      setTimeout(() => this.onPlayButtonClick(), 300);
    })
  }

  dispose() {
    this.div.remove();
  }

}