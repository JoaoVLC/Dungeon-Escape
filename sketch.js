const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 680;
const HUD_HEIGHT = 86;
const STARTING_LIVES = 3;
const INVINCIBLE_TIME = 1000;

const assetFiles = {
  images: {
    player: "assets/player.png",
    enemy: "assets/enemy.png",
    key: "assets/key.png",
    door: "assets/door.png",
    wall: "assets/wall.png",
    floor: "assets/floor.png",
    trap: "assets/trap.png",
  },
  sounds: {
    collect: "assets/collect.wav",
    damage: "assets/damage.wav",
    win: "assets/win.wav",
    gameover: "assets/gameover.wav",
  },
  music: "assets/dungeon_theme.mp3",
};

const assets = {
  images: {},
  sounds: {},
};

const levels = [
  {
    name: "Entrada da Masmorra",
    timeLimit: 70,
    enemySpeed: 1.35,
    map: [
      "########################",
      "#P.....#............K.D#",
      "#......#..##########...#",
      "#......#...............#",
      "#..##########..#########",
      "#...............E......#",
      "#..##############..#...#",
      "#.................#....#",
      "#....########.....#....#",
      "#......................#",
      "#......................#",
      "########################",
    ],
  },
  {
    name: "Galeria das Armadilhas",
    timeLimit: 85,
    enemySpeed: 1.7,
    map: [
      "########################",
      "#P....#.......T....#..D#",
      "#.##..#.#########..#...#",
      "#......#.....E.....#...#",
      "######.#####..######...#",
      "#......#......#....T...#",
      "#.######..##..#.####...#",
      "#....E....##....#......#",
      "#..###########..#.####.#",
      "#...............#....K.#",
      "#..T..###########......#",
      "#......................#",
      "########################",
    ],
  },
  {
    name: "Câmara Final",
    timeLimit: 95,
    enemySpeed: 2.0,
    map: [
      "########################",
      "#P..T.....#.....E...D..#",
      "#..####...#..########..#",
      "#....E....#.....T......#",
      "####..########..####...#",
      "#...................#..#",
      "#..##.#..#####..###.#..#",
      "#..#..#...K.....#...#..#",
      "#..#..###########.#....#",
      "#..#......E.......#....#",
      "#..#####..###########..#",
      "#......................#",
      "########################",
    ],
  },
];

let gameManager;
let gameMusic = null;
let gameMusicPaused = false;

function preload() {
  for (const [name, path] of Object.entries(assetFiles.images)) {
    assets.images[name] = loadImage(
      path,
      () => {},
      () => {
        assets.images[name] = null;
      },
    );
  }

  if (typeof soundFormats === "function") {
    soundFormats("mp3", "wav");
  }

  if (typeof loadSound === "function") {
    for (const [name, path] of Object.entries(assetFiles.sounds)) {
      assets.sounds[name] = loadSound(
        path,
        () => {},
        () => {
          assets.sounds[name] = null;
        },
      );
    }

    try {
      gameMusic = loadSound(
        assetFiles.music,
        () => {
          if (gameMusic && typeof gameMusic.setVolume === "function") {
            gameMusic.setVolume(0.25);
          }
        },
        () => {
          gameMusic = null;
        },
      );
    } catch (error) {
      gameMusic = null;
    }
  }
}

function setup() {
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.parent("canvas-holder");
  textFont("Arial");
  imageMode(CENTER);
  rectMode(CORNER);
  gameManager = new GameManager();
}

function draw() {
  gameManager.update();
  gameManager.draw();
}

function mousePressed() {
  unlockAudio();
  gameManager.handleMousePressed();
}

function keyPressed() {
  unlockAudio();

  if (keyCode === 32 && gameManager.state === "playing") {
    togglePause();
    return false;
  }

  if (keyCode === ESCAPE) {
    gameManager.goToMenu();
  }

  if (key === "r" || key === "R") {
    if (gameManager.state === "gameOver") {
      gameManager.startGame();
    }
  }

  if (keyCode === ENTER && gameManager.state === "menu") {
    gameManager.startGame();
  }
}

window.addEventListener(
  "keydown",
  (event) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
      event.preventDefault();
    }
  },
  { passive: false },
);

function unlockAudio() {
  if (typeof userStartAudio === "function") {
    userStartAudio();
  }
}

