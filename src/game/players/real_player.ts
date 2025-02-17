import p5 from 'p5';
import { Player } from './player';

export class RealPlayer extends Player {
  private static JUMP_KEY = ' '; // Barra de espaço

  update() {
    if (this.p.keyIsPressed && this.p.key === RealPlayer.JUMP_KEY) {
      this.bird.jump();
    }
    
    if (this.isAlive) {
      this.bird.update();
    }
  }
}