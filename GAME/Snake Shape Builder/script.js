const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const targetDisplay = document.getElementById('target-shape');

const size = 10;
let snake = [{x: 1, y: 1}];
let direction = {x: 0, y: 0};
let score = 0;

// contoh bentuk target: kotak 2x2
let targetShape = [
  {x: 3, y: 3},
  {x: 3, y: 4},
  {x: 4, y: 3},
  {x: 4, y: 4}
];

// buat papan
function createBoard() {
  board.innerHTML = '';
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      if (snake[0].x === x && snake[0].y === y) cell.classList.add('snake-head');
      else if (snake.some(s => s.x === x && s.y === y)) cell.classList.add('snake-body');
      else if (targetShape.some(t => t.x === x && t.y === y)) cell.classList.add('target-cell');

      board.appendChild(cell);
    }
  }
}

// pindah ular
function moveSnake() {
  const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

  // cek batas papan
  if (head.x < 0 || head.x >= size || head.y < 0 || head.y >= size) return;

  snake.unshift(head);
  snake.pop();
  createBoard();

  // cek apakah membentuk target
  if (targetShape.every(t => snake.some(s => s.x === t.x && s.y === t.y))) {
    score += 10;
    scoreDisplay.textContent = 'Skor: ' + score;
    alert('Hebat! Kamu berhasil membentuk bentuk!');
    // bisa lanjut ke bentuk berikutnya di sini
  }
}

// kontrol arah
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' && direction.y === 0) direction = {x: 0, y: -1};
  if (e.key === 'ArrowDown' && direction.y === 0) direction = {x: 0, y: 1};
  if (e.key === 'ArrowLeft' && direction.x === 0) direction = {x: -1, y: 0};
  if (e.key === 'ArrowRight' && direction.x === 0) direction = {x: 1, y: 0};
});

createBoard();
setInterval(moveSnake, 500);