function playSound(name) {
  const sound = assets.sounds[name];

  if (!sound || typeof sound.play !== "function") {
    return;
  }

  try {
    if (typeof sound.isPlaying === "function" && sound.isPlaying()) {
      sound.stop();
    }
    sound.play();
  } catch (error) {
    // O navegador pode bloquear audio ate a primeira interacao do usuario.
  }
}

function startGameMusic() {
  if (!gameMusic || typeof gameMusic.isPlaying !== "function") {
    return;
  }

  try {
    if (typeof gameMusic.setVolume === "function") {
      gameMusic.setVolume(0.25);
    }
    if (typeof gameMusic.setLoop === "function") {
      gameMusic.setLoop(true);
    }
    if (!gameMusic.isPlaying()) {
      if (gameMusicPaused && typeof gameMusic.play === "function") {
        gameMusic.play();
      } else if (typeof gameMusic.loop === "function") {
        gameMusic.loop();
      }
    }
    gameMusicPaused = false;
  } catch (error) {
    gameMusic = null;
  }
}

function pauseGameMusic() {
  if (!gameMusic || typeof gameMusic.isPlaying !== "function") {
    return;
  }

  try {
    if (gameMusic.isPlaying() && typeof gameMusic.pause === "function") {
      gameMusic.pause();
      gameMusicPaused = true;
    }
  } catch (error) {
    gameMusic = null;
  }
}

function stopGameMusic() {
  if (!gameMusic) {
    return;
  }

  try {
    if (typeof gameMusic.stop === "function") {
      gameMusic.stop();
    }
    gameMusicPaused = false;
  } catch (error) {
    gameMusic = null;
  }
}

function togglePause() {
  if (gameManager && gameManager.state === "playing") {
    gameManager.togglePause();
  }
}

function drawPauseOverlay() {
  push();
  noStroke();
  fill("rgba(0, 0, 0, 0.62)");
  rect(0, 0, width, height);

  drawPanel(width / 2 - 260, height / 2 - 92, 520, 184, "#201c17", "#f8d35d");
  textAlign(CENTER, CENTER);
  noStroke();
  fill("#f9d66b");
  textSize(40);
  textStyle(BOLD);
  text("JOGO PAUSADO", width / 2, height / 2 - 24);
  fill("#f5eddb");
  textStyle(NORMAL);
  textSize(20);
  text("Pressione ESPAÇO para continuar", width / 2, height / 2 + 34);
  pop();
}

function collidesAabb(aPos, aSize, bPos, bSize) {
  return (
    Math.abs(aPos.x - bPos.x) < (aSize + bSize) / 2 &&
    Math.abs(aPos.y - bPos.y) < (aSize + bSize) / 2
  );
}

function drawPanel(x, y, w, h, fillColor = "#242018", strokeColor = "#d7b56d") {
  push();
  drawingContext.shadowColor = "rgba(0, 0, 0, 0.36)";
  drawingContext.shadowBlur = 24;
  fill(fillColor);
  stroke(strokeColor);
  strokeWeight(2);
  rect(x, y, w, h, 8);
  pop();
}

function drawCenteredTitle(title, subtitle) {
  push();
  textAlign(CENTER, CENTER);
  noStroke();
  fill("#f9d66b");
  textSize(54);
  textStyle(BOLD);
  text(title, width / 2, 125);
  fill("#e7ddc0");
  textSize(18);
  textStyle(NORMAL);
  text(subtitle, width / 2, 172);
  pop();
}

class GameManager {
  constructor() {
    this.state = "menu";
    this.buttons = [];
    this.score = 0;
    this.lives = STARTING_LIVES;
    this.currentLevelIndex = 0;
    this.currentLevel = null;
    this.map = [];
    this.cols = 0;
    this.rows = 0;
    this.tileSize = 36;
    this.offsetX = 0;
    this.offsetY = 0;
    this.player = null;
    this.keyItem = null;
    this.door = null;
    this.enemies = [];
    this.traps = [];
    this.particles = [];
    this.message = "";
    this.messageUntil = 0;
    this.levelStartTime = 0;
    this.levelDamaged = false;
    this.completedLevelIndex = 0;
    this.levelCompleteStarted = 0;
    this.lastTimeBonus = 0;
    this.isPaused = false;
    this.pauseStartedAt = 0;
    this.setupMenu();
  }

