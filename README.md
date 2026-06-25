# Typotech

排版驱动的技术博客模板——设计令牌控制全局样式、三态主题切换、MDX 组件混写。Fork → Vercel，十分钟上线。

**demo**：[Typotech](https://typotech-beta.vercel.app/)

## 技术栈

- **Next.js 16** (App Router) + **React 19** — RSC + SSG，文章页零客户端 JS
- **MDX** (RS, GFM) — ESM metadata，Markdown + React 组件混写
- **Tailwind CSS v4** — `@theme inline` 注入设计令牌，CSS 变量回退值防白屏
- **Shiki** — CSS Variables 主题，25+ 语言服务端高亮，失败自动降级
- **KaTeX** — LaTeX 数学公式，行内 + 块级
- **ObservableHQ** — 交互式可视化嵌入（`sandbox` 加固）
- **TypeScript** — `strict: true` + `noUncheckedIndexedAccess`，type-aware ESLint
- **字体** — Inter / Fira Code / Noto Sans SC / DM Serif Display，next/font 自托管

## 特性

- **三态主题切换** — 跟随系统 / 浅色 / 深色，localStorage 持久化，零闪屏
- **CSS 变量回退** — 内联 `<style>` 失败时颜色不丢失
- **健壮的数据层** — 损坏的 MDX 文件不影响其他文章，日期/标题格式校验
- **可访问性** — 跳过导航、`<th scope>`、语义化 h5/h6、屏幕阅读器友好
- **打印优化** — 完整的 `@media print` 样式，含 KaTeX 数学公式保护

## 开始

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # 生产构建
pnpm lint     # type-aware ESLint
```

## 部署

Fork 仓库 → Vercel 导入 → 设置 `NEXT_PUBLIC_SITE_URL` 环境变量 → 完成。

## 项目结构

```
typotech/
├── app/
│   ├── blog/[slug]/page.tsx     # 文章页 (SSG) + 元数据提取
│   ├── blog/page.tsx            # 文章目录
│   ├── tags/[tag]/page.tsx      # 标签筛选
│   ├── layout.tsx               # 根布局 + 字体 + 主题注入 + 安全内联脚本
│   ├── globals.css              # 设计令牌 + 排版 + 暗色模式 + 打印样式
│   └── page.tsx                 # 首页 Banner + 简介 + 标签入口
├── components/
│   ├── header.tsx               # 导航栏 + 主题切换按钮
│   ├── footer.tsx               # 页脚（年份无 hydration mismatch）
│   ├── theme-toggle.tsx         # 三态主题切换（system / light / dark）
│   ├── post-list.tsx            # 文章列表（按年份降序分组）
│   ├── tag-pills.tsx            # 标签药丸（nil-safe）
│   ├── back-link.tsx            # 返回链接 / history.back 按钮
│   └── observable-embed.tsx     # ObservableHQ 嵌入（sandbox 加固）
├── content/                     # 文章 MDX（从此处写文章）
├── lib/
│   ├── site.ts                  # 站点配置（名称、主题色、导航、页脚）
│   ├── articles.ts              # 文章数据层（错误隔离、日期校验、类型安全）
│   └── highlighter.ts           # Shiki 高亮器（单例 + 失败重试）
├── public/images/               # 文章配图 + Banner
└── mdx-components.tsx           # MDX 自定义组件（Headings / Code / Image / Caption …）
```

## 写文章

在 `content/` 下创建 `.mdx` 文件：

```js
export const metadata = {
  title: '文章标题',               // 必填
  date: '2026.06.22',              // 必填 — YYYY.MM.DD
  author: 'Your Name',             // 可选
  description: '摘要',             // 可选 — SEO + RSS
  tags: ['tag1', 'tag2'],          // 可选 — 过滤非字符串项
  draft: true,                     // true = 跳过构建
}
```

正文从 `##` 开始（页头已渲染 `metadata.title` 为 h1）。图片放 `public/images/`，用 `![alt](filename.png)` 引用。详细写作规范见 `/blog/getting-started`。

## 配置

编辑 `lib/site.ts`——站点名、简介、Banner、主题色、导航、页脚，所有可定制项均在此处。

> **注意**：深色主题值同时存在于 `lib/site.ts`（声明）和 `app/globals.css`（实际生效）。修改深色值需同步更新两处。
