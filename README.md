# 🧙‍♂️ Jogo de RPG 2D Web

![GitHub repo size](https://img.shields.io/github/repo-size/username/repositorio)
![GitHub contributors](https://img.shields.io/github/contributors/username/repositorio)
![GitHub last commit](https://img.shields.io/github/last-commit/username/repositorio)
![Made with Firebase](https://img.shields.io/badge/Made%20with-Firebase-orange)

### 👨‍🏫 Professor: Marcos Vinícius  

### 👥 Alunos:
- Alice Ferreira (Front-end)
- Antônio Lucas Porangaba (Front-end)
- Luan Cristian Bulhões (Front-end)
- Paulo Henrique Macêdo (Front-end)

#### Back-end e Banco de Dados foi utilizado o FireBase,

---

## 🎮 Sobre o Projeto

O **Jogo de RPG 2D Web** é um jogo desenvolvido para navegador, onde o jogador controla um personagem principal que deve coletar objetos, explorar áreas e avançar por diferentes níveis organizados a partir de uma **estrutura de dados em árvore**.

Cada nível apresenta desafios únicos e objetos interativos. O progresso do jogador é salvo no **Firebase**, que também gerencia o inventário, os objetos coletados e a progressão entre os níveis.

---

## 🧩 Funcionalidades

### 🔹 Personagem Principal
- Controlado pelo jogador.
- Responsável por coletar e interagir com objetos no cenário.

### 🔹 Objetos Coletáveis
- Tipos: moedas, chaves, poções, entre outros.
- Cada item contém: `nome`, `descrição` e `valor` (quando aplicável).

### 🔹 Inventário
- Sistema de inventário com agrupamento por tipo.
- Limite de slots pode ser implementado.
- Atualizado em tempo real com Firebase.

### 🔹 Sistema de Coleta
- Ao colidir com um item, ele é transferido para o inventário.
- O item é removido do mapa após a coleta.

### 🔹 Estrutura de Árvore
- Cada nível é representado como um nó de uma árvore.
- Permite criar caminhos, bifurcações e áreas bloqueadas por itens específicos (ex: chave).

### 🔹 Design de Níveis
- Os níveis segue
