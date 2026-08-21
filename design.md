# 苏轼诗文作品 n 选1 — 设计风格规范

> 本文档基于 `src/styles/global.css`、`src/App.vue`、`src/components/ControlBar.vue`、`src/components/DlcPanel.vue`、`src/components/TournamentTable.vue`、`src/utils/export.js`、`index.html` 提取整理。

整体风格定位：**中式古典 + 现代极简表格**。以深绿色为主色、米色为底色、衬线字体为载体，营造文气、内敛、专注阅读的氛围；组件大量使用直角与虚线边框，仅在 hover/选中/编辑等关键状态用浅绿色高亮，避免视觉噪音。

---

## 1. 颜色体系

所有颜色均以 hex 直接量给出，主色为深森林绿 `#2c3e2c`，辅以浅米色背景与中绿点缀。

### 1.1 背景色

| 颜色 | 用途 | 说明 |
|---|---|---|
| `#f5f3ef` | `body` 页面主背景 | 米白偏暖，全局底色 |
| `#ffffff` / `#fff` | 卡片、按钮、表格单元格、输入框 | 纯白承载内容 |
| `#faf9f6` | 作者笔记框、tab 默认背景的浅版、加载框、空单元格、export 表头、作者条信息条 | 极浅米，用作"次级容器" |
| `#f0ede8` | tab 默认背景 | 偏灰米色，与 `#faf9f6` 形成层级 |
| `#fcfdfb` | `td.col-0`、`#dlcTable td` 默认背景 | 极浅绿白，第一列与 DLC 单元格底色 |
| `#f5f8f4` | hover 状态背景（卡片/单元格/按钮/DLC 单元格） | 浅绿白，悬停反馈 |
| `#eaf3ed` | `td[contenteditable="true"]`、`.champion-cell` | 中浅绿，编辑态与冠军格高亮 |
| `#e3f1e5` | `td.source-cell`、`td.col-0.source-cell`、`#dlcTable td.selected`、`.btn:active` | 略饱和浅绿，"源数据"标记色 |
| `#d4e9d7` | `td.source-cell:hover` | 源格 hover 加深 |
| `#8fae93` | `th` 主表头背景 | 中绿，承载浅色表头文字 |
| `#a3bca8` | `#dlcTable th` DLC 表头背景 | 较浅中绿，区分主表与补充表 |
| `#b8cdb8` | `th.hide-col` 隐藏列表头背景 | 灰绿，弱化隐藏状态 |

### 1.2 文字色

| 颜色 | 用途 |
|---|---|
| `#2c3e2c` | 主文字色（body、标题、卡片标题、按钮文字、单元格诗文标题、表头导出文字） |
| `#6b866b` | 副文字色（副标题、卡片副标题、tab 未选中、hint、随机诗文、隐藏列表头文字） |
| `#4a7a52` | 强调/链接色（返回链接、tab 未选中 hover、`th` 边框 hover、`td` 边框 hover、zoom-label） |
| `#4e5b4e` | 诗文内容（`.poem-content`）次级文字 |
| `#b8cdb8` | placeholder 文字色（`.filler-input::placeholder`） |
| `#faf9f6` | 表头文字色（`th`、`#dlcTable th`，搭配中绿背景） |

### 1.3 边框色

| 颜色 | 用途 |
|---|---|
| `#b8cdb8` | 主边框色：卡片、按钮、输入框、tab、btn-bar、author-note-box、loading-box、表头导出、title-line、`th` 等 |
| `#4a7a52` | 强调边框：hover、focus、`td.source-cell`、`td[contenteditable]`、`champion-cell`、`#dlcTable td.selected`、tab active 下划线 |
| `#dde7dd` | 主表 `td` 单元格分隔线 |
| `#7a9a7e` | 主表 `th` 边框 |
| `#8fae93` | DLC 表 `th` 边框 |
| `#dde3e7` | DLC 表 `td` 边框 |
| `#e5efe6` | spinner 静态环边框 |

