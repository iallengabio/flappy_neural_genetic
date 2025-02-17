import { NeuralNetwork } from '../ai/neural_network';
import PipeManager from '../entities/pipe_manager';
import { Player } from './player';
import p5 from 'p5';

export class NeuralPlayer extends Player {
  private brain: NeuralNetwork;
  private pipeManager: PipeManager; // Nova propriedade

  constructor(p: p5, pipeManager: PipeManager) {
    super(p);
    this.pipeManager = pipeManager;
    this.brain = new NeuralNetwork(2, 2, 1); // 2-2-1
  }

  update() {
    if (!this.isAlive) return;

    // Obtém inputs do jogo
    const inputs = this.getNetworkInputs();
    
    if (inputs) {
      const decision = this.brain.predict(inputs)[0];
      
      // Decide pular se a saída > 0.5
      if (decision > 0.5) {
        this.bird.jump();
      }
    }

    this.bird.update();
  }

  reset(){
    super.reset();
    this.brain = new NeuralNetwork(2, 2, 1);
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