  setupMenu() {
    this.isPaused = false;
    stopGameMusic();
    this.state = "menu";
    const buttonX = width / 2 - 120;
    this.buttons = [
      new Button("Jogar", buttonX, 270, 240, 52, () => this.startGame()),
      new Button("Como jogar", buttonX, 340, 240, 52, () => this.setupInstructions()),
      new Button("Sobre", buttonX, 410, 240, 52, () => this.setupAbout()),
    ];
  }

  setupInstructions() {
    this.state = "instructions";
    this.buttons = [new Button("Voltar", width / 2 - 110, 540, 220, 50, () => this.setupMenu())];
  }

  setupAbout() {
    this.state = "about";
    this.buttons = [new Button("Voltar", width / 2 - 110, 540, 220, 50, () => this.setupMenu())];
  }

  setupGameOver() {
    this.isPaused = false;
    stopGameMusic();
    this.state = "gameOver";
    this.buttons = [
      new Button("Tentar novamente", width / 2 - 140, 430, 280, 52, () => this.startGame()),
      new Button("Voltar ao menu", width / 2 - 140, 500, 280, 52, () => this.setupMenu()),
    ];
  }

  setupVictory() {
    this.isPaused = false;
    stopGameMusic();
    this.state = "victory";
    this.buttons = [new Button("Voltar ao menu", width / 2 - 130, 500, 260, 52, () => this.setupMenu())];
  }

  goToMenu() {
    if (this.state !== "playing" && this.state !== "levelComplete") {
      this.setupMenu();
    }
  }

  startGame() {
    this.score = 0;
    this.lives = STARTING_LIVES;
    this.currentLevelIndex = 0;
    this.particles = [];
    this.isPaused = false;
    stopGameMusic();
    this.loadLevel(0);
  }

  loadLevel(index) {
    this.state = "playing";
    this.isPaused = false;
    this.pauseStartedAt = 0;
    this.buttons = [];
    this.currentLevelIndex = index;
    this.currentLevel = levels[index];
    this.enemies = [];
    this.traps = [];
    this.particles = [];
    this.keyItem = null;
    this.door = null;
    this.levelDamaged = false;

    const maxCols = Math.max(...this.currentLevel.map.map((row) => row.length));
    this.map = this.currentLevel.map.map((row) => row.padEnd(maxCols, "#").split(""));
    this.rows = this.map.length;
    this.cols = maxCols;
    this.tileSize = Math.floor(
      Math.min(40, (width - 80) / this.cols, (height - HUD_HEIGHT - 54) / this.rows),
    );
    this.offsetX = Math.floor((width - this.cols * this.tileSize) / 2);
    this.offsetY = HUD_HEIGHT + Math.floor((height - HUD_HEIGHT - this.rows * this.tileSize) / 2);

    let playerStart = this.tileCenter(1, 1);

    for (let row = 0; row < this.rows; row += 1) {
      for (let col = 0; col < this.cols; col += 1) {
        const tile = this.map[row][col];
        const position = this.tileCenter(col, row);

        if (tile === "P") {
          playerStart = position.copy();
          this.map[row][col] = ".";
        } else if (tile === "K") {
          this.keyItem = new Item(position, this.tileSize);
          this.map[row][col] = ".";
        } else if (tile === "D") {
          this.door = new Door(position, this.tileSize);
          this.map[row][col] = ".";
        } else if (tile === "E") {
          const axis = this.enemies.length % 2 === 0 ? "horizontal" : "vertical";
          this.enemies.push(new Enemy(position, this.tileSize, this.currentLevel.enemySpeed, axis));
          this.map[row][col] = ".";
        } else if (tile === "T") {
          this.traps.push(new Trap(position, this.tileSize));
          this.map[row][col] = ".";
        } else if (tile !== "#") {
          this.map[row][col] = ".";
        }
      }
    }

    this.player = new Player(playerStart, this.tileSize);
    this.levelStartTime = millis();
    this.showMessage(`Fase ${index + 1}: ${this.currentLevel.name}`, 2300);
    startGameMusic();
  }

