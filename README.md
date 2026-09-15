# 原神 · 提瓦特角色图鉴

一个基于纯 HTML / CSS / JavaScript 构建的原神角色图鉴与主线剧情回顾网站，收录 30 位提瓦特大陆的传奇角色，并提供版本主线剧情时间线查阅功能。

## 在线访问

**https://elysia0618.github.io/yuanshen/**

## 功能概览

- **角色图鉴**：30 位角色的立绘展示，支持按元素（风/岩/雷/草/水/火/冰）筛选
- **角色专属页面**：每位角色拥有独立页面，包含立绘、名字、称号、元素、地区、武器、稀有度、故事背景与主要剧情
- **版本剧情**：从序章（蒙德）到第六章（至冬）的主线剧情时间线，支持按地区筛选
- **原神风格 UI**：深色主题、金色配色、元素发光边框、粒子背景动画

## 项目结构

```
yuanshen/
├── index.html                  # 首页（角色图鉴网格）
├── versions.html               # 版本剧情时间线页
├── css/
│   └── style.css               # 全局样式
├── js/
│   ├── characters-data.js      # 角色数据（名字、元素、故事、剧情等）
│   ├── versions-data.js        # 版本剧情数据
│   └── main.js                 # 首页交互逻辑（卡片渲染、筛选、粒子）
├── characters/                 # 30 个角色专属页面
│   ├── aether.html
│   ├── amber.html
│   ├── ...
│   └── wriothesley.html
└── scripts/
    └── generate-characters.js  # 角色详情页批量生成脚本
```

## 如何修改内容

### 新增或修改角色

编辑 `js/characters-data.js`，在 `characters` 数组中添加或修改角色信息，然后运行：

```bash
node scripts/generate-characters.js
```

脚本会根据数据自动生成 / 更新 `characters/` 目录下的所有角色详情页。

### 修改版本剧情

编辑 `js/versions-data.js`，在 `versions` 数组中添加或修改版本信息，`versions.html` 会自动读取最新数据。

### 修改样式

编辑 `css/style.css`，所有页面的颜色、布局、动画均集中管理。

## 技术栈

- HTML5 + CSS3 + 原生 JavaScript（无框架依赖）
- 响应式布局，适配桌面端与移动端
- 部署于 GitHub Pages，免费托管

## 本地预览

在项目根目录启动本地服务器：

```bash
python -m http.server 8080
```

浏览器打开 `http://localhost:8080` 即可预览。

## 部署

网站已通过 GitHub Pages 部署，仓库地址：

```
https://github.com/elysia0618/yuanshen
```

推送代码到 `main` 分支后，GitHub Pages 会在约 1 分钟内自动更新。

## 收录角色一览

### 基础角色（15 位）

旅行者 · 安柏 · 凯亚 · 丽莎 · 迪卢克 · 温迪 · 可莉 · 刻晴 · 甘雨 · 胡桃 · 魈 · 钟离 · 雷电将军 · 神里绫华 · 纳西妲

### 限定角色（15 位）

枫原万叶 · 宵宫 · 神里绫人 · 夜兰 · 荒泷一斗 · 提纳里 · 赛诺 · 妮露 · 流浪者 · 艾尔海森 · 迪希雅 · 白术 · 芙宁娜 · 那维莱特 · 莱欧斯利

## License

本项目仅供学习交流使用，角色与剧情版权归 miHoYo / HoYoverse 所有。
