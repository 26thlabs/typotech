import type { MDXComponents } from "mdx/types";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import katex from "katex";
import { ObservableEmbed } from "@/components/observable-embed";
import { getHighlighter } from "@/lib/highlighter";

// ===== 工具函数 =====

/** 过滤 MDX 空白文本节点，避免 hydration 错误 */
function filterKids(children: React.ReactNode) {
  return React.Children.toArray(children).filter(
    (c) => typeof c !== "string" || c.trim()
  );
}

/** 从 React children 中递归提取纯文本（用于生成锚点 id） */
function textOf(c: React.ReactNode): string {
  if (typeof c === "string") return c;
  if (typeof c === "number") return String(c);
  if (Array.isArray(c)) return c.map(textOf).join("");
  if (React.isValidElement(c)) return textOf((c.props as any).children);
  return "";
}

// ===== 公式 =====
function InlineMath({ children }: { children: string }) {
  const html = katex.renderToString(children, { throwOnError: false, displayMode: false });
  return <span className="inline-katex" dangerouslySetInnerHTML={{ __html: html }} />;
}
function BlockMath({ children }: { children: string }) {
  const html = katex.renderToString(children, { throwOnError: false, displayMode: true });
  return <div className="my-8 overflow-x-auto text-center" dangerouslySetInnerHTML={{ __html: html }} />;
}

