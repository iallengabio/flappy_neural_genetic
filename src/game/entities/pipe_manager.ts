import p5 from 'p5';
import Pipe from './pipe';

export default class PipeManager {
  private p: p5;
  private pipes: Pipe[];
  private pipeSpacing: number;
  private pipeSpeed: number;
  private lastPipeTime: number;

  constructor(p: p5) {
    this.p = p;
    this.pipes = [];
    this.pipeSpacing = 200;
    this.pipeSpeed = 3;
    this.lastPipeTime = -1500;
  }

  draw() {
    this.pipes.forEach(pipe => pipe.draw());
  }

  reset(){
    this.pipes = [];
    this.lastPipeTime = -1500;
  }

  update() {
    // Gera novos canos
    if (this.p.millis() - this.lastPipeTime > 1500) {
      this.pipes.push(new Pipe(this.p));
      this.lastPipeTime = this.p.millis();
    }

    // Atualiza e limpa canos
    this.pipes.forEach(pipe => pipe.update(this.pipeSpeed));
    this.pipes = this.pipes.filter(pipe => !this.isPipeRedundant(pipe));
  }

  private isPipeRedundant(pipe: Pipe): boolean {
    // Remove canos que estão totalmente fora da tela
    return pipe.isOffScreen() && 
           this.pipes.some(p => p !== pipe && p.x < pipe.x); // Mantém apenas o último cano visível
  }

  // Adicione na classe PipeManager
  getPipes(): Pipe[] {
    return this.pipes;
  }

  getNextPipe(birdX: number): Pipe | null {
    // Encontra o primeiro cano que ainda não foi passado e está à frente do pássaro
    for (const pipe of this.pipes) {
      if (pipe.getX() + pipe.getWidth() > birdX) {
        return pipe;
      }
    }
    return null; // Se não houver canos à frente
  }
}