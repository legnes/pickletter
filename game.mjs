import Level from './level.mjs';
import Player from './player.mjs';
import { renderLetters } from './util.mjs';
import Dictionary from './dictionary.mjs';

const PHASES = {
  NONE: 'none',
  POOL_ADVANCES: 'poolAdvances',
  PLAYER_PLAYS: 'playerPlays',
  PLAYER_SCORES: 'playerScores',
  TURN_ENDS: 'turnEnds'
};

export default class Game {
  constructor(text, opts={}) {
    this.score = 0;
    this.scores = [];
    this.phase = PHASES.NONE;
    this.onStateChange = opts.onStateChange || (() => true);

    this.board = [];
    this.level = new Level(text);
    this.player = new Player();

    document.addEventListener('keydown', evt => this.handleInput(evt));
  }

  protectPhase(phaseStr) {
    const val = this.phase !== PHASES[phaseStr];
    if (val) console.log(`phase break: expected ${PHASES[phaseStr]} found ${this.phase}`);
    return val;
  }

  setPhase(phase) {
    this.phase = phase;
    this.onStateChange(this.phase);
  }

  nextPhase() {
    switch(this.phase) {
      case PHASES.NONE:
        this.setPhase(PHASES.POOL_ADVANCES);
        this.drawWord();
        break;
      case PHASES.POOL_ADVANCES:
        if (this.level.ended) {
          this.setPhase(PHASES.NONE);
        } else {
          this.setPhase(PHASES.PLAYER_PLAYS);
        }
        break;
      case PHASES.PLAYER_PLAYS:
        if (this.player.turnEnded) {
          this.setPhase(PHASES.TURN_ENDS);
          this.endTurn();
        } else {
          this.setPhase(PHASES.PLAYER_SCORES);
          this.scoreBoard();
        }
        break;
      case PHASES.PLAYER_SCORES:
        this.setPhase(PHASES.PLAYER_PLAYS);
        break;
      case PHASES.TURN_ENDS:
        this.setPhase(PHASES.POOL_ADVANCES);
        this.drawWord();
        break;
    }
  }

  prevPhase() {
    switch(this.phase) {
      case PHASES.PLAYER_SCORES:
          this.setPhase(PHASES.PLAYER_PLAYS);
        break;
    }
  }

  start() {
    if (this.protectPhase('NONE')) return false;
    this.nextPhase();
  }

  drawWord() {
    if (this.protectPhase('POOL_ADVANCES')) return false;
    this.level.drawWord();
    this.nextPhase();
  }

  playLetter(key) {
    if (this.protectPhase('PLAYER_PLAYS')) return false;
    const letter = this.level.playLetter(key) || this.player.playLetter(key);
    if (letter) this.board.push(letter);
    this.onStateChange(this.phase);
  }

  recallLetter() {
    if (this.protectPhase('PLAYER_PLAYS')) return false;
    if (this.board.length > 0) this.board.pop().setUsed(false);
    this.onStateChange(this.phase);
  }

  recallBoard() {
    if (this.protectPhase('PLAYER_PLAYS')) return false;
    this.board.forEach(letter => letter.setUsed(false));
    this.board.length = 0;
    this.onStateChange(this.phase);
  }

  scoreOrEnd() {
    if (this.protectPhase('PLAYER_PLAYS')) return false;
    if (this.board.length < 1) {
      this.player.turnEnded = true;
    } else if (this.player.length < 3) {
      return;
    }
    this.nextPhase();
  }

  scoreBoard() {
    if (this.protectPhase('PLAYER_SCORES')) return false;
    const word = renderLetters(this.board);
    const pool = renderLetters(this.level.pool);
    const wordLength = this.board.length;

    if (wordLength < 3) return this.prevPhase();
    if (pool.indexOf(word) > -1) return this.prevPhase();
    if (!Dictionary[word]) return this.prevPhase();

    this.score += wordLength;
    this.scores.push(word);
    this.level.commitPool();
    this.player.commitHand();
    this.player.drawLetters(Math.max(0, wordLength - 3));
    this.board.length = 0;
    this.nextPhase();
  }

  endTurn() {
    if (this.protectPhase('TURN_ENDS')) return false;
    this.recallBoard();
    this.player.addToDiscard(this.level.pool);
    this.player.repopulateDeck();
    this.player.drawLetters(1);
    this.player.turnEnded = false;
    this.nextPhase();
  }

  handleInput(evt) {
    let preventDefault = false;
    if (evt.key.length === 1 && /[a-zA-Z]/.test(evt.key)) {
      const key = evt.key.toUpperCase();
      this.playLetter(key);
    } else {
      switch(evt.key) {
        case 'Enter':
          this.scoreOrEnd();
          break;
        case 'Esc':
        case 'Escape':
          preventDefault = true;
          this.recallBoard();
          break;
        case 'Backspace':
        case 'Delete':
          preventDefault = true;
          this.recallLetter();
          break;
        case ' ':
          preventDefault = true;
          this.player.shuffleHand();
          this.onStateChange(this.phase);
          break;
      }
    }
    if (preventDefault) {
      evt.stopPropagation();
      evt.preventDefault();
    }
  }
}

// TODO:
// o actually score words/fail the board
// o use a switch in handleInput?
// o space bar to shuffle hand

