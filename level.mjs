import Letter from './letter.mjs';
import { firstLetterOf } from './util.mjs';

export default class Level {
  constructor(text) {
    this.text = text;
    this.reservoir = text.match(/(\w+)/gm);
    this.pool = [];
    this.ended = false;
  }

  drawWord() {
    if (this.reservoir.length < 1) {
      this.ended = true;
      return;
    }
    this.pool = this.reservoir.shift().split('').map(char => new Letter(char));
  }

  playLetter(key) {
    const letter = firstLetterOf(this.pool, key);
    if (letter) letter.setUsed(true);
    return letter;
  }

  commitPool() {
    for (let i = this.pool.length - 1; i > -1; i--) {
      if (this.pool[i].used) {
        this.pool.splice(i, 1);
      }
    }
  }
}