const elementRadius = document.getElementById('RadiusRect');
const elementValue = {
    width: document.getElementById('ValueWidth'),
    height: document.getElementById('ValueHeight'),
    radius: document.getElementById('ValueRadius')
};
let codes = '';

function setCode(radiusValue) {
    const rect = elementRadius.getBoundingClientRect();
    elementValue.width.innerText = `${Math.floor(rect.width)}px`;
    elementValue.height.innerText = `${Math.floor(rect.height)}px`;
    elementValue.radius.innerHTML = `${radiusValue}<span style="color: black">;</span>`;
    elementRadius.style.borderRadius = radiusValue;
    codes = '.Box {\n'
    codes += `    width: ${Math.floor(rect.width)}px;\n`
    codes += `    height: ${Math.floor(rect.height)}px;\n`
    codes += `    border-radius: ${radiusValue};\n`
    codes += '}';
}

function setRectRadius(radiusArray) {
    let r1, r2;
    if (radiusArray[0] === radiusArray[2] &&
        radiusArray[1] === radiusArray[3]) {
        r1 = radiusArray[0] + ' ' + radiusArray[1];
        if (radiusArray[0] === radiusArray[1]) {
            r1 = radiusArray[0];
        }
    } else {
        r1 = radiusArray[0] + ' ' + radiusArray[1] + ' ' + radiusArray[2] + ' ' + radiusArray[3];
    }
    if (radiusArray[5] === radiusArray[7] &&
        radiusArray[6] === radiusArray[8]) {
        r2 = radiusArray[5] + ' ' + radiusArray[6];
        if (radiusArray[5] === radiusArray[6]) {
            r2 = radiusArray[5];
        }
    } else {
        r2 = radiusArray[5] + ' ' + radiusArray[6] + ' ' + radiusArray[7] + ' ' + radiusArray[8];
    }
    radiusArray = r1 + ' / ' + r2;
    if (radiusArray[0] === radiusArray[5] &&
        radiusArray[1] === radiusArray[6] &&
        radiusArray[2] === radiusArray[7] &&
        radiusArray[3] === radiusArray[8]) {
        radiusArray = r1;
    }
    elementRadius.style.borderRadius = radiusArray;
    setCode(radiusArray);
}

const topLeft = document.getElementById('RangeTopLeft');
const leftTop = document.getElementById('RangeLeftTop');
const topRight = document.getElementById('RangeTopRight');
const rightTop = document.getElementById('RangeRightTop');
const bottomRight = document.getElementById('RangeBottomRight');
const rightBottom = document.getElementById('RangeRightBottom');
const bottomLeft = document.getElementById('RangeBottomLeft');
const leftBottom = document.getElementById('RangeLeftBottom');

const lockTL = document.getElementById('LockTopLeft');
const lockTR = document.getElementById('LockTopRight');
const lockBL = document.getElementById('LockBottomLeft');
const lockBR = document.getElementById('LockBottomRight');
const lockT = document.getElementById('LockTop');
const lockL = document.getElementById('LockLeft');
const lockB = document.getElementById('LockBottom');
const lockR = document.getElementById('LockRight');


const radiusValues = () => {
    let array = [];
    array.push(topLeft.value + '%');
    array.push(topRight.value + '%');
    array.push(bottomRight.value + '%');
    array.push(bottomLeft.value + '%');
    array.push('/');
    array.push(leftTop.value + '%');
    array.push(rightTop.value + '%');
    array.push(rightBottom.value + '%');
    array.push(leftBottom.value + '%');
    return array;
};

