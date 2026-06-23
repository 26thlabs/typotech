# Typotech

排版驱动的技术博客模板——设计令牌控制全局样式、明暗主题自动跟随系统、MDX 组件混写。Fork → Vercel，十分钟上线。

**demo**：[Typotech](https://typotech-beta.vercel.app/)

## 技术栈

- **Next.js 16** (App Router) + **React 19** — RSC + SSG，文章页零客户端 JS
- **MDX** (RS, GFM) — ESM metadata，Markdown + React 组件混写
- **Tailwind CSS v4** — `@theme inline` 注入设计令牌
- **Shiki** — CSS Variables 主题，代码块隐藏滚动条保留原始格式
- **KaTeX** (react-katex) — 数学公式
- **ObservableHQ** — 交互式可视化嵌入

## 开始

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # 生产构建
```

## 部署

Fork 仓库 → Vercel 导入 → 设置 `NEXT_PUBLIC_SITE_URL` 环境变量 → 完成。

## 项目结构

```
typotech/
├── app/
│   ├── blog/[slug]/page.tsx     # 文章页 (SSG)
│   ├── blog/page.tsx            # 文章目录
│   ├── tags/[tag]/page.tsx      # 标签筛选
│   ├── layout.tsx               # 根布局 + 字体 + 主题注入
│   ├── globals.css              # 设计令牌 + 排版 + 暗色模式
│   └── page.tsx                 # 首页 Banner + 简介
├── components/
│   ├── header.tsx               # 导航栏
│   ├── footer.tsx               # 页脚
│   ├── post-list.tsx            # 文章列表
│   ├── tag-pills.tsx            # 标签药丸
│   └── observable-embed.tsx     # ObservableHQ 嵌入
├── content/                     # 文章 MDX
├── lib/
│   ├── site.ts                  # 站点配置
│   ├── articles.ts              # 文章数据层
│   └── highlighter.ts           # Shiki 语言注册
├── public/images/               # 文章配图 + Banner
└── mdx-components.tsx           # MDX 自定义组件
```

## 写文章

在 `content/` 下创建 `.mdx` 文件：

```js
export const metadata = {
  title: '文章标题',
  date: '2026.06.22',
  author: 'Your Name',
  description: '摘要',
  tags: ['tag1', 'tag2'],
  draft: true,   // true = 跳过构建
}
```

正文从 `##` 开始（页头已渲染 `metadata.title` 为 h1）。图片放 `public/images/`，用 `![alt](filename.png)` 引用。详细写作规范见 `/blog/getting-started`。

## 配置

编辑 `lib/site.ts`——站点名、简介、Banner、主题色、导航、页脚，所有可定制项均在此处。
