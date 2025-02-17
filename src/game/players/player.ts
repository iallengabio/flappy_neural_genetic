import p5 from 'p5';
import { Bird } from '../entities/bird';
import Pipe from '../entities/pipe';

export abstract class Player {
  public bird: Bird;
  public isAlive: boolean = true;
  public currentScore: number = 0;
  public nextPipe: Pipe | null = null;

  constructor(protected p: p5) {
    this.bird = new Bird(p);
  }

  abstract update(): void;


  public updateNextPipe(pipes: Pipe[]) {
    if (!this.nextPipe || this.bird.position.x > this.nextPipe.getX() + this.nextPipe.getWidth()) {
      this.nextPipe = pipes.find(pipe => 
        pipe.getX() + pipe.getWidth() > this.bird.position.x
      ) || null;
    }
  }

  draw() {
    if (this.isAlive) {
      this.bird.draw();
    }
  }

  reset() {
    this.bird.reset();
    this.currentScore = 0;
    this.isAlive = true;
    this.nextPipe = null;
  }
}