### 1.4 状态色（遮罩 / 阴影 / 透明）

| 颜色 / 透明度 | 用途 |
|---|---|
| `rgba(44, 62, 44, 0.4)` | `.loading-mask` 全屏遮罩背景（主色 40% 透明） |
| `rgba(74, 122, 82, 0.12)` | `.entry-card:hover` 阴影色（强调色 12% 透明） |
| `opacity: 0.7` | `.random-poem` 整体弱化 |
| `opacity: 0.8` | `.random-poem-title` 标题弱化 |
| `opacity: 0.9` | `th.hide-col::after` 提示文字 |
| `opacity: 0.4` | `.zoom-btn:disabled` 禁用态弱化 |

---

## 2. 字体系统

### 2.1 字体族

- 主字体栈：`"Noto Serif SC", "Songti SC", "SimSun", "STSong", serif`
  - 优先级：思源宋体 → macOS 宋体 → Windows 宋体 → 系统宋体 → 通用 serif
  - 全部为衬线字体，营造古典文气
- 组件级回退：按钮、输入框、zoom 按钮均显式声明 `font-family: inherit`，与 body 保持一致
- `index.html` 与 `main.js` 均未显式 `@import` 网络字体，依赖系统已安装的思源宋体/系统宋体回退；`export.js` 在生成 PNG 时也使用同一字体栈
- `html { -webkit-text-size-adjust: 100%; }` 防止移动端字号自动调整

### 2.2 字号层级（桌面端）

| 字号 | 用途 |
|---|---|
| `28px` | 主页主标题 `.home-title` |
| `26px` | 导出 PNG 标题 `titleDiv` |
| `20px` | 导出表 `.export-title-row th` |
| `18px` | 表格页标题、DLC 标题 `.table-page-title` / `.dlc-title` |
| `15px` | 卡片标题 `.card-title`、作者笔记正文 `.author-note-box` |
| `14px` | 主页副标题、tab、返回链接、`.hint`、export PNG 副信息 |
| `13px` | 卡片副标题、`.btn`、`.filler-input`、主表 `th` / `td`、`.poem-title`、`#dlcTable th` |
| `12px` | `.random-poem`、`.zoom-label`、`.dlc-hint`、`#dlcTable td`、`th.hide-col::after` |
| `11px` | `.random-poem-title`、`#dlcTable td .poem-content` |
| `10px` | `th.hide-col::after` 内容（外层已缩到 10px） |

### 2.3 字重

| 字重 | 用途 |
|---|---|
| `400` (normal) | 默认正文 |
| `500` | `.btn` 普通按钮 |
| `600` | `.card-title`、`th`、`#dlcTable th`、`.tab.active` 部分、`.zoom-btn`、`.zoom-label`、`.poem-title`、`.champion-cell .poem-title` |
| `700` | `.home-title`、`.table-page-title`、`.dlc-title`、`.tab.active`、export PNG `titleDiv` |

### 2.4 字间距（letter-spacing）

古典氛围关键，广泛使用：

| 字间距 | 用途 |
|---|---|
| `8px` | 主页主标题 `.home-title` |
| `4px` | 主页副标题 `.home-subtitle`、export PNG `titleDiv` |
| `3px` | `.dlc-title`、`.export-title-row th`、`#dlcTable th` |
| `2px` | `.card-title`、`.table-page-title` |
| `1px` | `.home-subtitle`、`.btn`、`.filler-input`、`.tab`、`.back-link`、`.author-note-box`、`.random-poem`、`#dlcTable th` |
| `0` | 默认正文、`.hint`、`th` 主表头 |

### 2.5 行高

| 行高 | 用途 |
|---|---|
| `2` | `.author-note-box`（含移动端保留） |
| `1.8` | `.random-poem` |
| `1.4` | `.zoom-btn` |
| `1.3` | `td`、`.poem-title`、`.poem-content`、`#dlcTable td` |
| `1.2` | 移动端 `th` / `td` |
| `1` | 默认 |

---

## 3. 间距系统

