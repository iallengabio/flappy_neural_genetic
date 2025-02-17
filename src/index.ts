import p5 from 'p5';
import { Game } from './game/game';

const sketch = (p: p5) => {
  let game: Game;

  p.setup = () => {
    p.createCanvas(800, 600);
    game = new Game(p,0,1000);
  };

  p.draw = () => {
    game.update();
    //game.draw();
  };
};

new p5(sketch);