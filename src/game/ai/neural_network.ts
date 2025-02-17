export class NeuralNetwork {
    private inputNodes: number;
    private hiddenNodes: number;
    private outputNodes: number;
    
    // Pesos e biases
    public weightsIH: number[][]; // Input -> Hidden
    public weightsHO: number[][]; // Hidden -> Output
    private biasH: number[];
    private biasO: number[];
  
    constructor(input: number, hidden: number, output: number) {
      this.inputNodes = input;
      this.hiddenNodes = hidden;
      this.outputNodes = output;
  
      // Inicialização aleatória dos pesos
      this.weightsIH = this.randomMatrix(hidden, input);
      this.weightsHO = this.randomMatrix(output, hidden);

      console.log(this.weightsIH);
      
      // Inicialização dos biases
      this.biasH = new Array(hidden).fill(0).map(() => Math.random() * 2 - 1);
      this.biasO = new Array(output).fill(0).map(() => Math.random() * 2 - 1);
    }
  
    private randomMatrix(rows: number, cols: number): number[][] {
      return Array.from({ length: rows }, () => 
        Array.from({ length: cols }, () => Math.random() * 2 - 1)
      );
    }
  
    // Função de ativação (sigmoide)
    private sigmoid(x: number): number {
      return 1 / (1 + Math.exp(-x));
    }
  
    // Feedforward
    public predict(inputs: number[]): number[] {
      // Input -> Hidden
      const hidden = this.weightsIH.map((weights, i) => 
        this.sigmoid(
          weights.reduce((sum, w, j) => sum + w * inputs[j], 0) + this.biasH[i]
        )
      );
  
      // Hidden -> Output
      const output = this.weightsHO.map((weights, i) => 
        this.sigmoid(
          weights.reduce((sum, w, j) => sum + w * hidden[j], 0) + this.biasO[i]
        )
      );
  
      return output;
    }
  }