### 3.1 页面级

| 项 | 值 |
|---|---|
| 全局盒模型 | `* { margin: 0; padding: 0; box-sizing: border-box; }` |
| `#app-root` 最大宽度 | `1000px`，居中（`margin: 0 auto`） |
| `#app-root` padding（桌面） | `30px 20px` |
| `#app-root` padding（≤700px） | `16px 8px` |
| `body` 最小高度 | `100vh` |

### 3.2 组件内边距（padding）

| 组件 | padding |
|---|---|
| `.card-body` | `8px 10px` |
| `.author-note-box` | `24px 20px` |
| `.btn` | `6px 14px`（移动端 `5px 8px`） |
| `.filler-input` | `5px 8px` |
| `.btn-bar` | `8px 10px` |
| `.tab` | `8px 20px`（移动端 `6px 12px`） |
| `th` 主表头 | `1px 1px` |
| `td` 主表单元格 | `1px 1px` |
| `#dlcTable th` | `5px 4px`（移动端 `1px 2px`） |
| `#dlcTable td` | `3px 4px`（移动端 `1px 2px`） |
| `.zoom-bar` | `2px 6px` |
| `.zoom-btn` | `2px 8px` |
| `.loading-box` | `24px 32px` |
| `.export-title-row th` | `8px` |
| export PNG `titleDiv` | `16px 10px 8px` |
| export PNG `subDiv` | `6px 10px` |
| export PNG 容器 | `16px` |

### 3.3 组件间距（margin / gap）

| 位置 | 值 |
|---|---|
| `.home-header` 下 | `36px` |
| `.author-note-wrapper` 下 | `36px` |
| `.entry-cards` 下 | `40px` |
| `.table-page-header` 下 | `16px` |
| `.table-title-row` 下 | `8px` |
| `.btn-bar` 下 | `8px` |
| `.dlc-section` 上 | `12px`（移动端 `10px`） |
| `.dlc-title-row` 下 | `4px` |
| `.dlc-title-row` padding-bottom | `3px` |
| `.home-title-row` gap | `20px`（移动端 `8px`） |
| `.entry-cards` gap | `24px`（移动端 `12px`） |
| `.table-page-header` gap | `24px`（移动端 column 改 `8px`） |
| `.table-title-row` gap | `10px` |
| `.btn-bar` gap | `8px` |
| `.toolbar-right` gap | `6px` |
| `.zoom-bar` gap | `4px` |
| `.dlc-title-row` gap | `10px` |
| `.dlc-title-left` gap | `8px` |
| `.home-subtitle` margin-top | `10px` |
| `.card-subtitle` margin-top | `4px` |
| `.poem-title` margin-bottom | `2px`（移动端 `0`） |
| `.random-poem` margin | `40px 0 20px` |

### 3.4 尺寸（宽高）

| 组件 | 尺寸 |
|---|---|
| `.entry-card` | `190px × 70px`（移动端 `150px × 70px`） |
| `.title-line` | `height: 1px; flex: 0 1 80px`（移动端隐藏） |
| `.author-note-bar` | `width: 4px` |
| `.author-note-box` | `min-height: 160px`（移动端 `120px`），`max-width: 600px` |
| `.title-deco-bar` | `4px × 22px` |
| `.card-deco-bar` | `height: 4px` |
| `.filler-input` | `width: 180px`（移动端 `100%`） |
| `.table-wrapper` | `max-height: 70vh` |
| `.dlc-wrapper` | `max-height: 40vh` |
| `.spinner` | `32px × 32px` |
| `.zoom-btn` | `min-width: 24px` |
| `.zoom-label` | `min-width: 36px` |

---

## 4. 组件规范

### 4.1 按钮 `.btn`

