import p5 from 'p5';

export class Bird {
  private p: p5;
  public position: p5.Vector;
  private velocity: number;
  private gravity: number;
  private jumpForce: number;
  public color: p5.Color;

  constructor(p: p5) {
    this.p = p;
    this.position = p.createVector(100, p.height / 2);
    this.velocity = 0;
    this.gravity = 0.6;
    this.jumpForce = -6;
    this.color = p.color(
      p.random(150, 255), 
      p.random(150, 255), 
      p.random(150, 255)
    );
  }

  jump() {
    this.velocity = this.jumpForce;
  }

  update() {
    this.velocity += this.gravity;
    this.position.y += this.velocity;
  }

  draw() {
    this.p.fill(this.color);
    this.p.ellipse(this.position.x, this.position.y, 40, 40);
  }

  reset() {
    this.position.y = this.p.height / 2;
    this.velocity = 0;
  }
}