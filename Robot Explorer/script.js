// @ts-nocheck

const boardSize = 5;
let robot = { x: 0, y: 0, dir: "kanan" };
let startPos = { x: 0, y: 0 };
let goals = [];
let obstacles = [];
let score = 0;
let level = 1;

const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const commandsInput = document.getElementById("commands");

// 🎵 Suara
let soundStar = new Audio("assets/star.mp3");
let soundCrash = new Audio("assets/crash.mp3");

// Acak level baru
function generateLevel() {
  goals = [];
  obstacles = [];

  const numGoals = Math.min(2 + level, 5);
  const numObstacles = Math.min(1 + level, 6);

  // Bintang
  while (goals.length < numGoals) {
    let gx = Math.floor(Math.random() * boardSize);
    let gy = Math.floor(Math.random() * boardSize);
    if ((gx !== startPos.x || gy !== startPos.y) && !goals.some(g => g.x === gx && g.y === gy)) {
      goals.push({ x: gx, y: gy });
    }
  }

  // Rintangan
  while (obstacles.length < numObstacles) {
    let ox = Math.floor(Math.random() * boardSize);
    let oy = Math.floor(Math.random() * boardSize);
    if (
      (ox !== startPos.x || oy !== startPos.y) &&
      !goals.some(g => g.x === ox && g.y === oy) &&
      !obstacles.some(o => o.x === ox && o.y === oy)
    ) {
      obstacles.push({ x: ox, y: oy });
    }
  }

  robot.x = startPos.x;
  robot.y = startPos.y;
  robot.dir = "kanan";

  levelDisplay.textContent = "Level: " + level;
  createBoard();
}

// Buat papan
function createBoard(path = []) {
  board.innerHTML = "";
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      // Jejak
      if (path.some(p => p.x === x && p.y === y)) {
        cell.classList.add("trail");
      }

      // Rintangan
      if (obstacles.some(obs => obs.x === x && obs.y === y)) {
        cell.classList.add("obstacle");
        cell.textContent = "🟥";
      }

      // Bintang
      if (goals.some(goal => goal.x === x && goal.y === y)) {
        cell.classList.add("goal");
        cell.textContent = "⭐";
      }

      // Robot
      if (robot.x === x && robot.y === y) {
        cell.classList.add("robot");
        if (robot.dir === "atas") cell.textContent = "⬆";
        if (robot.dir === "bawah") cell.textContent = "⬇";
        if (robot.dir === "kiri") cell.textContent = "⬅";
        if (robot.dir === "kanan") cell.textContent = "➡";
      }

      board.appendChild(cell);
    }
  }
}

// Reset ke awal
function resetRobot() {
  robot.x = startPos.x;
  robot.y = startPos.y;
  robot.dir = "kanan";
  commandsInput.value = "";
  createBoard();
}

// Jalankan instruksi
function runCommands(commands) {
  let steps = commands.split(",").map(cmd => cmd.trim().toLowerCase()).filter(cmd => cmd);
  let i = 0;
  let path = [];

  function moveStep() {
    if (i >= steps.length) return;

    let command = steps[i];
    let newX = robot.x;
    let newY = robot.y;

    if (command === "atas") {
      newY--;
      robot.dir = "atas";
    }
    if (command === "bawah") {
      newY++;
      robot.dir = "bawah";
    }
    if (command === "kiri") {
      newX--;
      robot.dir = "kiri";
    }
    if (command === "kanan") {
      newX++;
      robot.dir = "kanan";
    }

    path.push({ x: robot.x, y: robot.y });

    // Cek tabrakan tembok
    if (newX < 0 || newY < 0 || newX >= boardSize || newY >= boardSize) {
      soundCrash.play();
      alert("Robot menabrak tembok! Misi gagal 🚧");
      resetRobot();
      return;
    }

    // Cek tabrakan rintangan
    if (obstacles.some(obs => obs.x === newX && obs.y === newY)) {
      soundCrash.play();
      alert("Robot menabrak rintangan! Misi gagal 🚧");
      resetRobot();
      return;
    }

    // Update posisi
    robot.x = newX;
    robot.y = newY;

    // Cek ambil bintang
    for (let j = 0; j < goals.length; j++) {
      if (goals[j].x === robot.x && goals[j].y === robot.y) {
        goals.splice(j, 1);
        score++;
        soundStar.play();
        break;
      }
    }

    createBoard(path);
    scoreDisplay.textContent = "Skor: " + score;

    // Level selesai
    if (goals.length === 0) {
      alert("Selamat! Semua bintang sudah dikumpulkan 🎉 Level naik!");
      level++;
      commandsInput.value = "";
      generateLevel();
      return;
    }

    i++;
    setTimeout(moveStep, 600);
  }

  moveStep();
}

document.getElementById("run").addEventListener("click", () => {
  runCommands(commandsInput.value);
});

generateLevel();