| 状态 | 样式 |
|---|---|
| 默认 | `background: #fff; color: #2c3e2c; border: 1px solid #b8cdb8; padding: 6px 14px; font-size: 13px; font-weight: 500; letter-spacing: 1px; cursor: pointer; transition: all 0.2s; font-family: inherit` |
| hover | `background: #f5f8f4; border-color: #4a7a52` |
| active | `background: #e3f1e5` |
| 变体 | `.btn-csv` / `.btn-png` / `.btn-reset` / `.btn-upload` 均为白底深绿字，无显著差异；`.btn-upload` 有 `:disabled` 时显示"上传中..."文字 |
| 移动端 | `padding: 5px 8px; font-size: 11px; flex: 1; text-align: center` |

### 4.2 Zoom 控件 `.zoom-bar` / `.zoom-btn` / `.zoom-label`

| 元素 | 样式 |
|---|---|
| `.zoom-bar` | `display: inline-flex; align-items: center; gap: 4px; background: #fff; border: 1px solid #b8cdb8; padding: 2px 6px` |
| `.zoom-btn` | `padding: 2px 8px; font-size: 13px; min-width: 24px; background: #faf9f6; color: #2c3e2c; border: 1px solid #b8cdb8; font-weight: 600; line-height: 1.4`（使用 `!important` 覆盖 `.btn` 默认） |
| `.zoom-btn:hover:not(:disabled)` | `background: #f5f8f4; border-color: #4a7a52` |
| `.zoom-btn:disabled` | `opacity: 0.4; cursor: not-allowed` |
| `.zoom-label` | `font-size: 12px; color: #4a7a52; font-weight: 600; min-width: 36px; text-align: center` |
| 范围 | zoom 数值 `0.4 ~ 2`，步进 `0.1`，通过 `style.zoom` 应用到 `#tournamentTable` / `#dlcTable` |
| 移动端 | `.zoom-bar` 占满 `flex: 1`，居中 |

### 4.3 输入框 `.filler-input`

| 状态 | 样式 |
|---|---|
| 默认 | `padding: 5px 8px; border: 1px solid #b8cdb8; font-size: 13px; background: #fff; color: #2c3e2c; width: 180px; outline: none; font-family: inherit` |
| placeholder | `color: #b8cdb8` |
| focus | `border-color: #4a7a52` |
| 移动端 | `width: 100%` |
| 限制 | `maxlength="20"`，placeholder "填表人" |

### 4.4 工具栏 `.btn-bar`

| 属性 | 值 |
|---|---|
| 布局 | `display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap` |
| 容器 | `background: #faf9f6; border: 1px solid #b8cdb8; padding: 8px 10px; margin-bottom: 8px` |
| 右侧组 `.toolbar-right` | `display: flex; align-items: center; gap: 6px; flex-wrap: wrap` |
| 移动端 | `flex-direction: column; align-items: stretch`，`.toolbar-right` `width: 100%; justify-content: space-between` |

### 4.5 卡片 `.entry-card`

| 部分 | 样式 |
|---|---|
| 容器 | `width: 190px; height: 70px; background: #fff; border: 1px solid #b8cdb8; cursor: pointer; overflow: hidden; transition: all 0.25s ease` |
| 装饰条 `.card-deco-bar` | `height: 4px; background: #2c3e2c` |
| body | `padding: 8px 10px` |
| 标题 | `font-size: 15px; color: #2c3e2c; font-weight: 600; letter-spacing: 2px` |
| 副标题 | `font-size: 13px; color: #6b866b; margin-top: 4px; letter-spacing: 1px` |
| hover | `background: #f5f8f4; border-color: #4a7a52; transform: translateY(-3px); box-shadow: 0 2px 8px rgba(74, 122, 82, 0.12)` |
| 移动端 | `width: 150px; height: 70px`，标题 `13px`，副标题 `12px` |

### 4.6 页签 `.tab`

