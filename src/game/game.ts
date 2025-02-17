import p5 from 'p5';
import { Player } from './players/player';
import { RealPlayer } from './players/real_player';
import PipeManager from './entities/pipe_manager';
import { NeuralPlayer } from './players/neural_player';

export class Game {
  private p: p5;
  private players: Player[];
  private pipeManager: PipeManager;
  private isGameOver: boolean; // Adicione esta linha
  private fixedTimeStep: number = 1000 / 60; // 60 updates por segundo
  private lastUpdateTime: number = -1 * this.fixedTimeStep;

  constructor(p: p5, humanPlayers: number = 1, aiPlayers: number = 0) {
    this.p = p;
    this.players = [];
    this.pipeManager = new PipeManager(p);

    // Cria jogadores AI
    for (let i = 0; i < aiPlayers; i++) {
      this.players.push(new NeuralPlayer(p, this.pipeManager));
    }

    // Cria jogadores humanos
    for (let i = 0; i < humanPlayers; i++) {
      this.players.push(new RealPlayer(p));
    }
    this.fixedTimeStep = 1000 / 60; // 60 updates por segundo
    this.lastUpdateTime = -1 * this.fixedTimeStep;

    this.isGameOver = false;

    p.mousePressed = () => this.handleMousePress();
  }

  private checkCollisions(player: Player) {
    // Lógica de colisão similar à anterior, mas para cada player
    const birdRect = {
      x: player.bird.position.x - 20,
      y: player.bird.position.y - 20,
      w: 40,
      h: 40
    };

    // Colisão com chão/teto
    if (birdRect.y < 0 || birdRect.y + birdRect.h > this.p.height) {
      player.isAlive = false;
      return;
    }

    // Colisão com canos
    this.pipeManager.getPipes().forEach(pipe => {
      const [upper, lower] = pipe.getBoundingBoxes();
      if (this.checkRectCollision(birdRect, upper) ||
        this.checkRectCollision(birdRect, lower)) {
        player.isAlive = false;
      }
    });
  }
  private checkRectCollision(rect1: { x: number, y: number, w: number, h: number },
    rect2: { x: number, y: number, w: number, h: number }): boolean {
    return rect1.x < rect2.x + rect2.w &&
      rect1.x + rect1.w > rect2.x &&
      rect1.y < rect2.y + rect2.h &&
      rect1.h + rect1.y > rect2.y;
  }

  public update() {
    const now = performance.now();
    let delta = now - this.lastUpdateTime;

    // Processa múltiplas atualizações se necessário (catch-up)
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
          
          
          // Verifica passagem do cano
          if (player.nextPipe && 
              player.bird.position.x > player.nextPipe.getX() + player.nextPipe.getWidth()) {
            player.currentScore++;
            player.updateNextPipe(this.pipeManager.getPipes()); // Busca novo cano
          }

          // Atualiza referência do próximo cano
          player.updateNextPipe(this.pipeManager.getPipes());

          player.update();
          this.checkCollisions(player);
        }
      });

      this.isGameOver = this.allPlayersDead();
    }
    this.draw();
  }

  private allPlayersDead(): boolean {
    return this.players.every(player => !player.isAlive);
  }

  public draw() {
    this.p.background(135, 206, 235);

    this.pipeManager.draw();
    this.players.forEach(player => player.draw());

    this.drawPlayersUI();

    if (this.isGameOver) {
      this.drawGameOverScreen();
    }
  }

  private drawGameOverScreen() {
    this.p.fill(0, 150);
    this.p.rect(0, 0, this.p.width, this.p.height);

    this.p.fill(255);
    this.p.textSize(64);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.text("Game Over", this.p.width / 2, this.p.height / 2 - 40);

    this.p.textSize(24);
    this.p.text("Click to restart", this.p.width / 2, this.p.height / 2 + 40);
  }

  private drawPlayersUI() {
    this.p.fill(255);
    this.p.textSize(16);
  
    // Filtra apenas jogadores vivos
    const alivePlayers = this.players.filter(player => player.isAlive);
  
    alivePlayers.forEach((player, index) => {
      const yPos = 30 + (index * 30);
  
      // Ícone de cor do pássaro
      this.p.fill(player.bird.color);
      this.p.rect(10, yPos - 15, 20, 20);
  
      // Texto de pontuação
      this.p.fill(255);
      this.p.text(`Player ${index + 1}: ${player.currentScore}`, 40, yPos);
    });
  }

  private handleMousePress() {
    if (this.isGameOver) {
      this.resetGame();
    }
  }

  private resetGame() {
    this.players.forEach(player => player.reset());
    this.pipeManager.reset();
    this.isGameOver = false;
  }
}