# Flappy Bird AI - Projeto Educacional

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/p5.js-ED225D?style=for-the-badge&logo=p5dotjs&logoColor=white">
  <img src="https://img.shields.io/badge/Neural_Network-FF6F00?style=for-the-badge&logo=ai&logoColor=white">
</p>

## 🚀 Visão Geral

Este projeto tem como **objetivo educacional** demonstrar a implementação de:
- Redes Neurais Artificiais
- Algoritmos Genéticos
- Princípios de Machine Learning

**Não é focado em performance**, mas sim na didática de implementação de conceitos de IA em TypeScript.

## 🧠 Funcionalidades Principais

- **Sistema de IA Evolutivo**
  - População de pássaros controlados por redes neurais
  - Algoritmo genético para seleção natural
  - Mutação e crossover de pesos neuronais

- **Visualização Interativa**
  - Exibição em tempo real da geração atual
  - Monitoramento do melhor score histórico
  - Controle manual opcional (tecla espaço)

- **Configuração Educacional**
  - Arquitetura neural modificável (2-2-1)
  - Parâmetros genéticos ajustáveis
  - Visualização simplificada de colisões

## 💻 Tecnologias Utilizadas

| Tecnologia          | Finalidade                  |
|---------------------|-----------------------------|
| TypeScript          | Lógica principal do jogo    |
| p5.js               | Renderização gráfica        |
| Parcel              | Bundler e hot reload        |
| Algoritmos Genéticos| Evolução das redes neurais  |

## ⚙️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/flappy-bird-ai.git
```
Instale as dependências:
```bash
npm install
```

## 🎮 Execução

Inicie o servidor de desenvolvimento:
```bash
npm start
```
Acesse no navegador:
```bash
http://localhost:1234
```

## 🧩 Estrutura do Projeto
```
└── 📁flappy_neural_genetic
    └── 📁src
        └── 📁game
            └── 📁ai
                └── neural_network.ts
            └── 📁entities
                └── bird.ts
                └── pipe_manager.ts
                └── pipe.ts
            └── game.ts
            └── 📁players
                └── neural_player.ts
                └── player.ts
                └── real_player.ts
        └── index.html
        └── index.ts
    └── .gitattributes
    └── .gitignore
    └── package-lock.json
    └── package.json
    └── README.md
    └── tsconfig.json
```

## 📚 Conceitos Demonstrados

### Redes Neurais
- Feedforward propagation
- Função de ativação sigmoide
- Normalização de entradas

### Algoritmos Genéticos
- Seleção por torneio
- Crossover uniforme
- Mutação gaussiana
- Estratégia elitista

### Padrões de Projeto
- Composição sobre herança
- Separação de responsabilidades
- Injeção de dependências

## 📊 Interface Educacional

UI Demo

## 🤝 Contribuição

Contribuições são bem-vindas! Siga estes passos:
1. Faça um fork do projeto
2. Crie uma branch com sua feature (`git checkout -b feature/incrivel`)
3. Commit suas mudanças (`git commit -m 'Add incrível feature'`)
4. Push para a branch (`git push origin feature/incrivel`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.

**Nota Educacional:** Este projeto foi desenvolvido para fins didáticos como parte do curso de Análise e Desenvolvimento de Sistemas do IFPI. O código prioriza clareza sobre otimização.
