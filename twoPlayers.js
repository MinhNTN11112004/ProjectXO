const board = document.getElementById('board');
const statusDisplay = document.getElementById('status');
const resetButton = document.getElementById('reset');

let currentPlayer = 'X';
let gameActive = true;
const gameState = {}; 
const cellSize = 40; 
const visibleRows = 15;
const visibleCols = 15; 
let startRow = 0; 
let startCol = 0; 
let isExpanding = false;
const expandThreshold = 500;
let lastExpandTime = 0;
function createCell(row, col) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.addEventListener('click', () => handleCellClick(row, col));
    return cell;
}

function handleCellClick(row, col) {
    if (gameState[`${row},${col}`] !== undefined || !gameActive) {
        return;
    }
    gameState[`${row},${col}`] = currentPlayer;
    updateBoard();
    checkResult(row, col);
}

function updateBoard() {
    board.innerHTML = '';
    for (let r = startRow; r < startRow + visibleRows; r++) {
        for (let c = startCol; c < startCol + visibleCols; c++) {
            board.appendChild(createCell(r, c));
        }
    }
    for (let key in gameState) {
        const [r, c] = key.split(',').map(Number);
        const cell = document.getElementsByClassName('cell')[r * visibleCols + (c - startCol)];
        if (cell) {
            cell.textContent = gameState[key];
            if (gameState[key] === 'X') {
                cell.classList.add('x');
            } else if (gameState[key] === 'O') {
                cell.classList.add('o');
            }
        }
    }
}

function checkResult(row, col) {
    const winningConditions = [
        { dx: 1, dy: 0 }, // Ngang
        { dx: 0, dy: 1 }, // Dọc
        { dx: 1, dy: 1 }, // Chéo phải
        { dx: 1, dy: -1 } // Chéo trái
    ];

    for (const { dx, dy } of winningConditions) {
        let count = 1;

        count += countInDirection(row, col, dx, dy);
        count += countInDirection(row, col, -dx, -dy);

        if (count >= 5) {
            gameActive = false;
            statusDisplay.textContent = `Người Chơi ${currentPlayer} đã thắng!`;
            return;
        }
    }
    if (Object.keys(gameState).length === visibleRows * visibleCols) {
        gameActive = false;
        statusDisplay.textContent = "Trò chơi hòa!";
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `Lượt của ${currentPlayer}`;
}

function countInDirection(row, col, dx, dy) {
    let count = 0;
    let newRow = row + dy;
    let newCol = col + dx;

    while (gameState[`${newRow},${newCol}`] === currentPlayer) {
        count++;
        newRow += dy;
        newCol += dx;
    }
    return count;
}

function resetGame() {
    gameActive = true;
    currentPlayer = 'X';
    Object.keys(gameState).forEach(key => delete gameState[key]);
    statusDisplay.textContent = `Lượt của ${currentPlayer}`;
    updateBoard();
}
function createCell(row, col) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.addEventListener('click', () => handleCellClick(row, col));
    return cell;
}

board.addEventListener('mousemove', (event) => {
    const rect = board.getBoundingClientRect();
    const mouseX = event.clientX - rect.left; 
    const mouseY = event.clientY - rect.top; 
    const currentTime = Date.now();
    if (isExpanding && currentTime - lastExpandTime < expandThreshold) {
        return; 
    }
    if (mouseY < 30 && startRow > 0) {
        startRow -= 1; 
        isExpanding = true; 
    }
    if (mouseY > rect.height - 30) {
        startRow += 1; 
        isExpanding = true; 
    }
    if (mouseX < 30 && startCol > 0) {
        startCol -= 1; 
        isExpanding = true; 
    }
    if (mouseX > rect.width - 30) {
        startCol += 1; 
        isExpanding = true; 
    }

    if (isExpanding) {
        lastExpandTime = currentTime; 
        updateBoard(); 
    }
});
board.addEventListener('mouseleave', () => {
    isExpanding = false; 
});

updateBoard();

resetButton.addEventListener('click', resetGame);
statusDisplay.textContent = `Lượt của ${currentPlayer}`;