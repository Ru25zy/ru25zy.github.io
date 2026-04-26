/**
 * 创建网格函数
 * @param {number} rows - 行数
 * @param {number} cols - 列数
 * @param {string} containerId - 容器ID（默认 grid-container）
 */
function createGrid(rows, cols, containerId = 'grid-container') {
    // 获取容器元素
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`容器#${containerId}未找到`);
        return;
    }

    // 清空现有内容
    container.innerHTML = '';

    // 创建文档碎片优化性能
    const fragment = document.createDocumentFragment();

    // 创建网格缓存数组
    const currentGrid = [];

     // 生成网格
    for (let row = 0; row < rows; row++) {
        // 创建行容器
        const rowDiv = document.createElement('div');
        rowDiv.className = 'grid-row';
        rowDiv.dataset.row = row.toString();
        
        // 当前行的缓存数组
        const rowCache = [];

        // 生成列
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.row = row.toString();
            cell.dataset.col = col.toString();
            
            // 缓存单元格
            rowCache.push(cell);
            rowDiv.appendChild(cell);
        }

        // 保存当前行缓存
        currentGrid.push(rowCache);
        fragment.appendChild(rowDiv);
    }

    // 根据容器ID保存缓存
    if (containerId === 'grid-container') {
        gridCells = currentGrid;
    } else if (containerId === 'next') {
        nextGridCells = currentGrid;
    }

    // 一次性插入DOM
    container.appendChild(fragment);

    console.log(`成功创建${rows}行${cols}列网格`);
}

// 游戏常量
const ROWS = 26; // 游戏区域行数
const COLS = 12; // 游戏区域列数
const EMPTY = 'empty'; // 空单元格标识
// 方块颜色数组，索引对应方块类型
const COLORS = [
    null,
    '#FF0D72', // I型方块颜色
    '#0DC2FF', // J型方块颜色
    '#0DFF72', // L型方块颜色
    '#F538FF', // O型方块颜色
    '#FF8E0D', // S型方块颜色
    '#FFE138', // T型方块颜色
    '#3877FF'  // Z型方块颜色
];

// 方块形状定义，索引对应方块类型
const SHAPES = [
    null,
    // I型方块
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    // J型方块
    [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0]
    ],
    // L型方块
    [
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0]
    ],
    // O型方块
    [
        [4, 4],
        [4, 4]
    ],
    // S型方块
    [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0]
    ],
    // T型方块
    [
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0]
    ],
    // Z型方块
    [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0]
    ]
];

// 游戏状态变量
let board = []; // 游戏板状态
let score = 0; // 当前得分
let level = 1; // 当前等级
let lines = 0; // 消除行数
let gameOver = false; // 游戏结束标志
let paused = false; // 暂停状态标志
let dropCounter = 0; // 下落计数器
let dropInterval = 1000; // 下落间隔（毫秒）
let lastTime = 0; // 上次更新时间
let gameStarted = false; // 游戏开始标志
let startTime = null; // 游戏开始时间
let elapsedTime = 0; // 已用时间
let timerInterval = null; // 计时器句柄
// 游戏网格缓存
let gridCells = [];      // 主游戏区域
let nextGridCells = []; // 下一个方块预览区域

// 移动控制相关变量
let moveInterval = null; // 移动重复间隔句柄
let moveIntervalTime = 100; // 移动重复间隔时间（毫秒）
let initialMoveDelay = 200; // 初始移动延迟（毫秒）
let initialMoveTimeout = null; // 初始移动延时句柄

// 当前方块对象
let player = {
    pos: { x: 0, y: 0 }, // 方块位置
    matrix: null, // 当前方块形状
    next: null // 下一个方块形状
};

/**
 * 初始化游戏板
 * 创建一个空的游戏板数组，大小为 ROWS x COLS
 */
function createBoard() {
    board = Array.from({ length: ROWS }, () =>
        Array.from({ length: COLS }, () => EMPTY)
    );
}

/**
 * 创建方块
 * @param {number} type - 方块类型（1-7）
 * @returns {Array} 方块矩阵
 */
function createPiece(type) {
    // 统一使用 SHAPES 数组定义的原始形态
    return SHAPES[type].map(row => [...row]);
}

/**
 * 随机生成方块
 * @returns {Array} 随机方块矩阵
 */
function randomPiece() {
    const pieceIndex = Math.floor(Math.random() * 7) + 1;
    return createPiece(pieceIndex);
}

/**
 * 绘制游戏板
 * 根据游戏板状态更新网格显示
 */
