// 获取DOM元素
const wrapSymbolInput = document.getElementById('wrap-symbol');
const wrapButton = document.getElementById('wrap-button');
const textarea = document.getElementById('textarea');
const ignoreWarpCheckbox = document.getElementById('check-ignore-warp');
const wrapIgnoreLineInput = document.getElementById('wrap-ignore-line');
// 格式化文本按钮
const btnIndent = document.getElementById('btn-indent');
const btnNoIndent = document.getElementById('btn-no-indent');
const btnLine = document.getElementById('btn-line');
const btnNoLine = document.getElementById('btn-no-line');
// 全角半角转换按钮
const btnHalfCharacter = document.getElementById('btn-half-character');
const btnFullCharacter = document.getElementById('btn-full-character');
const btnHalfNumber = document.getElementById('btn-half-number');
const btnFullNumber = document.getElementById('btn-full-number');
// 获取统计元素
const charCountElement = document.getElementById('char-count');
const wordCountElement = document.getElementById('word-count');
const symbolCountElement = document.getElementById('symbol-count');
// 繁简转换按钮
const btnSimplified = document.getElementById('btn-simplified');
const btnTraditional = document.getElementById('btn-traditional');

// 添加繁简转换按钮事件监听器
btnSimplified.addEventListener('click', function() {
    textarea.value = convertToSimplified(textarea.value);
});

btnTraditional.addEventListener('click', function() {
    textarea.value = convertToTraditional(textarea.value);
});


// 为汉堡菜单添加事件监听器
document.addEventListener('DOMContentLoaded', function() {
    const burgerCheckbox = document.getElementById('burger');
    const asideElement = document.querySelector('aside');

    burgerCheckbox.addEventListener('change', function() {
        if (this.checked) {
            asideElement.classList.add('active');
        } else {
            asideElement.classList.remove('active');
        }
    });
});


// 添加段落缩进设置按钮事件监听器
btnIndent.addEventListener('click', function() {
    textarea.value = addIndentation(textarea.value);
});

btnNoIndent.addEventListener('click', function() {
    textarea.value = removeIndentation(textarea.value);
});

// 添加段落空行设置按钮事件监听器
btnLine.addEventListener('click', function() {
    textarea.value = addParagraphLineBreaks(textarea.value);
});

btnNoLine.addEventListener('click', function() {
    textarea.value = removeParagraphLineBreaks(textarea.value);
});

// 添加全角半角转换按钮事件监听器
btnHalfCharacter.addEventListener('click', function() {
    textarea.value = convertToHalfWidthChars(textarea.value, 'alphabet');
});

btnFullCharacter.addEventListener('click', function() {
    textarea.value = convertToFullWidthChars(textarea.value, 'alphabet');
});

btnHalfNumber.addEventListener('click', function() {
    textarea.value = convertToHalfWidthChars(textarea.value, 'number');
});

btnFullNumber.addEventListener('click', function() {
    textarea.value = convertToFullWidthChars(textarea.value, 'number');
});

// 添加点击事件监听器到换行猜测按钮
wrapButton.addEventListener('click', function() {
    // 获取换行符号列表
    const wrapSymbols = wrapSymbolInput.value;

    // 获取忽略行数设置
    const ignoreLines = ignoreWarpCheckbox.checked ? parseInt(wrapIgnoreLineInput.value) || 0 : 0;

    // 获取文本内容
    let text = textarea.value;

    // 处理换行符
    text = processLineBreaks(text, wrapSymbols, ignoreLines);

    // 更新文本区域内容
    textarea.value = text;
});

// 监听文本区域变化，实时更新统计
textarea.addEventListener('input', updateTextStatistics);

/**
 * 转换为简体中文
 * @param {string} text - 原始文本
 * @returns {string} 转换后的文本
 */
function convertToSimplified(text) {
    if (!text) return text;

    // 使用cnchar库进行繁转简
    if (typeof cnchar !== 'undefined' && cnchar.convert && cnchar.convert.tradToSimple) {
        return cnchar.convert.tradToSimple(text);
    }

    return text;
}

/**
 * 转换为繁体中文
 * @param {string} text - 原始文本
 * @returns {string} 转换后的文本
 */
function convertToTraditional(text) {
    if (!text) return text;

    // 使用cnchar库进行简转繁
    if (typeof cnchar !== 'undefined' && cnchar.convert && cnchar.convert.simpleToTrad) {
        return cnchar.convert.simpleToTrad(text);
    }

    return text;
}


/**
 * 文本统计信息
 * 中文字符：只统计中文双字节字符
 * 英文单词：只统计英文单字节单词
 * 符号：只统计符号数量（排除中英文字符和空格）
 */
function updateTextStatistics() {
    const text = textarea.value;

    // 统计中文字符数（双字节中文字符）
    const chineseMatches = text.match(/[\u4e00-\u9fa5]/g);
    const chineseCharCount = chineseMatches ? chineseMatches.length : 0;

    // 统计英文单词数（连续的英文字母组成单词）
    const englishWords = text.match(/[a-zA-Z]+/g);
    const englishWordCount = englishWords ? englishWords.length : 0;

    // 统计符号数（非中文、非英文、非空格的字符）
    const symbolCount = text.split('').filter(char =>
        !/\s/.test(char) &&
        !/[a-zA-Z0-9]/.test(char) &&
        !/[\u4e00-\u9fa5]/.test(char)
    ).length;

    // 更新显示
    charCountElement.textContent = chineseCharCount.toString();
    wordCountElement.textContent = englishWordCount.toString();
    symbolCountElement.textContent = symbolCount.toString();
}

