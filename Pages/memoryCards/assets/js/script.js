// 游戏状态管理对象
const gameState = {
    flippedCards: [],
    matchedPairs: 0,
    emojiPairs: [],
    gameStarted: false,
    errorCount: 0,
    timer: null,
    timeElapsed: 0,
    currentDifficulty: 'easy'
};

// 初始化游戏
function initGame(difficulty) {
    const { rows, cols } = getGridSize(difficulty);

    // 停止计时器并重置变量
    stopTimer();
    resetGameState();

    // 更新当前难度
    gameState.currentDifficulty = difficulty;

    // 生成随机emoji对
    gameState.emojiPairs = generateEmojiPairs((rows * cols) / 2);

    // 创建游戏网格
    createGameGrid(rows, cols);

    // 启动计时器
    startTimer();

    gameState.gameStarted = true;

    // 显示计时和错误次数
    showGameInfo();
    showRestartButton(true);
}

// 获取网格大小
function getGridSize(level) {
    switch (level) {
        case 'easy':
            return { rows: 4, cols: 4 };
        case 'normal':
            return { rows: 6, cols: 6 };
        case 'hard':
            return { rows: 8, cols: 8 };
    }
}

// 生成随机emoji对
function generateEmojiPairs(totalPairs) {
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
                   '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦',
                   '🦄', '🐝', '🦋', '🐢', '🐍', '🦖', '🐠', '🐙',
                   '🦐', '🦀', '🐳', '🦉', '🦇', '🦅', '🦆', '🐊'];

    const uniqueEmojis = [...new Set(emojis)]; // 去重
    const selected = [];

    // 创建一个副本数组用于随机选取
    let availableEmojis = [...uniqueEmojis];

    for (let i = 0; i < totalPairs; i++) {
        // 如果可用 emoji 用完了，就重新复制一份
        if (availableEmojis.length === 0) {
            availableEmojis = [...uniqueEmojis];
        }

        // 随机选择一个 emoji
        const randomIndex = Math.floor(Math.random() * availableEmojis.length);
        selected.push(availableEmojis[randomIndex]);

        // 从可用列表中移除该 emoji，避免重复
        availableEmojis.splice(randomIndex, 1);
    }

    return [...selected, ...selected].sort(() => Math.random() - 0.5);
}

// 创建游戏网格
function createGameGrid(rows, cols) {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';
    
    // 设置容器列数变量（用于CSS计算）
    gameContainer.style.setProperty('--cols', cols);

    // 按行生成容器
    for (let row = 0; row < rows; row++) {
        const rowContainer = document.createElement('div');
        rowContainer.className = 'game-row';
        
        // 为每行生成卡片
        for (let col = 0; col < cols; col++) {
            const index = row * cols + col;
            const emoji = gameState.emojiPairs[index];
            const card = createCardElement(emoji, index);
            rowContainer.appendChild(card);
        }
        
        gameContainer.appendChild(rowContainer);
    }

    
    // 计算卡片尺寸
    // 强制重排确保尺寸正确获取
    void gameContainer.offsetWidth;
}

// 添加窗口大小变化监听器
window.addEventListener('resize', () => {
    // 短时延迟确保DOM更新完成
    setTimeout(() => {
        const firstCard = document.querySelector('.game-row .card');
        if (firstCard && gameState.gameStarted) {
            const cardRect = firstCard.getBoundingClientRect();
            const cardSize = Math.floor(cardRect.width);
            const fontSize = Math.floor(cardSize * 0.6);
            
            document.documentElement.style.setProperty('--card-size', `${cardSize}px`);
            document.documentElement.style.setProperty('--emoji-font-size', `${fontSize}px`);
        }
    }, 100); // 100ms延迟确保布局重绘
});

