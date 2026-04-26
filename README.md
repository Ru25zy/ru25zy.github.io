# 我的个人博客

一个展示CSS特效和在线应用的个人博客网站。

## 项目结构

```
ru25zy.github.io/
├── Pages/              # 页面目录
│   ├── CSS3D/         # CSS 3D特效演示
│   ├── CSSEffects01/  # CSS效果演示
│   ├── MidAutumn/     # 中秋主题动画
│   ├── RingRose/      # Ring Rose应用
│   ├── TowerDefense/  # 塔防游戏
│   ├── textFormatting/# 文本格式化工具
│   ├── memoryCards/   # 翻牌配对游戏
│   ├── tetris/        # 俄罗斯方块游戏
│   └── border_radius/ # CSS圆角边框演示
├── ScriptLibrary/     # 第三方JavaScript库
├── StyleLibrary/      # 第三方CSS库
├── css/               # 自定义CSS文件
├── js/                # JavaScript文件
├── svg/               # SVG图标文件
├── index.html         # 主页
└── .gitignore         # Git忽略文件配置
```

## 优化内容

### 1. 添加了 `.gitignore` 文件
- 忽略操作系统生成的文件（.DS_Store, Thumbs.db等）
- 忽略编辑器配置文件
- 忽略日志文件和临时文件
- 忽略依赖目录和构建输出

### 2. HTML结构优化
- 添加了语义化标签（header, main, section, aside）
- 改进了可访问性（ARIA标签和角色）
- 添加了viewport meta标签以支持响应式设计
- 改进了meta描述信息
- 将所有页面的语言设置为中文（zh-CN）
- 统一了所有子页面的导航栏结构

### 3. 导航栏优化
- 减小导航栏高度，使其更紧凑
- 字体大小从 `2em` 调整为 `1.5em`
- 图标尺寸从 `32x32` 调整为 `24x24`
- 添加了 `py-2` 类控制垂直内边距
- 在CSS中设置了 `min-height: auto` 让导航栏自适应高度
- 统一了所有子页面的导航栏样式

### 4. JavaScript代码优化
- 添加了详细的注释和JSDoc文档
- 改进了错误处理机制
- 使用更现代的DOM事件监听方式（DOMContentLoaded）
- 提取了重复代码为独立函数
- 添加了空值检查以提高稳定性
- 更新了 `createNavbar()` 函数以应用新的窄导航栏样式

### 5. CSS代码优化
- 添加了清晰的注释分段
- 改进了代码格式和可读性
- 为链接动画效果添加了说明注释
- 添加了导航栏样式优化规则

## 技术栈

- HTML5
- CSS3 (Bootstrap框架)
- JavaScript (原生)
- SVG图标

## 功能特性

- 响应式设计，适配不同屏幕尺寸
- 实时时钟显示
- CSS 3D变换演示
- 多种CSS特效展示
- 交互式页面列表
- 文本格式化工具
- 翻牌配对游戏
- 俄罗斯方块游戏
- CSS圆角边框演示

## 浏览器兼容性

现代浏览器均能良好支持，包括：
- Chrome
- Firefox
- Safari
- Edge

## 部署

该项目可直接部署在GitHub Pages上，无需额外构建步骤。
