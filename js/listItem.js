/**
 * 页面列表数据
 * @typedef {Object} PageItem
 * @property {string} href - 页面链接
 * @property {string} title - 页面标题
 * @property {string} time - 发布时间
 * @property {string} category - 分类
 * @property {string} describe - 描述
 */

/** @type {PageItem[]} */
const items = [
    {
        href: "Pages/RingRose/index.html",
        title: "Ring Rose",
        time: "2022.08.31",
        category: "在线应用",
        describe: "简单的 Ring Rose 助手。"
    },
    {
        href: "Pages/CSS3D/index.html",
        title: "纯 CSS3 创建 3D 图形",
        time: "2022.09.05",
        category: "CSS",
        describe: "基于 CSS3 的三维变换功能创建简单的 3D 图形。"
    },
    {
        href: "Pages/CSSEffects01/index.html",
        title: "一些使用 CSS 制作的简单效果",
        time: "2022.09.08",
        category: "CSS",
        describe: "基于 box-shadow 和 text-shadow 制作的简单特效。"
    },
    {
        href: "Pages/MidAutumn/index.html",
        title: "中秋快乐",
        time: "2022.09.10", // 添加缺失的时间字段
        category: "CSS,CSS动画",
        describe: "纯 CSS 中秋快乐主题动画。"
    }
];