function drawBoard() {
    // 直接使用缓存的网格
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            const cell = gridCells[y][x]; // 替换原有querySelector
            const value = board[y][x];
            cell.style.backgroundColor = value === EMPTY ? '' : COLORS[value];
            cell.style.boxShadow = value === EMPTY ? 'inset 1px 1px 0 1px rgb(214, 214, 214)' : '0 0 1px black';
        }
    }
}

/**
 * 绘制当前方块
 * 增加了碰撞检测和更严格的边界检查，确保旋转后的方块位置合法
 */
function drawPiece() {
    if (!player.matrix) return;

    // 检查当前方块位置是否合法（碰撞检测）
    if (collide(board, player)) {
        console.warn('警告：尝试绘制非法位置的方块（碰撞检测失败）');
        return;
    }

    // 用于跟踪是否所有单元格都在合法范围内
    let allCellsValid = true;

    // 先检查所有单元格是否在合法范围内
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const boardY = player.pos.y + y;
                const boardX = player.pos.x + x;
                
                // 如果任何一个单元格越界，则标记为无效
                if (boardY < 0 || boardY >= ROWS || boardX < 0 || boardX >= COLS) {
                    allCellsValid = false;
                }
            }
        });
    });

    // 如果存在越界单元格，不进行绘制
    if (!allCellsValid) {
        console.warn('警告：尝试绘制越界位置的方块');
        return;
    }

    // 使用缓存的网格
    const grid = gridCells; // 替换原有querySelector
    
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const cellY = player.pos.y + y;
                const cellX = player.pos.x + x;

                // 直接访问缓存
                const cell = grid[cellY][cellX]; // 替换原有querySelector
                
                if (cell) {
                    cell.style.backgroundColor = COLORS[value];
                    cell.style.boxShadow = '0 0 2px black';
                }
            }
        });
    });
}

/**
 * 绘制下一个方块
 * 在预览区域显示下一个即将出现的方块
 */
function drawNextPiece() {
    if (!player.next) return;

    // 清除之前的显示（使用缓存）
    nextGridCells.forEach(row => {
        row.forEach(cell => {
            cell.style.backgroundColor = '';
            cell.style.borderColor = '';
        });
    });

    // 绘制下一个方块
    const previewMatrix = player.next.map(row => [...row]);

    previewMatrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const cell = nextGridCells[y][x]; // 替换原有querySelector
                if (cell) {
                    cell.style.backgroundColor = COLORS[value];
                    cell.style.borderColor = 'black';
                }
            }
        });
    });
}

/**
 * 碰撞检测
 * 检查方块是否与游戏边界或其他方块发生碰撞
 * @param {Array} board - 游戏板状态
 * @param {Object} player - 玩家方块对象
 * @returns {boolean} 是否发生碰撞
 */
function collide(board, player) {
    // 添加检查，防止 matrix 为 null
    if (!player.matrix) return false;

    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; y++) {
        for (let x = 0; x < m[y].length; x++) {
            if (m[y][x] !== 0) {
                // 计算在游戏板上的实际坐标
                const boardY = y + o.y;
                const boardX = x + o.x;

                // 检查是否在游戏区域边界内
                if (boardY < 0 || boardY >= ROWS || boardX < 0 || boardX >= COLS) {
                    return true;
                }

                // 检查是否与已放置的方块重叠（确保数组访问安全）
                if (boardY >= 0 && boardY < ROWS &&
                    boardX >= 0 && boardX < COLS &&
                    board[boardY] && board[boardY][boardX] !== EMPTY) {
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * 合并方块到游戏板
 * 将当前方块固定到游戏板上
 * @param {Array} board - 游戏板状态
 * @param {Object} player - 玩家方块对象
 */
function merge(board, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const boardY = y + player.pos.y;
                const boardX = x + player.pos.x;

                // 添加边界检查，确保不会访问超出范围的数组元素
                if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
                    board[boardY][boardX] = value;
                }
            }
        });
    });
}

/**
 * 旋转方块
 * @param {Array} matrix - 方块矩阵
 * @param {number} dir - 旋转方向（正数为顺时针，负数为逆时针）
 * @returns {Array} 旋转后的矩阵
 */
function rotate(matrix, dir) {
    // 创建矩阵的深拷贝以避免修改原始矩阵
    const copy = matrix.map(row => [...row]);
    // 转置矩阵
    const transposed = copy[0].map((_, i) => copy.map(row => row[i]));
    
    // 根据方向执行不同操作
    if (dir > 0) {
        // 顺时针旋转：转置后反转每行
        return transposed.map(row => row.reverse());
    } else {
        // 逆时针旋转：转置后反转行顺序（相当于反转列）
        return transposed.reverse();
    }
}

