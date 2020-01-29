import { shuffle, firstLetterOf } from './util.mjs';

export default class Player {
  constructor() {
    this.deck = [];
    this.hand = [];
    this.discard = [];
    this.turnEnded = false;
  }

  playLetter(key) {
    const letter = firstLetterOf(this.hand, key);
    if (letter) letter.setUsed(true);
    return letter;
  }

  commitHand() {
    for (let i = this.hand.length - 1; i > -1; i--) {
      if (this.hand[i].used) {
        this.discard.push(...this.hand.splice(i, 1));
      }
    }
    this.discard.forEach(letter => letter.setUsed(false));
  }

  drawLetters(count) {
    // if (this.deck.length < count) {
    //   this.deck.push(...this.discard);
    //   this.discard.length = 0;
    //   shuffle(this.deck);
    // }

    count = Math.min(count, this.deck.length);
    this.hand.push(...this.deck.splice(0, count));
  }

  repopulateDeck() {
    this.deck.push(...this.discard);
    this.discard.length = 0;
    shuffle(this.deck);
  }

  addToDiscard(letters) {
    this.discard.push(...letters);
  }

  shuffleHand() {
    shuffle(this.hand);
  }
}