  update() {
    if (this.state === "playing") {
      if (this.isPaused) {
        pauseGameMusic();
      } else {
        startGameMusic();
        this.updatePlaying();
        this.updateParticles();
      }
      return;
    }

    if (this.state === "levelComplete" && millis() - this.levelCompleteStarted > 1650) {
      if (this.completedLevelIndex >= levels.length - 1) {
        this.setupVictory();
      } else {
        this.loadLevel(this.completedLevelIndex + 1);
      }
    }

    this.updateParticles();
  }

  updatePlaying() {
    this.player.update(this);

    for (const enemy of this.enemies) {
      enemy.update(this);
    }

    this.checkItemCollision();
    this.checkDoorCollision();
    this.checkDamageCollision();
  }

  checkItemCollision() {
    if (this.keyItem && !this.keyItem.collected && this.keyItem.collidesWith(this.player)) {
      this.keyItem.collected = true;
      this.player.hasKey = true;
      this.score += 100;
      this.showMessage("Chave coletada! A porta está liberada.", 1800);
      this.createParticles(this.keyItem.pos, "#f8d35d", 24);
      playSound("collect");
    }
  }

  checkDoorCollision() {
    if (!this.door || !this.door.collidesWith(this.player)) {
      return;
    }

    if (!this.player.hasKey) {
      this.showMessage("Pegue a chave antes de abrir a porta.", 900);
      return;
    }

    this.completeLevel();
  }

  checkDamageCollision() {
    for (const enemy of this.enemies) {
      if (enemy.collidesWith(this.player)) {
        this.damagePlayer();
        return;
      }
    }

    for (const trap of this.traps) {
      if (trap.collidesWith(this.player)) {
        this.damagePlayer();
        return;
      }
    }
  }

  damagePlayer() {
    if (this.player.isInvincible()) {
      return;
    }

    this.lives -= 1;
    this.score = Math.max(0, this.score - 50);
    this.levelDamaged = true;
    this.player.makeInvincible();
    this.createParticles(this.player.pos, "#f46969", 18);
    playSound("damage");

    if (this.lives <= 0) {
      playSound("gameover");
      this.setupGameOver();
      return;
    }

    this.showMessage("Dano! Você ficou invencível por 1 segundo.", 1400);
  }

  completeLevel() {
    this.completedLevelIndex = this.currentLevelIndex;
    this.lastTimeBonus = this.calculateTimeBonus();
    this.score += 300 + this.lastTimeBonus;
    this.state = "levelComplete";
    this.isPaused = false;
    pauseGameMusic();
    this.buttons = [];
    this.levelCompleteStarted = millis();
    this.createParticles(this.door.pos, "#f8d35d", 42);
    playSound("win");
  }

  calculateTimeLeft() {
    const elapsed = (millis() - this.levelStartTime) / 1000;
    return Math.max(0, Math.ceil(this.currentLevel.timeLimit - elapsed));
  }

  calculateTimeBonus() {
    const baseBonus = this.calculateTimeLeft() * 5;
    return this.levelDamaged ? Math.floor(baseBonus / 2) : baseBonus;
  }

  showMessage(text, duration) {
    this.message = text;
    this.messageUntil = millis() + duration;
  }

  togglePause() {
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      this.pauseStartedAt = millis();
      pauseGameMusic();
      return;
    }