/**
 * 处理换行符的函数
 * @param {string} text - 原始文本
 * @param {string} wrapSymbols - 允许换行的符号
 * @param {number} ignoreLines - 忽略前几行不参与处理
 * @returns {string} 处理后的文本
 */
function processLineBreaks(text, wrapSymbols, ignoreLines = 0) {
    // 将文本按换行符分割成行数组
    const lines = text.split('\n');

    // 如果只有一行，直接返回
    if (lines.length <= 1) {
        return text;
    }

    // 处理每一行
    const processedLines = [];

    for (let i = 0; i < lines.length; i++) {
        // 如果是最后一行，直接添加
        if (i === lines.length - 1) {
            processedLines.push(lines[i]);
            break;
        }

        // 如果当前行在忽略范围内，保留换行符
        if (i < ignoreLines) {
            processedLines.push(lines[i]);
            continue;
        }

        // 获取当前行
        const currentLine = lines[i];

        // 如果当前行为空，保留换行符
        if (currentLine === '') {
            processedLines.push(currentLine);
            continue;
        }

        // 获取当前行的最后一个字符
        const lastChar = currentLine[currentLine.length - 1];

        // 检查最后一个字符是否在允许换行的符号中
        if (wrapSymbols.includes(lastChar)) {
            // 如果是合法换行，保留当前行和换行符
            processedLines.push(currentLine);
        } else {
            // 如果不是合法换行，合并到下一行（不添加换行符）
            lines[i + 1] = currentLine + lines[i + 1];
        }
    }

    // 将处理后的行用换行符连接起来
    return processedLines.join('\n');
}

/**
 * 添加段落缩进（4个空格）
 * @param {string} text - 原始文本
 * @returns {string} 添加缩进后的文本
 */
function addIndentation(text) {
    if (!text) return text;

    // 首先移除行首的空格
    const lines = text.split('\n');
    const trimmedLines = lines.map(line => line.trimStart());

    // 然后对非空行添加缩进
    const indentedLines = trimmedLines.map(line => {
        if (line.trim() !== '') {
            return '    ' + line; // 4个空格缩进
        }
        return line;
    });

    return indentedLines.join('\n');
}

/**
 * 移除段落缩进
 * @param {string} text - 原始文本
 * @returns {string} 移除缩进后的文本
 */
function removeIndentation(text) {
    if (!text) return text;

    // 首先移除行首的空格
    const lines = text.split('\n');
    const unindentedLines = lines.map(line => line.trimStart());

    return unindentedLines.join('\n');
}

/**
 * 添加段落间的空行
 * @param {string} text - 原始文本
 * @returns {string} 添加空行后的文本
 */
function addParagraphLineBreaks(text) {
    if (!text) return text;

    // 按段落分割，过滤空段落，然后用两个换行符连接（添加空行）
    const paragraphs = text.split('\n\n');
    const filteredParagraphs = paragraphs.filter(p => p.trim() !== '');

    return filteredParagraphs.join('\n\n');
}

/**
 * 移除段落间的多余空行，保持段落间无空行
 * @param {string} text - 原始文本
 * @returns {string} 移除多余空行后的文本
 */
function removeParagraphLineBreaks(text) {
    if (!text) return text;

    // 将多个连续的换行符替换为单个换行符，并移除开头和结尾的空行
    return text.replace(/\n\s*\n+/g, '\n')  // 将多个连续空行替换为单个换行符
        .replace(/^\s*\n/, '')             // 移除开头的空行
        .replace(/\n\s*$/, '');            // 移除结尾的空行
}

/**
 * 转换为半角字符
 * @param {string} text - 原始文本
 * @param {string} type - 转换类型 ('alphabet' 或 'number')
 * @returns {string} 转换后的文本
 */
function convertToHalfWidthChars(text, type) {
    let result = text;

    if (type === 'alphabet') {
        // 全角字母转半角字母 (A-Z: 65-90, a-z: 97-122)
        result = text.replace(/[\uFF21-\uFF3A\uFF41-\uFF5A]/g, function(match) {
            return String.fromCharCode(match.charCodeAt(0) - 65248);
        });
    } else if (type === 'number') {
        // 全角数字转半角数字 (0-9: 48-57)
        result = text.replace(/[\uFF10-\uFF19]/g, function(match) {
            return String.fromCharCode(match.charCodeAt(0) - 65248);
        });
    }

    return result;
}

/**
 * 转换为全角字符
 * @param {string} text - 原始文本
 * @param {string} type - 转换类型 ('alphabet' 或 'number')
 * @returns {string} 转换后的文本
 */
function convertToFullWidthChars(text, type) {
    let result = text;

    if (type === 'alphabet') {
        // 半角字母转全角字母 (A-Z: 65-90, a-z: 97-122)
        result = text.replace(/[A-Za-z]/g, function(match) {
            return String.fromCharCode(match.charCodeAt(0) + 65248);
        });
    } else if (type === 'number') {
        // 半角数字转全角数字 (0-9: 48-57)
        result = text.replace(/[0-9]/g, function(match) {
            return String.fromCharCode(match.charCodeAt(0) + 65248);
        });
    }

    return result;
}

// 页面加载完成后设置默认值
document.addEventListener('DOMContentLoaded', function() {
    // 设置换行符号的默认值，包含单引号和双引号
    const wrapSymbolInput = document.getElementById('wrap-symbol');
    wrapSymbolInput.value = '。？！…”’.?!"\';';

    // 初始化统计
    updateTextStatistics();
});
