/**
 * 创建首页的页面列表
 */
function getList() {
    const content = document.querySelector("#content-list");
    
    // 检查items是否已定义
    if (typeof items === 'undefined' || !Array.isArray(items)) {
        console.error('items数组未定义或不是数组');
        return;
    }
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        // 创建链接元素
        const a = document.createElement("a");
        a.className = "list-group-item list-group-item-action";
        a.href = item.href;
        a.setAttribute('role', 'listitem');
        content.append(a);

        // 创建标题和时间的容器
        let div = document.createElement("div");
        div.className = "d-flex w-100 justify-content-between";
        a.append(div);

        // 添加标题
        const h5 = document.createElement("h5");
        h5.textContent = item.title;
        div.append(h5);

        // 添加时间
        let small = document.createElement("small");
        small.textContent = item.time;
        div.append(small);

        // 添加描述
        const p = document.createElement("p");
        p.textContent = item.describe;
        a.append(p);

        // 添加分类
        small = document.createElement("small");
        small.style.float = "right";
        small.textContent = item.category;
        a.append(small);
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    getSystemTime();
    getList();
});