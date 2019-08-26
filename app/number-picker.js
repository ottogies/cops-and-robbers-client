export class NumberPicker {

  constructor(parent, value, minValue, maxValue) {
    this.div = document.createElement('div');
    this.div.classList.add('number-picker');
    parent.append(this.div);

    this.minValue = minValue;
    this.maxValue = maxValue;
    
    this.valueText = document.createElement('div');
    this.valueText.classList.add('text');
    const decreaser = document.createElement('div');
    decreaser.classList.add('np-decreaser', 'np-btn');
    const increaser = document.createElement('div');
    increaser.classList.add('np-increaser', 'np-btn');

    const overlay = document.createElement('div');
    overlay.classList.add('np-overlay');
    overlay.append(decreaser);
    overlay.append(increaser);

    this.div.append(this.valueText);
    this.div.append(overlay);

    this.setValue(value);

    decreaser.addEventListener('click', () => {
      this.setValue(this.value - 1);
    })
    increaser.addEventListener('click', () => {
      this.setValue(this.value + 1);
    })
  }

  setValue(value) {
    value = Math.max(this.minValue, Math.min(this.maxValue, value));
    this.value = value;
    this.valueText.innerText = this.value;
  }

}