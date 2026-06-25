/** 站点基础配置 */
export const site = {
  name: "Typotech",
  description:
    "Typotech — 排版驱动的技术博客模板。",
  url:
    process.env.NEXT_PUBLIC_SITE_URL || "https://typotech.dev",

  /** 首页简介（非 SEO description，约 2—3 句） */
  intro:
    "Typotech 是一套排版驱动的技术博客模板——设计令牌驱动全局样式、明暗主题自适应、MDX 组件混写。Fork → Vercel，十分钟上线。",

  /** HTML lang 属性 支持 zh-CN 与 en-US */
  lang: "zh-CN",

  /** 首页 Banner 图片 */
  banner: "/images/banner.svg",
} as const;

/** 主题色 (design.yaml §typography.color)
 *
 * ⚠️ theme.light 值由 layout.tsx themeCSS() 注入为内联 <style>，
 * 作为 :root 默认 CSS 变量。theme.dark 的实际生效值硬编码在
 * app/globals.css :root.dark {} 块中。修改深色值时要同时更新两处，
 * 否则 globals.css 中的硬编码值会覆盖此处的声明。
 */
export const theme = {
  light: {
    ink:        "#1D1D1F",   // primary → title / body
    inkSecondary: "#6E6E73", // secondary → description / metadata
    inkTertiary:  "#86868B", // tertiary → caption / disabled
    accent:       "#0071E3", // accent → link / interactive
    paper:        "#FFFFFF", // background
    subtle:       "#F5F5F7", // light background (code bg, tag bg)
    border:       "#E5E5EA", // borders
    // Shiki 代码高亮 token 色
    shiki: {
      text:             "#1D1D1F",
      constant:         "#0071E3",
      string:           "#2d7844",
      stringExpression: "#2d7844",
      comment:          "#86868B",
      keyword:          "#cc3a1a",
      function:         "#0071E3",
      parameter:        "#6E6E73",
      punctuation:      "#86868B",
      link:             "#0071E3",
    },
  },
  dark: {
    ink:          "#F5F5F7",
    inkSecondary: "#A1A1A6",
    inkTertiary:  "#86868B",
    accent:       "#2997FF",
    paper:        "#000000",
    subtle:       "#1C1C1E",
    border:       "#38383A",
    shiki: {
      text:             "#F5F5F7",
      constant:         "#2997FF",
      string:           "#7dbe90",
      stringExpression: "#7dbe90",
      comment:          "#86868B",
      keyword:          "#f06050",
      function:         "#2997FF",
      parameter:        "#A1A1A6",
      punctuation:      "#86868B",
      link:             "#2997FF",
    },
  },
} as const;

/** 页脚链接 */
export const footerLinks = [
  { label: "GitHub", href: "https://github.com/hongyzhou" },
  { label: "RSS", href: "/rss.xml" },
] as const;

/** 共享响应头 Cache-Control 值 */
export const CACHE_CONTROL = "s-maxage=3600, stale-while-revalidate" as const;

/** 导航 */
export const nav = {
  main: [{ label: "Blog", href: "/blog" }],
} as const;
