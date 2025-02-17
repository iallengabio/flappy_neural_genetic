import p5 from 'p5';
import { Player } from './players/player';
import { RealPlayer } from './players/real_player';
import PipeManager from './entities/pipe_manager';
import { NeuralPlayer } from './players/neural_player';
import { GeneticAlgorithm } from './ai/genetic_algorithm';

export class Game {
  private p: p5;
  private players: Player[];
  private pipeManager: PipeManager;
  private isGameOver: boolean;
  private fixedTimeStep: number;
  private lastUpdateTime: number;
  private geneticAlgorithm: GeneticAlgorithm;
  private currentGeneration: number;

  constructor(p: p5, populationSize: number = 50) {
    this.p = p;
    this.players = [];
    this.pipeManager = new PipeManager(p);
    this.isGameOver = false;
    this.fixedTimeStep = 1000 / 60;
    this.lastUpdateTime = -this.fixedTimeStep;
    this.currentGeneration = 1;

    // Inicializa algoritmo genético
    this.geneticAlgorithm = new GeneticAlgorithm(populationSize);
    this.initializeAIPlayers();

    p.mousePressed = () => this.handleMousePress();
  }

  private initializeAIPlayers() {
    this.players = this.geneticAlgorithm.getPopulation().map(genome => 
      new NeuralPlayer(this.p, this.pipeManager, genome.network)
    );
  }

  private checkCollisions(player: Player) {
    const birdRadius = 20;
    const birdX = player.bird.position.x;
    const birdY = player.bird.position.y;

    // Colisão com chão/teto
    if (birdY < birdRadius || birdY > this.p.height - birdRadius) {
      player.isAlive = false;
      return;
    }

    // Colisão com canos
    this.pipeManager.getPipes().forEach(pipe => {
      const [upper, lower] = pipe.getBoundingBoxes();
      if (this.checkRectCollision(
        { x: birdX - birdRadius, y: birdY - birdRadius, w: birdRadius * 2, h: birdRadius * 2 },
        upper
      ) || this.checkRectCollision(
        { x: birdX - birdRadius, y: birdY - birdRadius, w: birdRadius * 2, h: birdRadius * 2 },
        lower
      )) {
        player.isAlive = false;
      }
    });
  }

  private checkRectCollision(
    rect1: { x: number; y: number; w: number; h: number },
    rect2: { x: number; y: number; w: number; h: number }
  ): boolean {
    return (
      rect1.x < rect2.x + rect2.w &&
      rect1.x + rect1.w > rect2.x &&
      rect1.y < rect2.y + rect2.h &&
      rect1.h + rect1.y > rect2.y
    );
  }

  public update() {
    const now = performance.now();
    let delta = now - this.lastUpdateTime;

    while (delta >= this.fixedTimeStep) {
      this.fixedUpdate();
      this.lastUpdateTime += this.fixedTimeStep;
      delta -= this.fixedTimeStep;
    }
  }

  public fixedUpdate() {
    if (!this.isGameOver) {
      this.pipeManager.update();

      this.players.forEach(player => {
        if (player.isAlive) {
          
          if (player.nextPipe && 
              player.bird.position.x > player.nextPipe.getX() + player.nextPipe.getWidth()) {
            player.currentScore++;
            player.updateNextPipe(this.pipeManager.getPipes());
          }

          player.updateNextPipe(this.pipeManager.getPipes());

          player.update();
          this.checkCollisions(player);
        }
      });

      this.isGameOver = this.allPlayersDead();
    } else {
      this.handleGenerationEnd();
    }
    this.draw();
  }

  private handleGenerationEnd() {
    this.updateFitness();
    this.geneticAlgorithm.evolve();
    this.currentGeneration++;
    this.initializeAIPlayers();
    this.resetGame();
  }

  private updateFitness() {
    this.players.forEach((player, index) => {
      this.geneticAlgorithm.getPopulation()[index].fitness = player.currentScore;
    });
  }

  private allPlayersDead(): boolean {
    return this.players.every(player => !player.isAlive);
  }

  public draw() {
    this.p.background(135, 206, 235);
    this.pipeManager.draw();
    this.players.forEach(player => player.draw());
    this.drawPlayersUI();
  }

  private drawPlayersUI() {
    this.p.fill(255);
    this.p.textSize(16);

    // Mostra jogadores vivos
    this.players.filter(player => player.isAlive).forEach((player, index) => {
      const yPos = 30 + index * 30;
      this.p.fill(player.bird.color);
      this.p.rect(10, yPos - 15, 20, 20);
      this.p.fill(255);
      this.p.text(`Score: ${player.currentScore}`, 40, yPos);
    });

    // Mostra informações da geração
    this.p.textSize(14);
    this.p.textAlign(this.p.LEFT, this.p.BOTTOM);
    this.p.text(`Generation: ${this.currentGeneration}`, 20, this.p.height - 40);
    this.p.text(`Best Fitness: ${this.geneticAlgorithm.getBestFitness().toFixed(2)}`, 20, this.p.height - 20);
  }

  private handleMousePress() {
    if (this.isGameOver) {
      this.resetGame();
    }
  }

  private resetGame() {
    this.pipeManager.reset();
    this.isGameOver = false;
    this.players.forEach(player => player.reset());
  }
}