// 提取卡片创建为独立函数
function createCardElement(emoji, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    card.dataset.emoji = emoji;
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-back">?</div>
            <div class="card-front">${emoji}</div>
        </div>
    `;
    card.addEventListener('click', flipCard);
    return card;
}

// 翻牌逻辑
function flipCard() {
    const { flippedCards, gameStarted } = gameState;

    if (!gameStarted || flippedCards.length >= 2 || this.classList.contains('flipped')) return;

    this.classList.add('flipped');
    this.disabled = true;
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

// 检查是否匹配
function checkMatch() {
    const [card1, card2] = gameState.flippedCards;

    if (card1.dataset.emoji === card2.dataset.emoji) {
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        gameState.matchedPairs++;
        gameState.flippedCards = [];

        // 检查游戏是否结束
        if (gameState.matchedPairs === gameState.emojiPairs.length / 2) {
            setTimeout(showEndPopup, 500);
        }
    } else {
        gameState.errorCount++; // 增加错误次数
        updateErrorDisplay();   // 更新错误次数显示
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.disabled = false;
            card2.disabled = false;
            gameState.flippedCards = [];
        }, 1000);
    }
}

// 启动计时器
function startTimer() {
    gameState.timer = setInterval(() => {
        gameState.timeElapsed++;
        updateTimerDisplay();
    }, 1000);
}

// 停止计时器
function stopTimer() {
    clearInterval(gameState.timer);
}

// 更新计时显示
function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer');
    if (timerDisplay) {
        const timeElapsed = gameState.timeElapsed;
        const hours = String(Math.floor(timeElapsed / 3600)).padStart(2, '0'); // 计算小时
        const minutes = String(Math.floor((timeElapsed % 3600) / 60)).padStart(2, '0'); // 计算分钟
        const seconds = String(timeElapsed % 60).padStart(2, '0'); // 计算秒
        timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }
}

// 更新错误次数显示
function updateErrorDisplay() {
    const errorDisplay = document.getElementById('error-count');
    if (errorDisplay) {
        errorDisplay.textContent = gameState.errorCount;
    }
}

// 重置游戏状态
function resetGameState() {
    stopTimer();
    gameState.flippedCards = [];
    gameState.matchedPairs = 0;
    gameState.emojiPairs = [];
    gameState.errorCount = 0;
    gameState.timeElapsed = 0;
    gameState.gameStarted = false;
    
    // 更新显示
    updateTimerDisplay();
    updateErrorDisplay();
    showRestartButton(false);
}

function showElement(id) {
    document.getElementById(id).classList.remove('hidden');
}

function hideElement(id) {
    document.getElementById(id).classList.add('hidden');
}

function showRestartButton(show) {
    const restartBtn = document.getElementById('restart-btn');
    restartBtn.classList.toggle('hidden', !show);
}

// 显示弹窗并设置内容
function showPopup(title, message, buttonText, onAction) {
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popup-title');
    const popupMessage = document.getElementById('popup-message');
    const actionButton = document.getElementById('popup-action-btn');

    // 更新弹窗内容
    popupTitle.textContent = title;
    popupMessage.textContent = message;
    actionButton.textContent = buttonText;

    // 绑定按钮点击事件
    actionButton.onclick = onAction;

    // 更新计时器和错误次数显示
    updateTimerDisplay();
    updateErrorDisplay();

    // 显示弹窗
    showElement('popup');
}

// 隐藏弹窗
function hidePopup() {
    hideElement('popup');
}

// 开始游戏
function startGame() {
    const difficulty = document.getElementById('difficulty-select').value;
    hidePopup(); // 隐藏弹窗
    initGame(difficulty); // 初始化游戏
}

// 再次挑战
function restartGame() {
    // 停止计时器
    stopTimer();
    
    // 隐藏弹窗（如果游戏结束时弹窗显示）
    hidePopup();
    
    // 重置游戏状态
    resetGameState();
    
    // 清除游戏网格
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';
    
    // 使用当前难度重新初始化游戏
    initGame(gameState.currentDifficulty);
    
    // 更新游戏信息显示
    showGameInfo();
    showRestartButton(true);
}

function setupGameInfo() {
    const infoDiv = document.querySelector('#information');

    // 如果已经存在 timer 元素则不再创建
    if (!document.getElementById('timer')) {
        const timerDiv = document.createElement('div');
        timerDiv.className = 'information-item';
        timerDiv.id = 'timer-container';
        timerDiv.innerHTML = `
            <label>用时:</label>
            <span id="timer">0</span> 
        `;
        infoDiv.appendChild(timerDiv);
    }

    // 如果已经存在 error-count 元素则不再创建
    if (!document.getElementById('error-count')) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'information-item';
        errorDiv.id = 'error-count-container';
        errorDiv.innerHTML = `
            <label>错误:</label>
            <span id="error-count">0</span> 次
        `;
        infoDiv.appendChild(errorDiv);
    }

    // 默认隐藏
    hideGameInfo();
}

function showGameInfo() {
    const timerContainer = document.getElementById('timer-container');
    const errorContainer = document.getElementById('error-count-container');

    if (timerContainer) timerContainer.style.display = 'flex';
    if (errorContainer) errorContainer.style.display = 'flex';
}

function hideGameInfo() {
    const timerContainer = document.getElementById('timer-container');
    const errorContainer = document.getElementById('error-count-container');

    if (timerContainer) timerContainer.style.display = 'none';
    if (errorContainer) errorContainer.style.display = 'none';
}

function createBackgroundAnimation() {
    const bgContainer = document.getElementById('background-animation');
    const totalSquares = 10;
    const squares = [];

    // 判断两个矩形是否相交（带 10px 缓冲）
    function isOverlapping(newRect) {
        return squares.some(square => {
            const oldRect = square.getBoundingClientRect();
            return !(
                newRect.right < oldRect.left - 10 ||
                newRect.left > oldRect.right + 10 ||
                newRect.bottom < oldRect.top - 10 ||
                newRect.top > oldRect.bottom + 10
            );
        });
    }

    // 创建一个不重叠的方块
    function createSquare() {
        let newSquare, newRect, attempts = 0;

        do {
            newSquare = document.createElement('div');
            newSquare.className = 'background-square';

            const x = Math.random() * (window.innerWidth - 40);
            const y = Math.random() * (window.innerHeight - 40);
            newSquare.style.left = `${x}px`;
            newSquare.style.top = `${y}px`;

            bgContainer.appendChild(newSquare);
            newRect = newSquare.getBoundingClientRect();

            attempts++;
            if (attempts > 100) {
                newSquare.remove();
                return;
            }
        } while (isOverlapping(newRect));

        squares.push(newSquare);

        // 动画结束后移除并补充新方块
        const duration = 3000;
        setTimeout(() => {
            newSquare.remove();
            const index = squares.indexOf(newSquare);
            if (index > -1) squares.splice(index, 1);
            createSquare(); // 补充一个新方块
        }, duration);
    }

    // 初始创建 10 个方块
    for (let i = 0; i < totalSquares; i++) {
        setTimeout(createSquare, i * 300); // 依次创建避免卡顿
    }
}

// 页面加载时初始化
window.onload = () => {
    createBackgroundAnimation(); // 启动背景动画

    // 默认显示开始弹窗
    showPopup(
        '翻牌配对游戏',
        '请选择难度，然后开始游戏',
        '开始游戏',
        startGame
    );

    setupGameInfo();

    // 绑定难度选择事件
    document.getElementById('difficulty-select').addEventListener('change', (e) => {
        gameState.currentDifficulty = e.target.value;
    });

    // 绑定重新开始按钮事件
    document.getElementById('restart-btn').addEventListener('click', () => {
        restartGame();
    });

    showRestartButton(false); // 页面加载时隐藏按钮
};

// 显示游戏结束弹窗
function showEndPopup() {
    stopTimer();
    showPopup(
        '游戏完成',
        '恭喜你完成游戏！',
        '重试',
        () => {
            restartGame(); // 重置游戏状态和 UI
            initGame(gameState.currentDifficulty); // 使用当前难度直接开始
        }
    );
}