    if (this.pauseStartedAt > 0) {
      this.levelStartTime += millis() - this.pauseStartedAt;
      this.pauseStartedAt = 0;
    }
    startGameMusic();
  }

  updateParticles() {
    for (const particle of this.particles) {
      particle.update();
    }

    this.particles = this.particles.filter((particle) => !particle.isDead());
  }

  createParticles(pos, colorValue, total) {
    for (let i = 0; i < total; i += 1) {
      this.particles.push(new Particle(pos.copy(), colorValue));
    }
  }

  tileCenter(col, row) {
    return createVector(
      this.offsetX + col * this.tileSize + this.tileSize / 2,
      this.offsetY + row * this.tileSize + this.tileSize / 2,
    );
  }

  isWallAt(col, row) {
    if (row < 0 || col < 0 || row >= this.rows || col >= this.cols) {
      return true;
    }

    return this.map[row][col] === "#";
  }

  collidesWithWalls(center, size) {
    const half = size / 2 - 2;
    const corners = [
      createVector(center.x - half, center.y - half),
      createVector(center.x + half, center.y - half),
      createVector(center.x - half, center.y + half),
      createVector(center.x + half, center.y + half),
    ];

    return corners.some((corner) => {
      const col = Math.floor((corner.x - this.offsetX) / this.tileSize);
      const row = Math.floor((corner.y - this.offsetY) / this.tileSize);
      return this.isWallAt(col, row);
    });
  }

  collidesWithSolid(center, size) {
    if (this.collidesWithWalls(center, size)) {
      return true;
    }

    return (
      this.door &&
      this.player &&
      !this.player.hasKey &&
      collidesAabb(center, size, this.door.pos, this.tileSize * 0.76)
    );
  }

  handleMousePressed() {
    for (const button of this.buttons) {
      if (button.isHovering()) {
        button.onClick();
        return;
      }
    }
  }

  draw() {
    background("#151512");

    if (this.state === "menu") {
      this.drawMenu();
    } else if (this.state === "instructions") {
      this.drawInstructions();
    } else if (this.state === "about") {
      this.drawAbout();
    } else if (this.state === "playing") {
      this.drawGameScene();
    } else if (this.state === "levelComplete") {
      this.drawGameScene();
      this.drawLevelComplete();
    } else if (this.state === "gameOver") {
      this.drawGameOver();
    } else if (this.state === "victory") {
      this.drawVictory();
    }

    for (const button of this.buttons) {
      button.draw();
    }
  }

  drawMenu() {
    this.drawDungeonBackground();
    drawCenteredTitle("Dungeon Escape", "Pegue a chave, sobreviva e escape da masmorra.");

    push();
    textAlign(CENTER, CENTER);
    fill("#dacda9");
    textSize(15);
    text("Pressione Enter para jogar ou use os botões.", width / 2, 500);
    pop();
  }

  drawInstructions() {
    this.drawDungeonBackground();
    drawCenteredTitle("Como jogar", "Complete todas as fases para vencer.");
    drawPanel(178, 218, 604, 278);

    const lines = [
      "Mover: WASD ou setas.",
      "Objetivo: pegar a chave amarela em cada fase.",
      "Porta: abre apenas depois que a chave foi coletada.",
      "Perigo: inimigos e armadilhas tiram 1 vida.",
      "Progressão: escape pela porta para ir para a próxima fase.",
      "Score: chave, conclusão da fase e bônus de tempo somam pontos.",
    ];

    push();
    fill("#f5eddb");
    noStroke();
    textAlign(LEFT, TOP);
    textSize(20);
    for (let i = 0; i < lines.length; i += 1) {
      text(lines[i], 220, 252 + i * 36);
    }
    pop();
  }

  drawAbout() {
    this.drawDungeonBackground();
    drawCenteredTitle("Sobre", "Projeto Final - HTML5 Canvas & Games");
    drawPanel(208, 240, 544, 235);

    push();
    noStroke();
    textAlign(CENTER, CENTER);
    fill("#f9d66b");
    textSize(26);
    textStyle(BOLD);
    text("Dungeon Escape", width / 2, 280);
    textStyle(NORMAL);
    fill("#f5eddb");
    textSize(21);
    text("João Vitor Lima Cecilio", width / 2, 340);
    text("Bárbara Franco", width / 2, 380);
    fill("#dacda9");
    textSize(17);
    text("Desenvolvido com JavaScript, p5.js, classes e vetores.", width / 2, 430);
    pop();
  }

  drawGameScene() {
    this.drawWorld();

    if (this.keyItem) {
      this.keyItem.draw();
    }

    if (this.door) {
      this.door.draw(this.player.hasKey);
    }

    for (const trap of this.traps) {
      trap.draw();
    }

    for (const enemy of this.enemies) {
      enemy.draw();
    }

    for (const particle of this.particles) {
      particle.draw();
    }

    this.player.draw();
    this.drawHud();
    this.drawMessage();

    if (this.isPaused) {
      drawPauseOverlay();
    }
  }

  drawWorld() {
    this.drawDungeonBackground();

    push();
    noStroke();
    fill("#0f0f0d");
    rect(this.offsetX - 12, this.offsetY - 12, this.cols * this.tileSize + 24, this.rows * this.tileSize + 24, 8);

    for (let row = 0; row < this.rows; row += 1) {
      for (let col = 0; col < this.cols; col += 1) {
        const x = this.offsetX + col * this.tileSize;
        const y = this.offsetY + row * this.tileSize;
        const cx = x + this.tileSize / 2;
        const cy = y + this.tileSize / 2;

        if (this.map[row][col] === "#") {
          this.drawTileImage("wall", cx, cy);
          stroke("#3a3a32");
          strokeWeight(1);
          noFill();
          rect(x, y, this.tileSize, this.tileSize);
        } else {
          noStroke();
          fill((row + col) % 2 === 0 ? "#27251c" : "#232116");
          rect(x, y, this.tileSize, this.tileSize);
          this.drawTileImage("floor", cx, cy);
          fill("rgba(245, 237, 219, 0.04)");
          rect(x + 5, y + 5, this.tileSize - 10, this.tileSize - 10, 4);
        }
      }
    }
    pop();
  }

  drawTileImage(name, cx, cy) {
    const img = assets.images[name];

    if (img) {
      image(img, cx, cy, this.tileSize, this.tileSize);
    }
  }

  drawDungeonBackground() {
    push();
    noStroke();
    for (let y = 0; y < height; y += 38) {
      for (let x = 0; x < width; x += 38) {
        fill((x / 38 + y / 38) % 2 === 0 ? "#1b1b16" : "#181813");
        rect(x, y, 38, 38);
      }
    }

    fill("rgba(67, 116, 82, 0.17)");
    ellipse(130, 80, 260, 140);
    fill("rgba(248, 211, 93, 0.08)");
    ellipse(width - 140, 100, 240, 120);
    pop();
  }

  drawHud() {
    push();
    noStroke();
    fill("rgba(20, 20, 16, 0.9)");
    rect(0, 0, width, HUD_HEIGHT);
    stroke("#d7b56d");
    strokeWeight(2);
    line(0, HUD_HEIGHT - 1, width, HUD_HEIGHT - 1);

    noStroke();
    fill("#f9d66b");
    textSize(20);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text(`Fase ${this.currentLevelIndex + 1}/${levels.length}`, 28, 28);

    textStyle(NORMAL);
    fill("#f5eddb");
    textSize(17);
    text(`Vidas: ${this.lives}`, 170, 28);
    text(`Score: ${this.score}`, 285, 28);
    text(`Tempo: ${this.calculateTimeLeft()}s`, 430, 28);
    text(`Chave: ${this.player.hasKey ? "coletada" : "pendente"}`, 570, 28);

    fill("#dacda9");
    textSize(14);
    text(`${this.currentLevel.name}`, 28, 62);
    text("WASD / setas para mover  |  Espaço: pausar", width - 330, 62);
    pop();
  }

  drawMessage() {
    if (!this.message || millis() > this.messageUntil) {
      return;
    }

    push();
    textAlign(CENTER, CENTER);
    textSize(18);
    fill("rgba(20, 20, 16, 0.86)");
    stroke("#d7b56d");
    strokeWeight(2);
    rect(width / 2 - 255, HUD_HEIGHT + 12, 510, 42, 8);
    noStroke();
    fill("#f5eddb");
    text(this.message, width / 2, HUD_HEIGHT + 34);
    pop();
  }

  drawLevelComplete() {
    push();
    fill("rgba(0, 0, 0, 0.58)");
    noStroke();
    rect(0, 0, width, height);
    drawPanel(230, 222, 500, 200, "#242018", "#f8d35d");
    textAlign(CENTER, CENTER);
    noStroke();
    fill("#f9d66b");
    textSize(34);
    textStyle(BOLD);
    text("Fase concluída!", width / 2, 272);
    fill("#f5eddb");
    textStyle(NORMAL);
    textSize(19);
    text(`+300 pontos  |  Bônus de tempo: +${this.lastTimeBonus}`, width / 2, 328);
    text("Carregando próxima etapa...", width / 2, 372);
    pop();
  }

  drawGameOver() {
    this.drawDungeonBackground();
    drawCenteredTitle("Game Over", "A masmorra venceu desta vez.");
    drawPanel(250, 250, 460, 142, "#2a1716", "#d66a5d");

    push();
    textAlign(CENTER, CENTER);
    noStroke();
    fill("#f5eddb");
    textSize(24);
    text("Pontuação final", width / 2, 300);
    fill("#f9d66b");
    textSize(40);
    textStyle(BOLD);
    text(this.score, width / 2, 350);
    pop();
  }

  drawVictory() {
    this.drawDungeonBackground();
    drawCenteredTitle("Vitória!", "Parabéns, vocês escaparam da dungeon.");
    drawPanel(230, 250, 500, 190, "#1f2619", "#7bc37b");

    push();
    textAlign(CENTER, CENTER);
    noStroke();
    fill("#f5eddb");
    textSize(23);
    text("Todas as fases foram completadas.", width / 2, 296);
    fill("#f9d66b");
    textSize(42);
    textStyle(BOLD);
    text(`Score final: ${this.score}`, width / 2, 362);
    pop();
  }
}