| 状态 | 样式 |
|---|---|
| 默认 | `padding: 8px 20px; font-size: 14px; background: #f0ede8; color: #6b866b; border: 1px solid #b8cdb8; letter-spacing: 1px; cursor: pointer; transition: all 0.2s` |
| hover（非 active） | `background: #faf9f6; color: #4a7a52` |
| active | `background: #fff; color: #2c3e2c; font-weight: 700; border-bottom: 2px solid #4a7a52` |
| 容器 `.tabs` | `display: flex; gap: 0`（页签之间无 gap，靠边框贴合） |
| 移动端 | `padding: 6px 12px; font-size: 12px; flex: 1; text-align: center`，`.tabs` 占 `width: 100%` |

### 4.7 主表 `#tournamentTable`

| 元素 | 样式 |
|---|---|
| `.table-wrapper` | `overflow-x: auto; overflow-y: auto; max-height: 70vh; background: #fff; border: 1px dashed #b8cdb8; padding: 1px` |
| `table` | `border-collapse: separate; border-spacing: 0; min-width: 0; width: max-content; table-layout: fixed` |
| `th` 默认 | `background: #8fae93; color: #faf9f6; padding: 1px 1px; text-align: center; font-weight: 600; font-size: 13px; border: 1px solid #7a9a7e; position: sticky; top: 0; z-index: 10; letter-spacing: 0; cursor: pointer; user-select: none; word-wrap: break-word; word-break: break-all` |
| `th.col-0` | `font-size: 12px` |
| `th.col-1` | `font-size: 13px` |
| `th.hide-col` | `background: #b8cdb8; color: #6b866b`，并 `::after { content: '（隐藏内容）'; margin-left: 6px; font-size: 10px; opacity: 0.9 }` |
| `td` 默认 | `border: 1px solid #dde7dd; padding: 1px 1px; text-align: center; vertical-align: middle; font-size: 13px; line-height: 1.3; background: #fff; transition: background 0.2s; cursor: pointer; word-wrap: break-word; word-break: break-all` |
| `td.col-0` | `font-size: 11px; background: #fcfdfb`（`.poem-title 12px`、`.poem-content 11px`） |
| `td.col-1` | `font-size: 12px`（`.poem-title 13px`、`.poem-content 11px`） |
| `td:hover` | `background: #f5f8f4; border-color: #4a7a52` |
| `td.empty` | `background: #faf9f6; cursor: default`，hover 不变 |
| `td.source-cell` | `background: #e3f1e5`，hover `#d4e9d7` |
| `td[contenteditable="true"]` | `background: #eaf3ed; border-color: #4a7a52; outline: none; cursor: text` |
| `.champion-cell`（最后一列） | `background: #eaf3ed; border-color: #4a7a52` |
| `.poem-title` | `font-weight: 600; color: #2c3e2c; margin-bottom: 2px; display: block; font-size: 14px; line-height: 1.3` |
| `.poem-content` | `color: #4e5b4e; font-size: 12px; line-height: 1.3; display: block` |
| `.hide-poem-content`（tr/td/table） | `.poem-content { display: none }` |
| 导出表头 `.export-title-row th` | `background: #faf9f6; color: #2c3e2c; border: 1px solid #b8cdb8; font-size: 20px; letter-spacing: 3px; padding: 8px` |
| 导出表头 `.export-header-row th` | `background: #faf9f6; color: #2c3e2c; border: 1px solid #b8cdb8` |

### 4.8 DLC 表 `#dlcTable`

| 元素 | 样式 |
|---|---|
| `.dlc-wrapper` | `overflow-x: auto; background: #fff; border: 1px dashed #b8cdb8; padding: 1px; max-height: 40vh; overflow-y: auto` |
| `#dlcTable` | `width: max-content; min-width: 0; border-collapse: separate; border-spacing: 0; table-layout: fixed` |
| `th` | `background: #a3bca8; color: #faf9f6; padding: 5px 4px; font-size: 12px; border: 1px solid #8fae93; letter-spacing: 1px; position: sticky; top: 0; z-index: 5; word-wrap: break-word; word-break: break-all` |
| `td` 默认 | `border: 1px solid #dde3e7; padding: 3px 4px; vertical-align: middle; text-align: center; font-size: 11px; line-height: 1.3; background: #fcfdfb; cursor: pointer; transition: all 0.15s` |
| `td.selected` | `background: #e3f1e5; border-color: #4a7a52; box-shadow: inset 0 0 0 1px #4a7a52`（双线效果） |
| `td:hover` | `background: #f5f8f4; border-color: #4a7a52` |
| `td .poem-title` | `font-size: 12px; margin-bottom: 2px` |
| `td .poem-content` | `font-size: 11px` |
| 空格（`idx >= length`） | `background: #faf9f6; cursor: default`（由 `cellStyle` 内联设置） |