window.onload = () => {
    setRectRadius(radiusValues());

    topLeft.addEventListener('input', () => {
        if (lockTL.children[0].checked) leftTop.listenValue = topLeft.value;
        if (lockT.children[0].checked) topRight.listenValue = topLeft.value;
        setRectRadius(radiusValues());
    });
    Object.defineProperty(topLeft, 'listenValue', {
        configurable: true,
        set: function (value) {
            if (this.value !== value) {
                this.value = value;
                if (lockTL.children[0].checked) leftTop.listenValue = topLeft.value;
                if (lockT.children[0].checked) topRight.listenValue = topLeft.value;
            }
        },
        get: function () {
            return this.value;
        }
    });

    leftTop.addEventListener('input', () => {
        if (lockTL.children[0].checked) topLeft.listenValue = leftTop.value;
        if (lockL.children[0].checked) leftBottom.listenValue = leftTop.value;
        setRectRadius(radiusValues());
    });
    Object.defineProperty(leftTop, 'listenValue', {
        configurable: true,
        set: function (value) {
            if (this.value !== value) {
                this.value = value;
                if (lockTL.children[0].checked) topLeft.listenValue = leftTop.value;
                if (lockL.children[0].checked) leftBottom.listenValue = leftTop.value;
            }
        },
        get: function () {
            return this.value;
        }
    });

    topRight.addEventListener('input', () => {
        if (lockTR.children[0].checked) rightTop.listenValue = topRight.value;
        if (lockT.children[0].checked) topLeft.listenValue = topRight.value;
        setRectRadius(radiusValues());
    });
    Object.defineProperty(topRight, 'listenValue', {
        configurable: true,
        set: function (value) {
            if (this.value !== value) {
                this.value = value;
                if (lockTR.children[0].checked) rightTop.listenValue = topRight.value;
                if (lockT.children[0].checked) topLeft.listenValue = topRight.value;
            }
        },
        get: function () {
            return this.value;
        }
    });

    rightTop.addEventListener('input', () => {
        if (lockTR.children[0].checked) topRight.listenValue = rightTop.value;
        if (lockR.children[0].checked) rightBottom.listenValue = rightTop.value;
        setRectRadius(radiusValues());
    });
    Object.defineProperty(rightTop, 'listenValue', {
        configurable: true,
        set: function (value) {
            if (this.value !== value) {
                this.value = value;
                if (lockTR.children[0].checked) topRight.listenValue = rightTop.value;
                if (lockR.children[0].checked) rightBottom.listenValue = rightTop.value;
            }
        },
        get: function () {
            return this.value;
        }
    });

    bottomRight.addEventListener('input', () => {
        if (lockBR.children[0].checked) rightBottom.listenValue = bottomRight.value;
        if (lockB.children[0].checked) bottomLeft.listenValue = bottomRight.value
        setRectRadius(radiusValues());
    });
    Object.defineProperty(bottomRight, 'listenValue', {
        configurable: true,
        set: function (value) {
            if (this.value !== value) {
                this.value = value;
                if (lockBR.children[0].checked) rightBottom.listenValue = bottomRight.value;
                if (lockB.children[0].checked) bottomLeft.listenValue = bottomRight.value
            }
        },
        get: function () {
            return this.value;
        }
    });

    rightBottom.addEventListener('input', () => {
        if (lockBR.children[0].checked) bottomRight.listenValue = rightBottom.value;
        if (lockR.children[0].checked) rightTop.listenValue = rightBottom.value
        setRectRadius(radiusValues());
    });
    Object.defineProperty(rightBottom, 'listenValue', {
        configurable: true,
        set: function (value) {
            if (this.value !== value) {
                this.value = value;
                if (lockBR.children[0].checked) bottomRight.listenValue = rightBottom.value;
                if (lockR.children[0].checked) rightTop.listenValue = rightBottom.value
            }
        },
        get: function () {
            return this.value;
        }
    });

    bottomLeft.addEventListener('input', () => {
        if (lockBL.children[0].checked) leftBottom.listenValue = bottomLeft.value;
        if (lockB.children[0].checked) bottomRight.listenValue = bottomLeft.value;
        setRectRadius(radiusValues());
    });
    Object.defineProperty(bottomLeft, 'listenValue', {
        configurable: true,
        set: function (value) {
            if (this.value !== value) {
                this.value = value;
                if (lockBR.children[0].checked) leftBottom.listenValue = bottomLeft.value;
                if (lockB.children[0].checked) bottomRight.listenValue = bottomLeft.value;
            }
        },
        get: function () {
            return this.value;
        }
    });

    leftBottom.addEventListener('input', () => {
        if (lockBL.children[0].checked) bottomLeft.listenValue = leftBottom.value;
        if (lockL.children[0].checked) leftTop.listenValue = leftBottom.value;
        setRectRadius(radiusValues());
    });
    Object.defineProperty(leftBottom, 'listenValue', {
        configurable: true,
        set: function (value) {
            if (this.value !== value) {
                this.value = value;
                if (lockBL.children[0].checked) bottomLeft.listenValue = leftBottom.value;
                if (lockL.children[0].checked) leftTop.listenValue = leftBottom.value;
            }
        },
        get: function () {
            return this.value;
        }
    });
}

window.onresize = () => {
    setRectRadius(radiusValues());
}

function CopyCode() {
    navigator.clipboard.writeText(codes).then();
}