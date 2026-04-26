/* 右侧时间显示卡片 */
const weekdays = ["日", "一", "二", "三", "四", "五", "六"];

/**
 * 获取并显示系统时间
 */
function getSystemTime() {
    const current = new Date();
    const timeArray = [
        current.getHours(), 
        current.getMinutes(), 
        current.getSeconds(),
        current.getFullYear(), 
        current.getMonth() + 1, 
        current.getDate()
    ];
    
    const elements = [
        "system-hour", 
        "system-minute", 
        "system-second", 
        "system-year", 
        "system-month", 
        "system-day"
    ];
    
    // 更新时间显示
    for (let i = 0; i < timeArray.length; i++) {
        const element = document.querySelector("#" + elements[i]);
        if (element) {
            element.textContent = timeArray[i] < 10 ? "0" + timeArray[i] : timeArray[i].toString();
        }
    }
    
    // 更新星期显示
    const weekElement = document.querySelector("#system-week");
    if (weekElement) {
        weekElement.textContent = "星期" + weekdays[current.getDay()];
    }
    
    // 更新时钟指针
    updateClockHands(current);
    
    // 每秒更新一次
    window.setTimeout(getSystemTime, 1000);
}

/**
 * 更新时钟指针位置
 * @param {Date} date - 当前时间对象
 */
function updateClockHands(date) {
    const minutes = date.getMinutes();
    const hours = date.getHours();
    
    // 分针角度（每分钟6度）
    const minuteAngle = 6 * minutes;
    const minuteHand = document.querySelector("#minute-hand");
    if (minuteHand) {
        minuteHand.setAttribute("transform", "translate(8,8) rotate(" + minuteAngle + ")");
    }
    
    // 时针角度（每小时30度）
    const hourAngle = 30 * hours;
    const hourHand = document.querySelector("#hour-hand");
    if (hourHand) {
        hourHand.setAttribute("transform", "translate(8,8) rotate(" + hourAngle + ")");
    }
}

/**
 * 创建导航栏
 */
function createNavbar() {
    const nav = document.querySelector("nav");
    if (!nav) return;
    
    nav.textContent = "";
    nav.className = "navbar navbar-dark bg-primary mb-3 py-2";
    
    let div = document.createElement("div");
    div.className = "container-fluid";
    nav.append(div);

    let span = document.createElement("span");
    span.className = "navbar-brand fw-bolder";
    span.style.fontSize = "1.5em";
    div.append(span);

    let img = document.createElement("img");
    img.src = "../../svg/navigation.svg";
    img.width = 24;
    img.height = 24;
    img.alt = "导航图标";
    span.append(img);

    let title = document.createTextNode("我的个人博客");
    span.append(title);

    let divLink = document.createElement("div");
    div.append(divLink);

    let a = document.createElement("a");
    a.className = "nav-link text-white";
    a.href = "../../index.html";
    a.textContent = "返回首页";
    divLink.append(a);
}