/**
 * 检查并清除完整行
 * 检查游戏板中是否有完整的行，如果有则清除并更新分数
 */
function sweep() {
    let rowCount = 0;
    outer: for (let y = board.length - 1; y >= 0; y--) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x] === EMPTY) {
                continue outer;
            }
        }

        const row = board.splice(y, 1)[0].fill(EMPTY);
        board.unshift(row);
        rowCount++;
        y++;
    }

    // 更新分数
    if (rowCount > 0) {
        // 根据消除行数计算分数
        const linePoints = [0, 40, 100, 300, 1200];
        score += linePoints[rowCount] * level;
        lines += rowCount;

        // 每消除10行升一级
        level = Math.floor(lines / 10) + 1;

        // 提高速度
        dropInterval = Math.max(100, 1000 - (level - 1) * 100);

        updateScore();
    }
}

/**
 * 更新分数显示
 * 更新页面上的分数、等级和消除行数显示
 */
function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('lines').textContent = lines;
}

/**
 * 重置游戏
 * 重置所有游戏状态和界面元素
 */
function resetGame() {
    createBoard();
    score = 0;
    level = 1;
    lines = 0;
    gameOver = false; // 确保 gameOver 状态重置
    paused = false;
    dropInterval = 1000;
    elapsedTime = 0;
    gameStarted = false; // 确保游戏状态正确重置
    startTime = null; // 重置 startTime

    // 重置时间相关变量
    dropCounter = 0;
    lastTime = 0;

    updateScore();
    updateTimer();

    // 隐藏游戏结束弹窗
    document.querySelector('.popup-container').classList.add('hidden');

    // 重置按钮文本
    document.getElementById('btn-start').textContent = '开始';
    document.getElementById('btn-pause').textContent = '暂停';

    // 清除定时器
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    // 重置玩家状态
    player.pos = { x: 0, y: 0 };
    player.matrix = null;
    player.next = randomPiece();

    drawBoard();
    drawNextPiece();
}

/**
 * 开始游戏
 * 初始化游戏状态并开始游戏循环
 */
function startGame() {
    if (gameStarted && !gameOver) {
        // 如果游戏正在进行中，则执行重置
        resetGame();
        return;
    }

    resetGame();
    gameStarted = true;
    gameOver = false; // 确保 gameOver 状态正确重置

    // 设置初始方块
    player.matrix = player.next;
    player.next = randomPiece();
    player.pos.y = 0;
    player.pos.x = Math.floor(COLS / 2) - Math.floor(player.matrix[0].length / 2);

    // 检查游戏是否立即结束（在设置初始位置后）
    if (collide(board, player)) {
        gameOver = true;
        showGameOver();
        return;
    }

    // 开始计时器
    startTime = Date.now() - elapsedTime;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);

    // 更新按钮文本
    document.getElementById('btn-start').textContent = '重置';
    document.getElementById('btn-pause').textContent = '暂停';

    drawBoard();
    drawPiece();
    drawNextPiece();

    // 确保游戏循环运行
    if (!lastTime) {
        lastTime = performance.now();
    }
    requestAnimationFrame(update);
}

/**
 * 暂停/继续游戏
 * 切换游戏的暂停状态
 */
function togglePause() {
    if (!gameStarted || gameOver) return;

    paused = !paused;
    const pauseButton = document.getElementById('btn-pause');

    if (paused) {
        pauseButton.textContent = '继续';
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    } else {
        pauseButton.textContent = '暂停';
        if (!timerInterval) {
            startTime = Date.now() - elapsedTime;
            timerInterval = setInterval(updateTimer, 1000);
        }
    }
}

/**
 * 更新计时器显示
 * 更新页面上的游戏时间显示
 */
