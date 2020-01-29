import { renderLetters } from './util.mjs';

export default class Renderer {
  constructor(game) {
    this.game = game;
    this.init();
    this.game.onStateChange = (phase) => this.render(phase);
  }

  renderLetters = (letters) => letters.reduce((innerHTML, letter) => (
    innerHTML + (letter ? `<span class="letter ${letter.used ? 'used' : ''}">${letter.key}</span>` : '')
  ), '');

  renderPile = (letters) => `<span class="letter">${letters.length}</span>`

  init() {
    this.pool = document.getElementById("pool");
    this.board = document.getElementById("board");
    this.hand = document.getElementById("hand");
    this.deck = document.getElementById("deck");
    this.discard = document.getElementById("discard");
    this.score = document.getElementById("score");
    this.scores = document.getElementById("scores");
    this.scoreContainer = document.getElementById("scoreContainer");
  }

  render(phase) {
    this.pool.innerHTML = this.renderLetters(this.game.level.pool, this.game.level.stagedLetter);
    this.board.innerHTML = renderLetters(this.game.board);
    this.hand.innerHTML = this.renderLetters(this.game.player.hand);
    this.deck.innerHTML = this.renderLetters([{key: this.game.player.deck.length}]);
    this.discard.innerHTML = this.renderLetters([{key: this.game.player.discard.length}]);
    this.score.innerHTML = `score: ${this.game.score}`;
    this.scores.innerHTML = this.game.scores.join('<br />');

    if (phase === 'none') {
      this.scoreContainer.classList.add('overlay');
      this.scores.innerHTML += `<br /><br /><br />${this.game.level.text}`;
    } else {
      this.scoreContainer.classList.remove('overlay');
    }
  }
}
