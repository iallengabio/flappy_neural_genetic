import { NeuralNetwork } from '../ai/neural_network';
import PipeManager from '../entities/pipe_manager';
import { Player } from './player';
import p5 from 'p5';

export class NeuralPlayer extends Player {

  constructor(
    p: p5,
    private pipeManager: PipeManager,
    public network: NeuralNetwork
  ) {
    super(p);
  }

  update() {
    if (!this.isAlive) return;

    const inputs = this.getNetworkInputs();
    if (inputs) {
      const decision = this.network.predict(inputs)[0];
      if (decision > 0.5) {
        this.bird.jump();
      }
    }

    this.bird.update();
  }

  private getNetworkInputs(): number[] | null {
    // Normalização simples (ajuste conforme sua resolução)
    const BIRD_X = this.bird.position.x;
    const nextPipe = this.pipeManager.getNextPipe(BIRD_X);

    if (!nextPipe) return null;

    const pipeCenterX = nextPipe.getX() + nextPipe.getWidth() / 2;
    const gapCenterY = nextPipe.getGapCenterY();

    return [
      (pipeCenterX - BIRD_X) / this.p.width,  // Distância X normalizada
      (gapCenterY - this.bird.position.y) / this.p.height // Distância Y normalizada
    ];
  }
}