### 4.9 作者笔记 `.author-note-wrapper`

| 元素 | 样式 |
|---|---|
| 容器 | `display: flex; max-width: 600px; margin: 0 auto 36px` |
| 左装饰条 `.author-note-bar` | `width: 4px; background: #2c3e2c; flex-shrink: 0` |
| 内容框 `.author-note-box` | `flex: 1; background: #faf9f6; border: 1px dashed #b8cdb8; border-left: none; min-height: 160px; padding: 24px 20px; display: flex; align-items: center; justify-content: center; color: #2c3e2c; font-size: 15px; line-height: 2; letter-spacing: 1px; white-space: pre-wrap; text-align: center` |
| 移动端 | `max-width: 100%; margin-left: 10px; margin-right: 10px`，内容框 `min-height: 120px; font-size: 12px; padding: 20px 16px` |

### 4.10 加载遮罩 `.loading-mask`

| 元素 | 样式 |
|---|---|
| 遮罩 | `position: fixed; inset: 0; background: rgba(44, 62, 44, 0.4); display: none; align-items: center; justify-content: center; z-index: 9999` |
| 激活 `.active` | `display: flex` |
| 加载框 `.loading-box` | `background: #faf9f6; padding: 24px 32px; border: 1px solid #b8cdb8; text-align: center; color: #2c3e2c` |
| spinner | `width: 32px; height: 32px; border: 3px solid #e5efe6; border-top: 3px solid #4a7a52; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 12px` |
| 动画 `spin` | `0% rotate(0) → 100% rotate(360deg)` |

### 4.11 标题行装饰

| 元素 | 样式 |
|---|---|
| `.home-title-row` | `display: flex; align-items: center; justify-content: center; gap: 20px` |
| `.title-line` | `height: 1px; background: #b8cdb8; flex: 0 1 80px`（移动端 `display: none`） |
| `.home-title` | `font-size: 28px; color: #2c3e2c; letter-spacing: 8px; font-weight: 700; white-space: nowrap` |
| `.home-subtitle` | `text-align: center; color: #6b866b; font-size: 14px; letter-spacing: 4px; margin-top: 10px` |
| `.table-title-row` / `.dlc-title-row` | `display: flex; align-items: center; gap: 10px` |
| `.title-deco-bar` / `.author-note-bar` / `.card-deco-bar` | 共享 `background: #2c3e2c` 主色装饰条；竖条 `4px × 22px`，横条 `height: 4px` |

### 4.12 返回链接 `.back-link`

| 状态 | 样式 |
|---|---|
| 默认 | `color: #4a7a52; cursor: pointer; font-size: 14px; text-decoration: none; white-space: nowrap; letter-spacing: 1px` |
| hover | `color: #2c3e2c; text-decoration: underline` |

### 4.13 随机诗文 `.random-poem`

| 元素 | 样式 |
|---|---|
| 容器 | `text-align: center; color: #6b866b; opacity: 0.7; font-size: 12px; letter-spacing: 1px; margin: 40px 0 20px; line-height: 1.8` |
| 标题 `.random-poem-title` | `font-size: 11px; margin-top: 4px; opacity: 0.8` |

---

## 5. 响应式断点及移动端调整

### 5.1 断点

唯一断点：**`max-width: 700px`**，移动优先策略不存在，仅对 ≤700px 设备做下沉式调整。

### 5.2 移动端调整一览

