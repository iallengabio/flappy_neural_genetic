import p5 from 'p5';

export default class Pipe {
  private p: p5;
  public x: number;
  public gapY: number;
  public gapHeight: number;
  public width: number;
  public passedPlayers: Set<number>; // Armazena IDs dos jogadores que passaram

  constructor(p: p5) {
    this.p = p;
    this.width = 70;
    this.gapHeight = 160;
    this.gapY = p.random(100, p.height - this.gapHeight - 100);
    this.x = p.width;
    this.passedPlayers = new Set();
  }

  // Verifica se um jogador específico passou
  hasPassed(playerId: number): boolean {
    return this.passedPlayers.has(playerId);
  }

  // Marca um jogador como tendo passado
  markPassed(playerId: number) {
    this.passedPlayers.add(playerId);
  }

  update(speed: number) {
    this.x -= speed;
  }

  isOffScreen() {
    return this.x < -this.width;
  }

  draw() {
    this.p.fill(34, 139, 34); // Cor verde
    // Cano superior
    this.p.rect(this.x, 0, this.width, this.gapY);
    // Cano inferior
    this.p.rect(this.x, this.gapY + this.gapHeight, this.width, this.p.height);
  }

  // Adicione este método
  getBoundingBoxes() {
    return [
      { // Cano superior
        x: this.x,
        y: 0,
        w: this.width,
        h: this.gapY
      },
      { // Cano inferior
        x: this.x,
        y: this.gapY + this.gapHeight,
        w: this.width,
        h: this.p.height - (this.gapY + this.gapHeight)
      }
    ];
  }

 
  
  getX(): number {
    return this.x;
  }
  
  getWidth(): number {
    return this.width;
  }

  getGapCenterY(): number {
    return this.gapY + this.gapHeight / 2;
  }
}