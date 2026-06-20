# Dungeon Escape

## Integrantes

- João Vitor Lima Cecilio
- Bárbara Franco

## Descrição

Jogo de exploração em masmorra desenvolvido em JavaScript com p5.js para o projeto final da disciplina Web Development: HTML5 Canvas & Games.

O jogador controla um personagem preso em uma dungeon. O objetivo é pegar a chave, evitar inimigos e armadilhas, abrir a porta e escapar por 3 fases.

## Como jogar

- WASD ou setas para mover.
- Espaço para pausar ou continuar o jogo.
- Pegue a chave para liberar a porta.
- Evite inimigos e armadilhas.
- Vá até a porta depois de pegar a chave para avançar de fase.
- O jogo começa com 3 vidas.

## Controles

- WASD ou setas: mover personagem.
- Espaço: pausar/continuar jogo.

## Pontuação

- +100 pontos ao pegar a chave.
- +300 pontos ao completar uma fase.
- Bônus por tempo restante ao escapar.
- Ao tomar dano, o jogador perde vida, perde pontos e fica invencível por 1 segundo.

## Como executar

Abra o arquivo `index.html` no navegador.

Também é possível usar Live Server no VS Code ou o servidor local do Vite:

```bash
npm install
npm run dev
```

Se o PowerShell bloquear o comando `npm`, use:

```bash
npm.cmd install
npm.cmd run dev
```

Depois, acesse o endereço exibido no terminal.

## Assets

- `assets/dungeon_theme.mp3`: trilha sonora de gameplay em estilo dungeon medieval.

## Tecnologias

- HTML
- CSS
- JavaScript
- p5.js

## Estrutura

```text
/
├── index.html
├── style.css
├── sketch.js
├── README.md
└── assets/
    ├── player.png
    ├── enemy.png
    ├── key.png
    ├── door.png
    ├── wall.png
    ├── floor.png
    ├── trap.png
    ├── dungeon_theme.mp3
    ├── collect.wav
    ├── damage.wav
    ├── win.wav
    └── gameover.wav
```

## Onde explicar o código no vídeo

- Os mapas ficam no array `levels`, dentro de `sketch.js`.
- A movimentação e a colisão do jogador ficam na classe `Player`.
- Inimigos, chave, porta e armadilhas ficam nas classes `Enemy`, `Item`, `Door` e `Trap`.
- A troca de telas, pontuação, vidas e progressão ficam na classe `GameManager`.

## Vídeo
https://www.youtube.com/watch?v=m2leMUNl80g