**布局调整：**
- `#app-root` padding：`30px 20px` → `16px 8px`
- `.table-page-header`：横排 `gap: 24px` → `flex-direction: column; gap: 8px`
- `.btn-bar`：横排 → `flex-direction: column; align-items: stretch`
- `.filler-input`：`180px` → `100%`
- `.toolbar-right`：`width: 100%; justify-content: space-between`
- `.tabs`：`width: 100%`，每个 tab `flex: 1; text-align: center`
- `.table-title-row`：`flex-wrap: wrap`
- `.hint`：`margin-left: 0; width: 100%; font-size: 10px`
- `.zoom-bar`：`flex: 1; justify-content: center`
- `.btn`：`padding: 5px 8px; font-size: 11px; flex: 1; text-align: center`

**字号压缩（关键）：**
- `.home-title` 28px → 18px，letter-spacing 8px → 4px
- `.home-subtitle` 14px → 11px，letter-spacing 4px → 2px
- `.author-note-box` 15px → 12px，padding `24px 20px` → `20px 16px`
- `.card-title` 15px → 13px，`.card-subtitle` 13px → 12px
- `th` / `td` 默认 13px → 9px，letter-spacing `0`
- `td.col-0` 11px → 8.3px
- `th.col-1, td.col-1` → 8.7px
- `.poem-title` 14px → 10px，`.poem-content` 12px → 8.8px
- `td.col-0 .poem-title` 12px → 9px，`.poem-content` 11px → 8px
- `td.col-1 .poem-title` 13px → 9.6px，`.poem-content` 11px → 8.5px
- `.dlc-title` 18px → 12px，letter-spacing 3px → 2px
- `.dlc-hint` 12px → 9px，占 `width: 100%`
- `#dlcTable td, th` padding `5px 4px / 3px 4px` → `1px 2px`
- `#dlcTable th` 12px → 9px
- `#dlcTable td .poem-title` 12px → 9px，`.poem-content` 11px → 8px

**间距/尺寸调整：**
- `.home-title-row` gap `20px` → `8px`
- `.title-line` 隐藏（`display: none`）
- `.entry-cards` gap `24px` → `12px`
- `.entry-card` width `190px` → `150px`
- `.author-note-wrapper` `max-width: 600px` → `100%`，加 `margin: 0 10px`
- `.author-note-box` `min-height: 160px` → `120px`
- `.dlc-section` margin-top `12px` → `10px`
- `.dlc-title-row` `flex-wrap: wrap`
- 行高 `1.3` → `1.2`

**保持不变：**
- `.table-wrapper` `max-height: 70vh`
- `.dlc-wrapper` `max-height: 40vh`
- 颜色体系完全不变

---

## 6. 其他设计原则

### 6.1 圆角策略

- **几乎全部直角**：所有卡片、按钮、表格、输入框、tab、加载框均无 `border-radius`，呼应古典方正美学
- **唯一例外**：`.spinner` 使用 `border-radius: 50%` 实现圆形旋转指示器
- 导出 PNG 时强制 `th { borderRadius: '0' }`，保证导出图与界面一致

### 6.2 阴影策略

- **极简克制**：默认状态无阴影
- **仅 hover 一次浮现**：`.entry-card:hover` → `box-shadow: 0 2px 8px rgba(74, 122, 82, 0.12)`，Y 偏移 2px，模糊 8px，主色 12% 透明度，配合 `transform: translateY(-3px)` 形成轻微浮起
- **选中态用 inset 阴影**：`#dlcTable td.selected` → `box-shadow: inset 0 0 0 1px #4a7a52`，与 border 叠加形成双线选中效果
- **无其他阴影使用**：表格、按钮、卡片默认态均无边框外阴影

### 6.3 装饰元素