class Player {
  constructor(pos, tileSize) {
    this.pos = pos.copy();
    this.velocity = createVector(0, 0);
    this.size = tileSize * 0.7;
    this.speed = 3.35;
    this.hasKey = false;
    this.invincibleUntil = 0;
  }

  update(game) {
    const input = createVector(0, 0);

    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      input.x -= 1;
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      input.x += 1;
    }
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      input.y -= 1;
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
      input.y += 1;
    }

    if (input.magSq() > 0) {
      input.normalize().mult(this.speed);
    }

    this.velocity.set(input);
    this.tryMove(createVector(this.velocity.x, 0), game);
    this.tryMove(createVector(0, this.velocity.y), game);
  }

  tryMove(delta, game) {
    const nextPos = p5.Vector.add(this.pos, delta);

    if (!game.collidesWithSolid(nextPos, this.size)) {
      this.pos.set(nextPos);
    }
  }

  makeInvincible() {
    this.invincibleUntil = millis() + INVINCIBLE_TIME;
  }

  isInvincible() {
    return millis() < this.invincibleUntil;
  }

  draw() {
    if (this.isInvincible() && frameCount % 12 < 6) {
      return;
    }

    push();
    translate(this.pos.x, this.pos.y);
    const img = assets.images.player;

    if (img) {
      image(img, 0, 0, this.size * 1.42, this.size * 1.42);
    } else {
      noStroke();
      fill("#6bd17d");
      ellipse(0, 0, this.size, this.size);
      fill("#f5eddb");
      ellipse(-5, -5, 5, 5);
      ellipse(7, -5, 5, 5);
    }

    if (this.hasKey) {
      noFill();
      stroke("#f8d35d");
      strokeWeight(3);
      ellipse(0, 0, this.size + 12 + sin(frameCount * 0.1) * 4);
    }
    pop();
  }
}

