const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const startButton = document.getElementById('startButton');

const BLOCK_HEIGHT = 20;
const BLOCK_WIDTH = 150;
const SPEED = 2; // Kecepatan pergerakan balok
const colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6'];

let currentBlock;
let tower = [];
let direction = 1; // 1 = kanan, -1 = kiri
let gameActive = false;
let score = 0;
let highScore = 0;

// Fungsi untuk menggambar balok
function drawBlock(block, color) {
    ctx.fillStyle = color;
    ctx.fillRect(block.x, block.y, block.width, block.height);
}

// Fungsi untuk membuat balok baru
function createBlock() {
    let newWidth = BLOCK_WIDTH;
    if (tower.length > 0) {
        newWidth = tower[tower.length - 1].width;
    }
    currentBlock = {
        x: 0,
        y: canvas.height - BLOCK_HEIGHT,
        width: newWidth,
        height: BLOCK_HEIGHT,
        color: colors[tower.length % colors.length]
    };
    if (tower.length > 0) {
        currentBlock.y = tower[tower.length - 1].y - BLOCK_HEIGHT;
    }
}

// Fungsi untuk memeriksa tumpang tindih
function checkOverlap() {
    if (tower.length === 0) {
        return currentBlock.width;
    }
    const lastBlock = tower[tower.length - 1];
    const overlapStart = Math.max(currentBlock.x, lastBlock.x);
    const overlapEnd = Math.min(currentBlock.x + currentBlock.width, lastBlock.x + lastBlock.width);
    const overlapWidth = overlapEnd - overlapStart;

    if (overlapWidth <= 0) {
        return 0; // Game Over
    }
    return overlapWidth;
}

// Fungsi untuk memperbarui game
function update() {
    if (!gameActive) return;

    // Pergerakan balok saat ini
    currentBlock.x += SPEED * direction;
    if (currentBlock.x + currentBlock.width >= canvas.width || currentBlock.x <= 0) {
        direction *= -1; // Balik arah
    }
}

// Fungsi untuk menggambar semua elemen
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gambar menara
    tower.forEach(block => drawBlock(block, block.color));

    // Gambar balok yang sedang bergerak
    if (currentBlock) {
        drawBlock(currentBlock, currentBlock.color);
    }
}

// Loop game utama
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Fungsi untuk menjatuhkan balok
function dropBlock() {
    if (!gameActive) return;

    const overlapWidth = checkOverlap();
    if (overlapWidth <= 0) {
        gameOver();
        return;
    }

    // Sesuaikan lebar dan posisi balok
    const lastBlock = tower.length > 0 ? tower[tower.length - 1] : null;
    currentBlock.width = overlapWidth;
    if (lastBlock) {
        currentBlock.x = Math.max(currentBlock.x, lastBlock.x);
    }

    tower.push(currentBlock);
    score++;
    scoreDisplay.textContent = score;

    createBlock();
}

// Fungsi game over
function gameOver() {
    gameActive = false;
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
    }
    alert(`Game Over! Skor Anda: ${score}`);
    startButton.style.display = 'block';
}

// Fungsi untuk memulai game
function startGame() {
    gameActive = true;
    score = 0;
    scoreDisplay.textContent = score;
    tower = [];
    startButton.style.display = 'none';
    createBlock();
    gameLoop();
}

// Event Listeners
startButton.addEventListener('click', startGame);
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameActive) {
        dropBlock();
    }
});
canvas.addEventListener('click', dropBlock);

// Inisialisasi awal
createBlock();
draw();
startButton.style.display = 'block';