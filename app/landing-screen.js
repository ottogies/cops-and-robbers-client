export class LandingScreen {

  constructor() {
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
    this.elCops.innerText = 'Cops';
    this.elAnd.innerText = 'and';
    this.elRobbers.innerText = 'Robbers';
    this.titleContainer.append(this.elCops);
    this.titleContainer.append(this.elAnd);
    this.titleContainer.append(this.elRobbers);
  }

  show(parent) {
    parent.append(this.div);
    anime({
      targets: [this.elCops, this.elAnd, this.elRobbers],
      translateX: [-50, 0],
      translateY: [-50, 0],
      opacity: [0, 1],
      delay: anime.stagger(300),
      duration: 900,
      direction: 'forwards',
    });
  }

}