class Enemy {
  constructor(pos, tileSize, speed, axis) {
    this.pos = pos.copy();
    this.size = tileSize * 0.72;
    this.velocity = axis === "horizontal" ? createVector(speed, 0) : createVector(0, speed);
  }

  update(game) {
    const nextPos = p5.Vector.add(this.pos, this.velocity);

    if (game.collidesWithWalls(nextPos, this.size)) {
      this.velocity.mult(-1);
    } else {
      this.pos.set(nextPos);
    }
  }

  collidesWith(player) {
    return collidesAabb(this.pos, this.size, player.pos, player.size);
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    const pulse = sin(frameCount * 0.12) * 3;
    const img = assets.images.enemy;

    if (img) {
      image(img, 0, 0, this.size * 1.42 + pulse, this.size * 1.42 + pulse);
    } else {
      noStroke();
      fill("#b94b6a");
      ellipse(0, 0, this.size + pulse, this.size + pulse);
      fill("#2a1017");
      ellipse(-6, -4, 6, 6);
      ellipse(6, -4, 6, 6);
    }
    pop();
  }
}

class Item {
  constructor(pos, tileSize) {
    this.pos = pos.copy();
    this.size = tileSize * 0.62;
    this.collected = false;
  }

  collidesWith(player) {
    return collidesAabb(this.pos, this.size, player.pos, player.size);
  }