- **横线分隔** `.title-line`：`height: 1px; background: #b8cdb8`，配合主页标题左右两侧
- **竖向装饰条**（`.author-note-bar` / `.title-deco-bar` / `.card-deco-bar`）：统一使用主色 `#2c3e2c`，`width: 4px`，作为标题/卡片的左侧视觉锚点
- **虚线边框**：`.table-wrapper` / `.dlc-wrapper` / `.author-note-box` 均使用 `1px dashed #b8cdb8`，与实线组件形成层级区分（容器框为虚线，内容框为实线）
- **sticky 表头**：主表 `th { position: sticky; top: 0; z-index: 10 }`，DLC 表 `th { z-index: 5 }`，长表格滚动时表头常驻
- **隐藏列表头伪元素**：`th.hide-col::after { content: '（隐藏内容）'; margin-left: 6px; font-size: 10px; opacity: 0.9 }`，弱化提示
- **cell 双线选中**：border + inset box-shadow 组合
- **首行装饰**：`th` 与 `td` 的 `position: sticky` 配合 `z-index` 分层

### 6.4 动画与过渡

| 元素 | 动画 |
|---|---|
| `.homepage` / `.table-page` | `animation: fadeIn 0.3s ease`（`opacity 0 → 1`） |
| `.entry-card` | `transition: all 0.25s ease` |
| `.btn` | `transition: all 0.2s` |
| `.tab` | `transition: all 0.2s` |
| `td` | `transition: background 0.2s` |
| `#dlcTable td` | `transition: all 0.15s`（更快） |
| `.spinner` | `animation: spin 1s linear infinite` |
| `@keyframes fadeIn` | `from { opacity: 0 } to { opacity: 1 }` |
| `@keyframes spin` | `0% { rotate(0deg) } 100% { rotate(360deg) }` |

### 6.5 表格导出 PNG 颜色配置（`export.js`）

导出 PNG 时通过 `html2canvas` 重新构造容器，颜色与界面保持一致：

| 元素 | 颜色 / 样式 |
|---|---|
| `exportContainer` 背景 | `#f5f3ef`（与 `body` 一致） |
| `titleDiv` | `color: #2c3e2c; background: #faf9f6; font-size: 26px; font-weight: 700; letter-spacing: 4px; padding: 16px 10px 8px; border-bottom: 1px solid #b8cdb8; font-family: 主字体栈` |
| `subDiv` | `color: #6b866b; background: #faf9f6; padding: 6px 10px; font-size: 14px; font-weight: 400; border-bottom: 1px solid #b8cdb8; font-family: 主字体栈` |
| `subDiv` 中部 span | `font-size: 11px`（公众号信息） |
| `html2canvas` | `backgroundColor: '#ffffff'; scale: 2; useCORS: true; logging: false` |
| `mainClone` 表头 | 强制 `position: static`、`borderRadius: 0` |
| 文件名 | `{填表人}_sushishiwen_{mode}_{yyyyMMdd_HHmm}.png` |

### 6.6 字体引入说明

- `index.html` 与 `main.js` **均未显式引入网络字体**，依赖用户系统已安装的 Noto Serif SC / Songti SC / SimSun / STSong
- 若需保证字体一致性，应在 `index.html` 中加入：
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&display=swap" rel="stylesheet">
  ```
- 当前导出 PNG 时也使用同一字体栈，受系统字体可用性影响

### 6.7 设计语言小结

1. **主色克制**：仅深绿 `#2c3e2c` 与中绿 `#4a7a52` 两个主色，其余皆为其浅化变体
2. **层级靠底色**：通过 `#fff → #faf9f6 → #f0ede8 → #fcfdfb` 四级白/米底色建立层级，而非依赖阴影
3. **古典字距**：标题类元素普遍使用 2–8px letter-spacing，强化衬线字体的文学气质
4. **直角与虚线**：组件主体直角，容器框用虚线，避免现代圆角，强化"册页/卷轴"质感
5. **状态色一致**：所有 hover/focus/selected/编辑态统一映射到 `#4a7a52`（边框）+ `#f5f8f4`/`#eaf3ed`/`#e3f1e5`（背景）三档浅绿
6. **移动端字号极限压缩**：最小到 8px，仍保持衬线字体可读性，是本项目的特殊取舍
