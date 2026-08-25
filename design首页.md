
## 1. 页面结构（DOM 层级）

```
#app-root  根容器（全局约束宽度 + 居中）
 └─ .homepage  首页主体（fadeIn 进场动画）
     ├─ .home-header  标题区
     │   ├─ .home-title-row  标题行（flex 居中）
     │   │   ├─ .title-line  左侧装饰线
     │   │   ├─ h1.home-title  主标题「合成大苏轼」
     │   │   └─ .title-line  右侧装饰线
     │   └─ p.home-subtitle  副标题「— 源于「合成大西瓜」 —」
     │
     ├─ .author-note-wrapper  作者说明条
     │   ├─ .author-note-bar  左侧墨绿色条（宽 4px）
     │   └─ .author-note-box  说明正文框（虚线边框）
     │
     ├─ .entry-cards  入口卡片组（flex 居中、换行）
     │   
     │
     └─ .
         ├─ 「胜固欣然，败亦可喜」
         └─ 《观棋》
```

### 动画

`.homepage` 页面进入时触发一次 `fadeIn` 0.3s（opacity 0 → 1），无位移。

---

## 2. 全局上下文（影响首页的 body / 根容器）

### 2.1 body

| 属性 | 值 |
|---|---|
| 字体族 | `"Noto Serif SC" → "Songti SC" → "SimSun" → "STSong" → serif`（宋体优先，衬线风格） |
| 背景 | `#f5f3ef`（浅米灰，略带暖调） |
| 最小高度 | 100vh |
| 默认文字颜色 | `#2c3e2c`（墨绿） |
| 横向溢出 | `html, body { overflow-x: hidden; max-width: 100%; }`（防水平滚动条） |

### 2.2 根容器 `#app-root`

| 断点 | max-width | padding |
|---|---|---|
| 默认（基线） | 1800px，margin 0 auto 居中 | 40px 40px |
| <900px（窄屏/手机） | 100%（无最大宽度） | 36px 28px |
| 900–1399px（平板/两列） | 100% | 40px 80px |
| ≥1400px（桌面三列） | 不限（继承 1800px） | 44px 110px |
| ≤700px（小屏进一步压缩） | 100% | 28px 20px |

---

## 3. 组件规范

### 3.1 标题区 `.home-header`

- 对齐：全部元素 text-align center
- 下边距：40px

#### `.home-title-row`

- flex 水平居中，`gap: 20px`（≤700px 时 `gap: 8px`）
- 左右各一条 `.title-line`

#### `.title-line`

| 属性 | 值 |
|---|---|
| 形状 | 高度 1px 的横线 |
| 颜色 | `#b8cdb8`（浅绿边） |
| 宽度 | `flex: 0 1 100px`（最大 100px，可压缩） |
| ≤700px | `display: none`（只保留中间标题，去掉两侧线） |

#### `.home-title` 主标题

| 属性 | 默认 | ≤700px |
|---|---|---|
| 字号 | 28px | 18px |
| 字距 | 8px | 4px |
| 字重 | 700 | 700 |
| 颜色 | `#2c3e2c`（墨绿） | 同左 |
| 换行 | white-space nowrap | 同左 |

#### `.home-subtitle` 副标题

| 属性 | 默认 | ≤700px |
|---|---|---|
| 文字 | `— 填表游戏 —` | 同左 |
| 字号 | 14px | 11px |
| 字距 | 4px | 2px |
| 颜色 | `#6b866b`（次绿灰） | 同左 |
| 上边距 | 10px | 同左 |

---

### 3.2 作者说明框 `.author-note-wrapper`

- 布局：flex 左竖条 + 右文本框
- 最大宽度 640px，水平居中，`margin: 0 auto 40px`（下边距 40px）
- ≤700px：`max-width: 100%`，左右各 10px 外边距

#### `.author-note-bar` 左侧色条

| 属性 | 值 |
|---|---|
| 宽度 | 4px |
| 颜色 | `#2c3e2c`（墨绿） |
| flex | shrink 0，禁止压缩 |

#### `.author-note-box` 说明正文

| 属性 | 默认 | ≤700px |
|---|---|---|
| 背景 | `#faf9f6`（米白，比页面背景略亮） | 同左 |
| 边框 | 1px dashed `#b8cdb8`，左侧无边（与色条对接） | 同左 |
| 最小高度 | 160px | 120px |
| 内边距 | 24px 20px | 20px 16px |
| 布局 | flex 水平垂直居中 | 同左 |
| 字号 | 15px | 12px |
| 行高 | 2 | 2 |
| 字距 | 1px | 同左 |
| 换行 | white-space pre-wrap（支持换行） | 同左 |
| 对齐 | text-align center | 同左 |
| 颜色 | `#2c3e2c` | 同左 |