  draw() {
    if (this.collected) {
      return;
    }

    push();
    translate(this.pos.x, this.pos.y);
    const glow = 12 + sin(frameCount * 0.14) * 5;
    noStroke();
    fill("rgba(248, 211, 93, 0.22)");
    ellipse(0, 0, this.size + glow, this.size + glow);

    const img = assets.images.key;
    if (img) {
      rotate(sin(frameCount * 0.08) * 0.08);
      image(img, 0, 0, this.size * 1.55, this.size * 1.55);
    } else {
      stroke("#f8d35d");
      strokeWeight(5);
      line(-12, 0, 12, 0);
      noFill();
      ellipse(-16, 0, 14, 14);
      line(7, 0, 7, 9);
      line(14, 0, 14, 7);
    }
    pop();
  }
}

class Door {
  constructor(pos, tileSize) {
    this.pos = pos.copy();
    this.size = tileSize * 0.88;
  }

  collidesWith(player) {
    return collidesAabb(this.pos, this.size * 0.82, player.pos, player.size);
  }

  draw(isOpen) {
    push();
    translate(this.pos.x, this.pos.y);

    if (isOpen) {
      drawingContext.shadowColor = "rgba(248, 211, 93, 0.74)";
      drawingContext.shadowBlur = 24;
    }

    const img = assets.images.door;
    if (img) {
      if (isOpen) {
        tint(255, 240, 156);
      }
      image(img, 0, 0, this.size * 1.2, this.size * 1.2);
      noTint();
    } else {
      stroke(isOpen ? "#f8d35d" : "#6f4c2f");
      strokeWeight(3);
      fill(isOpen ? "#8d6b3d" : "#4f3324");
      rect(-this.size / 2, -this.size / 2, this.size, this.size, 8, 8, 0, 0);
      fill("#f8d35d");
      ellipse(this.size * 0.22, 0, 6, 6);
    }
    pop();
  }
}

class Trap {
  constructor(pos, tileSize) {
    this.pos = pos.copy();
    this.size = tileSize * 0.72;
  }

  collidesWith(player) {
    return collidesAabb(this.pos, this.size * 0.86, player.pos, player.size);
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    const img = assets.images.trap;

    if (img) {
      image(img, 0, 0, this.size * 1.42, this.size * 1.42);
    } else {
      fill("#5f6368");
      stroke("#1b1b16");
      strokeWeight(2);
      rect(-this.size / 2, -this.size / 2, this.size, this.size, 4);
      fill(frameCount % 34 < 17 ? "#cc4949" : "#8b3333");
      noStroke();
      for (let i = -1; i <= 1; i += 1) {
        triangle(i * 9 - 5, 7, i * 9 + 5, 7, i * 9, -11);
      }
    }
    pop();
  }
}

class Button {
  constructor(label, x, y, w, h, onClick) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.onClick = onClick;
  }

  isHovering() {
    return mouseX >= this.x && mouseX <= this.x + this.w && mouseY >= this.y && mouseY <= this.y + this.h;
  }

  draw() {
    const hovering = this.isHovering();

    push();
    drawingContext.shadowColor = hovering ? "rgba(248, 211, 93, 0.36)" : "rgba(0, 0, 0, 0.28)";
    drawingContext.shadowBlur = hovering ? 22 : 12;
    stroke(hovering ? "#f8d35d" : "#d7b56d");
    strokeWeight(2);
    fill(hovering ? "#394224" : "#242018");
    rect(this.x, this.y, this.w, this.h, 8);
    noStroke();
    fill("#f5eddb");
    textAlign(CENTER, CENTER);
    textSize(20);
    textStyle(BOLD);
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);
    pop();
  }
}

class Particle {
  constructor(pos, colorValue) {
    this.pos = pos.copy();
    this.velocity = p5.Vector.random2D().mult(random(1, 4));
    this.life = random(28, 46);
    this.maxLife = this.life;
    this.colorValue = colorValue;
    this.size = random(4, 8);
  }

  update() {
    this.pos.add(this.velocity);
    this.velocity.mult(0.94);
    this.life -= 1;
  }

  isDead() {
    return this.life <= 0;
  }

  draw() {
    push();
    noStroke();
    const alpha = map(this.life, 0, this.maxLife, 0, 220);
    const particleColor = color(this.colorValue);
    particleColor.setAlpha(alpha);
    fill(particleColor);
    ellipse(this.pos.x, this.pos.y, this.size);
    pop();
  }
}
