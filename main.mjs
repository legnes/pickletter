import Game from './game.mjs';
import Renderer from './renderer.mjs';
import TEXTS from './texts.mjs';

(function() {
  const text = TEXTS[Math.floor(Math.random() * TEXTS.length)];
  const game = new Game(text);
  const renderer = new Renderer(game);
  game.start();
})();

// TODO:
// - ways to pick more letters
// - ways to draw more
// - get rid of things from deck
