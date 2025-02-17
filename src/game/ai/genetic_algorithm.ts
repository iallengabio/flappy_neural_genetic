// genetic_algorithm.ts
import { NeuralNetwork } from './neural_network';

type Genome = {
  network: NeuralNetwork;
  fitness: number;
};

export class GeneticAlgorithm {
  private population: Genome[];
  private generation: number;
  private bestFitness: number;

  constructor(
    private populationSize: number,
    private mutationRate: number = 0.1,
    private crossoverRate: number = 0.7
  ) {
    this.population = [];
    this.generation = 1;
    this.bestFitness = 0;
    this.initializePopulation();
  }

  private initializePopulation() {
    for (let i = 0; i < this.populationSize; i++) {
      this.population.push({
        network: new NeuralNetwork(2, 2, 1),
        fitness: 0
      });
    }
  }

  public evolve() {
    this.evaluate();
    const newPopulation: Genome[] = [];
    
    // Mantém o melhor da geração anterior (elitismo)
    newPopulation.push(this.getBestGenome());
    
    while (newPopulation.length < this.populationSize) {
      const parent1 = this.selectParent();
      const parent2 = this.selectParent();
      
      let child = this.crossover(parent1, parent2);
      child = this.mutate(child);
      
      newPopulation.push(child);
    }
    
    this.population = newPopulation;
    this.generation++;
  }

  private evaluate() {
    // Ordena por fitness
    this.population.sort((a, b) => b.fitness - a.fitness);
    this.bestFitness = this.population[0].fitness;
  }

  private selectParent(): Genome {
    // Seleção por torneio
    const tournamentSize = 5;
    const candidates = [];
    
    for (let i = 0; i < tournamentSize; i++) {
      candidates.push(this.population[Math.floor(Math.random() * this.populationSize)]);
    }
    
    return candidates.reduce((best, current) => current.fitness > best.fitness ? current : best);
  }

  private crossover(parent1: Genome, parent2: Genome): Genome {
    if (Math.random() > this.crossoverRate) {
      return Math.random() < 0.5 ? parent1 : parent2;
    }

    // Crossover uniforme
    const childNetwork = new NeuralNetwork(2, 2, 1);
    
    // Camada input->hidden
    for (let i = 0; i < parent1.network.weightsIH.length; i++) {
      for (let j = 0; j < parent1.network.weightsIH[i].length; j++) {
        childNetwork.weightsIH[i][j] = Math.random() < 0.5 ? 
          parent1.network.weightsIH[i][j] : 
          parent2.network.weightsIH[i][j];
      }
    }
    
    // Camada hidden->output
    for (let i = 0; i < parent1.network.weightsHO.length; i++) {
      for (let j = 0; j < parent1.network.weightsHO[i].length; j++) {
        childNetwork.weightsHO[i][j] = Math.random() < 0.5 ? 
          parent1.network.weightsHO[i][j] : 
          parent2.network.weightsHO[i][j];
      }
    }
    
    return { network: childNetwork, fitness: 0 };
  }

  private mutate(genome: Genome): Genome {
    const mutateValue = (value: number): number => {
      if (Math.random() < this.mutationRate) {
        return value + (Math.random() * 2 - 1) * 0.5;
      }
      return value;
    };

    // Mutação nos pesos
    genome.network.weightsIH = genome.network.weightsIH.map(layer => 
      layer.map(mutateValue)
    );
    
    genome.network.weightsHO = genome.network.weightsHO.map(layer => 
      layer.map(mutateValue)
    );
    
    return genome;
  }

  public getBestGenome(): Genome {
    return { ...this.population[0] };
  }

  public getCurrentGeneration(): number {
    return this.generation;
  }

  public getBestFitness(): number {
    return this.bestFitness;
  }

  public getPopulation(): Genome[] {
    return this.population;
  }
}