// ===== 自定义组件 =====
// 排版缩放参考 design.yaml typography.scale
export const components: Record<string, any> = {

  // h1 — scale.h1: 48px / 56px / bold(700) / -0.03em
  h1: (props: any) => (
    <h1
      className="font-sans text-[48px] leading-[56px] font-bold text-ink mt-0 mb-[24px] tracking-[-0.03em]"
      {...props}
    />
  ),

  // h2 — scale.h2: 36px / 44px / semibold(600) / -0.02em
  h2: ({ children, ...props }: any) => {
    const id = textOf(children)
      .replace(/[^\w一-鿿]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase()
      .slice(0, 60);
    return (
      <h2
        id={id}
        className="group relative font-sans text-[36px] leading-[44px] font-semibold text-ink mt-[48px] mb-[16px] tracking-[-0.02em] scroll-mt-24"
        {...props}
      >
        <a
          href={`#${id}`}
          className="absolute -ml-6 w-5 text-center opacity-0 group-hover:opacity-100 text-ink-tertiary hover:text-accent transition-opacity"
          aria-label="Link to this section"
        >
          #
        </a>
        {children}
      </h2>
    );
  },

  // h3 — scale.h3: 28px / 36px / semibold(600)
  h3: (props: any) => (
    <h3
      className="font-sans text-[28px] leading-[36px] font-semibold text-ink mt-[32px] mb-[12px]"
      {...props}
    />
  ),

  // h4 — scale.h4: 22px / 30px / semibold(600)
  h4: (props: any) => (
    <h4
      className="font-sans text-[22px] leading-[30px] font-semibold text-ink mt-[24px] mb-[8px]"
      {...props}
    />
  ),

  // h5 / h6 — 降级处理（design.yaml 未定义，继承 h4 比例缩小）
  h5: (props: any) => (
    <h5
      className="font-sans text-[18px] leading-[28px] font-semibold text-ink mt-[20px] mb-[6px] opacity-80"
      {...props}
    />
  ),

  // 段落 — scale.body: 18px / 32px, 段距由 prose-article 统一控制 (24px = paragraphSpacing)
  p: (props: any) => (
    <p
      className="leading-[32px]"
      {...props}
    />
  ),

  // 链接 — color.accent, font-weight: medium(500)
  a: ({ href, children, ...props }: any) => {
    const cls = "text-accent font-medium transition-colors duration-200 hover:underline";
    const isExternal = href?.startsWith("http");

    if (!href || href.startsWith("#") || isExternal) {
      return (
        <a
          href={href}
          className={cls}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...props}
        >
          {children}
          {isExternal && <span className="sr-only"> (new tab)</span>}
        </a>
      );
    }
    return <Link href={href} className={cls} {...props}>{children}</Link>;
  },

  // 加粗：bold(700)，ink 色
  strong: (props: any) => (
    <strong className="font-bold text-ink" {...props} />
  ),
  // 斜体
  em: (props: any) => (
    <em className="italic text-ink/85" {...props} />
  ),
  // 删除线
  del: (props: any) => (
    <del className="line-through decoration-[1.5px] text-ink-tertiary" {...props} />
  ),

  // 列表
  ul: (props: any) => (
    <ul
      className="my-5 list-disc list-outside pl-5 marker:text-border space-y-1.5"
      {...props}
    />
  ),
  ol: (props: any) => (
    <ol
      className="my-5 list-decimal list-outside pl-5 marker:text-ink-tertiary space-y-1.5"
      {...props}
    />
  ),
  li: (props: any) => <li className="text-ink/80 pl-1" {...props} />,

  // 引用 — scale.lead: 20px / 34px / regular(400)
  blockquote: (props: any) => (
    <blockquote
      className="font-sans text-[20px] leading-[34px] font-normal text-ink-secondary my-[32px] pl-[1em] border-l-2 border-border"
      {...props}
    />
  ),

  // 分隔线
  hr: (props: any) => (
    <hr className="my-12 border-border" {...props} />
  ),

  // 表格 — 响应式滚动容器 + 标准表格样式
  table: ({ children, ...rest }: any) => (
    <div className="mt-8 mb-0 overflow-x-auto rounded-lg border border-border">
      <table className="min-w-full text-sm" {...rest}>
        {filterKids(children)}
      </table>
    </div>
  ),
  thead: ({ children, ...rest }: any) => (
    <thead className="border-b border-border bg-subtle" {...rest}>
      {filterKids(children)}
    </thead>
  ),
  tbody: ({ children, ...rest }: any) => (
    <tbody className="divide-y divide-border" {...rest}>
      {filterKids(children)}
    </tbody>
  ),
  tr: ({ children, ...rest }: any) => (
    <tr className="even:bg-subtle" {...rest}>
      {filterKids(children)}
    </tr>
  ),
  // th — scale.caption: 14px / 24px, tracking: 0.01em
  th: (props: any) => (
    <th
      className="px-4 py-3 text-left font-sans text-[14px] leading-[24px] font-medium text-ink-secondary tracking-[0.01em] uppercase whitespace-nowrap"
      {...props}
    />
  ),
  td: (props: any) => (
    <td
      className="px-4 py-3 align-top text-[16px] leading-[28px]"
      {...props}
    />
  ),

  // 代码块外层 — 透传（由 code 组件处理高亮）
  pre: (props: any) => <>{props.children}</>,

  // 代码 — 块级用 Shiki 服务端高亮，行内样式匹配 code.inline token
  code: (props: any) => {
    const className = props.className || "";
    const match = className.match(/language-(\w+)/);
    const isBlock = match && typeof props.children === "string";

    if (isBlock) {
      const highlighter = React.use(getHighlighter());
      const html = highlighter.codeToHtml(
        (props.children as string).trimEnd(),
        { lang: match![1], theme: "css-variables" }
      );
      return (
        <div
          className="my-6 shiki-wrapper"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    // inline code — code.inline: 0.9em / weight: medium / background enabled
    return (
      <code
        className="inline rounded bg-subtle px-1.5 py-0.5 text-[0.9em] font-medium text-ink font-mono break-words"
        {...props}
      />
    );
  },

  // 图片 — 本地用 next/image 优化，外部用原生 <img> 避免 SSRF
  img: ({ src, alt, ...props }: any) => {
    if (!src) return null;
    if (src.startsWith("http")) {
      return (
        <img
          src={src}
          alt={alt || ""}
          className="my-8 rounded-lg w-full h-auto"
          loading="lazy"
          {...props}
        />
      );
    }
    return (
      <Image
        src={`/images/${src}`}
        alt={alt || ""}
        width={1200}
        height={630}
        className="my-8 rounded-lg w-full h-auto"
        sizes="(max-width: 720px) 100vw, 720px"
        {...props}
      />
    );
  },

  // <FigCaption> — 图注：居中、仅上边距，用于 <figure> 内
  FigCaption: (props: any) => (
    <span
      className="block mt-3 text-center font-sans text-[14px] leading-[24px] font-normal text-ink-tertiary tracking-[0.01em]"
      {...props}
    />
  ),

  // <Caption> — 通用标注：数据来源、注释、表注（左对齐、上下边距）
  Caption: (props: any) => (
    <span
      className="block my-3 font-sans text-[14px] leading-[24px] font-normal text-ink-tertiary tracking-[0.01em]"
      {...props}
    />
  ),

  // <Small> — scale.small: 16px / 28px, 次要内容 / 侧边注
  Small: (props: any) => (
    <small
      className="block my-2 font-sans text-[16px] leading-[28px] font-normal text-ink-secondary"
      {...props}
    />
  ),

  InlineMath,
  BlockMath,
  ObservableEmbed,
};

export function useMDXComponents(inherited: MDXComponents): MDXComponents {
  return {
    ...inherited,
    ...(components as any),
  };
}