function updateTimer() {
    if (!startTime) {
        // 如果 startTime 为 null，显示 00:00:00
        document.getElementById('timer').textContent = '00:00:00';
        return;
    }

    elapsedTime = Date.now() - startTime;
    const seconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const formattedTime = `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    document.getElementById('timer').textContent = formattedTime;

    // 如果是游戏结束弹窗，也更新那里的时间
    if (gameOver) {
        document.getElementById('popup-timer').textContent = formattedTime;
    }
}

/**
 * 显示游戏结束弹窗
 * 当游戏结束时显示得分和用时信息
 */
function showGameOver() {
    document.getElementById('popup-score').textContent = score;
    updateTimer();
    document.querySelector('.popup-container').classList.remove('hidden');
}

/**
 * 玩家移动方块
 * @param {number} dir - 移动方向（-1为左，1为右）
 */
function playerMove(dir) {
    if (!gameStarted || gameOver || paused || !player.matrix) return;

    player.pos.x += dir;
    if (collide(board, player)) {
        player.pos.x -= dir;
    }
    drawBoard();
    drawPiece();
}

/**
 * 玩家旋转方块
 * @param {number} dir - 旋转方向（正数为顺时针）
 */
function playerRotate(dir) {
    if (!gameStarted || gameOver || paused || !player.matrix) return;

    const originalMatrix = player.matrix; // 保存原始矩阵
    const pos = player.pos.x;
    let offset = 1;
    
    // 创建旋转后的矩阵副本进行碰撞检测
    const rotatedMatrix = rotate(originalMatrix, dir);
    player.matrix = rotatedMatrix; // 先应用旋转
    
    while (collide(board, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            // 恢复原始状态
            player.matrix = originalMatrix;
            player.pos.x = pos;
            return;
        }
    }
    
    // 保留有效旋转状态
    drawBoard();
    drawPiece();
}

/**
 * 玩家下落方块
 * 使方块向下移动一格
 */
function playerDrop() {
    if (!gameStarted || gameOver || paused || !player.matrix) return;

    player.pos.y++;
    if (collide(board, player)) {
        player.pos.y--;
        merge(board, player);
        playerReset();
        sweep();
        drawBoard();
        drawPiece();
        drawNextPiece(); // 添加这一行以确保下一个方块正确显示
        return; // 添加return以避免重复绘制
    }
    dropCounter = 0;
    drawBoard();
    drawPiece();
}

/**
 * 玩家快速下落方块
 * 使方块直接落到最底部
 */
function playerHardDrop() {
    if (!gameStarted || gameOver || paused || !player.matrix) return;

    while (!collide(board, player)) {
        player.pos.y++;
    }
    player.pos.y--;
    merge(board, player);
    playerReset();
    sweep();
    dropCounter = 0;
    drawBoard();
    drawPiece();
    drawNextPiece(); // 确保下一个方块正确显示
}

/**
 * 重置玩家方块
 * 当前方块固定后，生成新的方块
 */
function playerReset() {
    player.matrix = player.next;
    player.next = randomPiece();

    // 使用矩阵实际宽度计算居中位置
    const matrixWidth = player.matrix[0].length;
    player.pos.y = 0;
    player.pos.x = Math.floor(COLS / 2) - Math.floor(player.matrix[0].length / 2);

    // 检查新方块是否立即碰撞（游戏结束条件）
    if (collide(board, player)) {
        gameOver = true;
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        showGameOver();
        return;
    }

    // 只有在游戏未结束时才绘制下一个方块
    drawNextPiece();
}

/**
 * 游戏主循环
 * 控制游戏的更新和渲染
 * @param {number} time - 当前时间戳
 */
function update(time = 0) {
    if (gameOver) return;

    const deltaTime = time - lastTime;
    lastTime = time;

    if (!paused && gameStarted) {
        dropCounter += deltaTime;
        if (dropCounter > dropInterval) {
            playerDrop();
        }
    }

    if (!gameOver) { // 只有游戏未结束时才绘制
        drawBoard();
        drawPiece();
    }

    requestAnimationFrame(update);
}

/**
 * 处理按键按下
 * 处理键盘输入事件
 * @param {KeyboardEvent} event - 键盘事件对象
 */
function handleKeyDown(event) {
    // 特殊处理 Enter 键，即使游戏未开始也能使用
    if (event.code === 'Enter') {
        if (gameOver || !gameStarted) {
            // 如果游戏未开始，开始游戏
            startGame();
        } else {
            // 如果游戏正在进行中，切换暂停状态
            togglePause();
        }
        return;
    }

    switch (event.code) {
        case 'ArrowLeft': // 左箭头
            playerMove(-1);
            break;
        case 'ArrowRight': // 右箭头
            playerMove(1);
            break;
        case 'ArrowDown': // 下箭头
            playerDrop();
            break;
        case 'ArrowUp': // 上箭头
            playerRotate(1);
            break;
        case 'Space': // 空格
            playerHardDrop();
            break;
        case 'Escape': // R键
            startGame();
            break;
    }
}

/**
 * 处理按钮按下事件
 * 处理屏幕按钮的按下事件
 * @param {string} action - 操作类型
 */
function handleButtonPress(action) {
    if (!gameStarted && action !== 'start') return;

    // 首先清理现有的定时器，防止累积
    if (moveInterval) {
        clearInterval(moveInterval);
        moveInterval = null;
    }
    if (initialMoveTimeout) {
        clearTimeout(initialMoveTimeout);
        initialMoveTimeout = null;
    }

    switch (action) {
        case 'left':
            playerMove(-1);
            // 设置长按重复
            initialMoveTimeout = setTimeout(() => {
                moveInterval = setInterval(() => {
                    if (!paused) playerMove(-1);
                }, moveIntervalTime);
            }, initialMoveDelay);
            break;
        case 'right':
            playerMove(1);
            // 设置长按重复
            initialMoveTimeout = setTimeout(() => {
                moveInterval = setInterval(() => {
                    if (!paused) playerMove(1);
                }, moveIntervalTime);
            }, initialMoveDelay);
            break;
        case 'down':
            playerDrop();
            // 设置长按重复
            initialMoveTimeout = setTimeout(() => {
                moveInterval = setInterval(() => {
                    if (!paused) playerDrop();
                }, moveIntervalTime);
            }, initialMoveDelay);
            break;
        case 'rotate':
            playerRotate(1);
            break;
        case 'drop':
            playerHardDrop();
            break;
        case 'start':
            if (!gameStarted || gameOver) {
                startGame();
            } else {
                resetGame();
            }
            break;
        case 'pause':
            togglePause();
            break;
    }
}

/**
 * 处理按钮释放事件
 * 处理屏幕按钮的释放事件
 */
function handleButtonRelease() {
    if (moveInterval) {
        clearInterval(moveInterval);
        moveInterval = null;
    }
    if (initialMoveTimeout) {
        clearTimeout(initialMoveTimeout);
        initialMoveTimeout = null;
    }
}

/**
 * 页面加载完成后初始化游戏
 */
document.addEventListener('DOMContentLoaded', () => {
    // 创建游戏区域
    createGrid(ROWS, COLS);
    // 创建下一个方块显示区域
    createGrid(2, 4, 'next');

    // 初始化游戏板
    createBoard();

    // 绑定键盘事件
    document.addEventListener('keydown', handleKeyDown);

    // 绑定按钮事件
    document.getElementById('btn-left').addEventListener('mousedown', () => handleButtonPress('left'));
    document.getElementById('btn-right').addEventListener('mousedown', () => handleButtonPress('right'));
    document.getElementById('btn-down').addEventListener('mousedown', () => handleButtonPress('down'));
    document.getElementById('btn-up').addEventListener('mousedown', () => handleButtonPress('rotate'));
    document.getElementById('btn-drop').addEventListener('mousedown', () => handleButtonPress('drop'));
    document.getElementById('btn-start').addEventListener('click', () => handleButtonPress('start'));
    document.getElementById('btn-pause').addEventListener('click', () => handleButtonPress('pause'));

    // 绑定按钮释放事件
    document.getElementById('btn-left').addEventListener('mouseup', handleButtonRelease);
    document.getElementById('btn-right').addEventListener('mouseup', handleButtonRelease);
    document.getElementById('btn-down').addEventListener('mouseup', handleButtonRelease);
    document.getElementById('btn-up').addEventListener('mouseup', handleButtonRelease);
    document.getElementById('btn-drop').addEventListener('mouseup', handleButtonRelease);

    // 触摸设备支持
    document.getElementById('btn-left').addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleButtonPress('left');
    });
    document.getElementById('btn-right').addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleButtonPress('right');
    });
    document.getElementById('btn-down').addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleButtonPress('down');
    });
    document.getElementById('btn-up').addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleButtonPress('rotate');
    });
    document.getElementById('btn-drop').addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleButtonPress('drop');
    });

    document.getElementById('btn-left').addEventListener('touchend', handleButtonRelease);
    document.getElementById('btn-right').addEventListener('touchend', handleButtonRelease);
    document.getElementById('btn-down').addEventListener('touchend', handleButtonRelease);
    document.getElementById('btn-up').addEventListener('touchend', handleButtonRelease);
    document.getElementById('btn-drop').addEventListener('touchend', handleButtonRelease);

    // 弹窗确认按钮
    document.querySelector('.popup-button').addEventListener('click', () => {
        document.querySelector('.popup-container').classList.add('hidden');
        startGame();
    });

    // 开始游戏循环
    update();
});