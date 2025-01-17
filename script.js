const player = document.getElementById('player');
const maze = document.getElementById('maze');
const end = document.getElementById('end');
const timerElement = document.getElementById('timer');
const movesElement = document.getElementById('moves');
const levelElement = document.getElementById('level');
const resetBtn = document.getElementById('resetBtn');
const newGameBtn = document.getElementById('newGameBtn');

// Player position and move distance
let playerX = 10;
let playerY = 10;
const moveDistance = 20;

// Game state
let timer = 0;
let moves = 0;
let level = 1;
let timerInterval = null;

// Predefined grid-based maze layouts for each level
const levels = [
    // Level 1: Simple grid maze
    [
        { top: 0, left: 40, width: 20, height: 200 },
        { top: 0, left: 120, width: 20, height: 400 },
        { top: 80, left: 40, width: 200, height: 20 },
        { top: 160, left: 200, width: 200, height: 20 },
        { top: 240, left: 40, width: 20, height: 120 },
        { top: 320, left: 120, width: 20, height: 200 },
        { top: 400, left: 40, width: 200, height: 20 },
    ],
    // Level 2: More complex maze
    [
        { top: 0, left: 60, width: 20, height: 300 },
        { top: 0, left: 200, width: 20, height: 400 },
        { top: 80, left: 80, width: 200, height: 20 },
        { top: 160, left: 40, width: 300, height: 20 },
        { top: 240, left: 60, width: 20, height: 120 },
        { top: 320, left: 120, width: 300, height: 20 },
        { top: 400, left: 60, width: 200, height: 20 },
        { top: 240, left: 240, width: 20, height: 120 },
    ],
    // Level 3: Advanced maze
    [
        { top: 0, left: 40, width: 20, height: 400 },
        { top: 0, left: 200, width: 20, height: 200 },
        { top: 80, left: 80, width: 200, height: 20 },
        { top: 160, left: 40, width: 300, height: 20 },
        { top: 240, left: 40, width: 20, height: 120 },
        { top: 320, left: 120, width: 20, height: 120 },
        { top: 400, left: 40, width: 300, height: 20 },
        { top: 240, left: 240, width: 20, height: 120 },
    ],
];

// Generate walls for the current level
function generateWalls(level) {
    maze.querySelectorAll('.wall').forEach((wall) => wall.remove());
    levels[level - 1].forEach((wallConfig) => {
        const wall = document.createElement('div');
        wall.className = 'wall bg-gray-700 absolute';
        Object.assign(wall.style, {
            top: `${wallConfig.top}px`,
            left: `${wallConfig.left}px`,
            width: `${wallConfig.width}px`,
            height: `${wallConfig.height}px`,
        });
        maze.appendChild(wall);
    });

    // Position the end point dynamically
    end.style.top = `${maze.offsetHeight - 40}px`;
    end.style.left = `${maze.offsetWidth - 40}px`;
    end.style.width = '20px';
    end.style.height = '20px';
}

// Start timer
function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        timerElement.textContent = timer;
    }, 1000);
}

// Stop timer
function stopTimer() {
    clearInterval(timerInterval);
}

// Reset game
function resetGame() {
    playerX = 10;
    playerY = 10;
    moves = 0;
    timer = 0;
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
    timerElement.textContent = timer;
    movesElement.textContent = moves;
    stopTimer();
    startTimer();
}

// New game
function newGame() {
    level = (level % levels.length) + 1;
    levelElement.textContent = level;
    generateWalls(level);
    resetGame();
}

// Collision detection
function checkCollision(newX, newY) {
    const playerRect = {
        left: newX,
        top: newY,
        right: newX + player.offsetWidth,
        bottom: newY + player.offsetHeight,
    };

    const walls = maze.querySelectorAll('.wall');
    for (const wall of walls) {
        const wallRect = wall.getBoundingClientRect();
        const mazeRect = maze.getBoundingClientRect();
        const wallAdjusted = {
            left: wallRect.left - mazeRect.left,
            top: wallRect.top - mazeRect.top,
            right: wallRect.left - mazeRect.left + wall.offsetWidth,
            bottom: wallRect.top - mazeRect.top + wall.offsetHeight,
        };

        if (
            playerRect.right > wallAdjusted.left &&
            playerRect.left < wallAdjusted.right &&
            playerRect.bottom > wallAdjusted.top &&
            playerRect.top < wallAdjusted.bottom
        ) {
            return true;
        }
    }
    return false;
}

// Handle player movement
document.addEventListener('keydown', (e) => {
    let newX = playerX;
    let newY = playerY;

    switch (e.key) {
        case 'ArrowUp':
            newY -= moveDistance;
            break;
        case 'ArrowDown':
            newY += moveDistance;
            break;
        case 'ArrowLeft':
            newX -= moveDistance;
            break;
        case 'ArrowRight':
            newX += moveDistance;
            break;
    }

    if (
        newX >= 0 &&
        newX <= maze.offsetWidth - player.offsetWidth &&
        newY >= 0 &&
        newY <= maze.offsetHeight - player.offsetHeight &&
        !checkCollision(newX, newY)
    ) {
        playerX = newX;
        playerY = newY;
        player.style.left = `${playerX}px`;
        player.style.top = `${playerY}px`;
        moves++;
        movesElement.textContent = moves;
    }

    // Check win condition
    const endRect = end.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
        playerRect.left >= endRect.left &&
        playerRect.top >= endRect.top &&
        playerRect.right <= endRect.right &&
        playerRect.bottom <= endRect.bottom
    ) {
        stopTimer();
        setTimeout(() => {
            alert(`🎉 You Win! Time: ${timer}s, Moves: ${moves}`);
            newGame();
        }, 100);
    }
});

// Event listeners
resetBtn.addEventListener('click', resetGame);
newGameBtn.addEventListener('click', newGame);

// Initialize game
generateWalls(level);
resetGame();