---

### 3.3 入口卡片组 `.entry-cards`

- flex 居中排列，`gap: 24px`，`flex-wrap: wrap`
- 下边距 44px
- ≤700px：`gap: 12px`

#### `.entry-card` 单张卡片

| 属性 | 默认 | ≤700px |
|---|---|---|
| 尺寸 | 200 × 76px | 150 × 70px |
| 背景 | `#fff` | 同左 |
| 边框 | 1px solid `#b8cdb8` | 同左 |
| 交互 | cursor pointer，transition 0.25s 全部属性 | 同左 |
| 内容溢出 | hidden | 同左 |
| hover | bg `#f5f8f4`、边框 `#4a7a52`、上移 3px、阴影 `0 2px 10px rgba(74,122,82,0.14)` | 同左 |

- 卡片结构：顶部色条 + 下方卡片体

#### `.card-deco-bar` 顶部色条

- 高度 4px，背景 `#2c3e2c`（墨绿），贯穿全卡宽度

#### `.card-body` 卡片体

- padding 8px 12px

#### `.card-title` 标题（第一行）

| 属性 | 默认 | ≤700px |
|---|---|---|
| 字号 | 15px | 13px |
| 字重 | 600 | 同左 |
| 字距 | 2px | 同左 |
| 颜色 | `#2c3e2c` | 同左 |

#### `.card-subtitle` 副标题（第二行）

| 属性 | 默认 | ≤700px |
|---|---|---|
| 字号 | 13px | 12px |
| 字距 | 1px | 同左 |
| 颜色 | `#6b866b` | 同左 |
| 上边距 | 4px | 同左 |

---

### 3.4 底部随机诗文句 `.random-poem`

- 位置：`margin: 44px 0 20px`
- 对齐：text-align center
- 行高：1.8

#### 内容行（「…」括起的句子）

| 属性 | 值 |
|---|---|
| 字号 | 12px |
| 字距 | 1px |
| 颜色 | `#6b866b`，opacity 0.7（略微灰化，不抢主视觉） |

#### `.random-poem-title` 出处标题行

| 属性 | 值 |
|---|---|
| 字号 | 11px |
| 上边距 | 4px |
| 颜色 | 继承，opacity 0.8（比正文略深一点） |

---

## 4. 返回主页链接 `.back-link`（跨页共用，附在此处）

首页没有返回按钮，但在 N选64 页中作为「← 返回主页」入口，位置位于表格页顶部。

| 属性 | 默认 | <900px | ≤700px |
|---|---|---|---|
| 颜色 | `#4a7a52` | 同左 | 同左 |
| 字号 | 默认继承 | 12px / letter-spacing 0 / nowrap / shrink 0 | 11px |
| hover | 颜色 `#2c3e2c`，文字下划线 | 同左 | 同左 |
| cursor | pointer | 同左 | 同左 |

---

## 5. 色板速查

| 用途 | 色值 | 对应变量/类 |
|---|---|---|
| 页面背景（暖米灰） | `#f5f3ef` | body background |
| 弹窗/说明框背景（米白） | `#faf9f6` | .author-note-box、.auth-box |
| 墨绿主色（最深） | `#2c3e2c` | 标题、主色条、装饰线、.home-title |
| 次绿（正文绿） | `#4a7a52` | 描述文字、链接、success Toast |
| 灰绿（次色文字） | `#6b866b` | 副标题、卡片副标、随机诗文 |
| 浅绿边（所有边框底色） | `#b8cdb8` | 虚线框、卡片边框、title-line |
| Toast warn（灰绿） | `rgba(102,128,106,0.95)` | 表单校验 Toast |
| Toast error（灰红） | `rgba(139,115,115,0.95)` | 失败类 Toast |

---

## 6. 字体速查

全站统一使用宋体族，不使用非衬线：

`"Noto Serif SC" → "Songti SC" → "SimSun" → "STSong" → serif`

字距规则：
- 主标题 8px、副标题 4px
- 说明正文 1px、卡片标题 2px、卡片副标 1px
- 小屏按比例减半压缩（不破坏标题结构）
