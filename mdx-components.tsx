import type { MDXComponents } from "mdx/types";
import React from "react";
import Link from "next/link";
import Image from "next/image";
// @ts-ignore — react-katex is pure JS, no type declarations
import { InlineMath, BlockMath as KaTeXBlock } from "react-katex";
import { ObservableEmbed } from "@/components/observable-embed";
import { getHighlighter } from "@/lib/highlighter";
import { filterKids, textOf } from "@/lib/mdx-utils";

// ===== 公式 =====
function BlockMath({ children }: { children: string }) {
  return (
    <div className="my-6 sm:my-8 overflow-x-auto text-center">
      <KaTeXBlock math={children} />
    </div>
  );
}

// ===== 自定义组件 =====
// 排版缩放参考 design.yaml typography.scale
export const components: MDXComponents = {

  // h1 — mobile: 28px/36px, desktop: 48px/56px, bold(700), -0.03em
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="font-sans text-[28px] leading-[36px] sm:text-[48px] sm:leading-[56px] font-bold text-ink mt-0 mb-[16px] sm:mb-[24px] tracking-[-0.03em]"
      {...props}
    />
  ),

  // h2 — mobile: 24px/32px, desktop: 36px/44px, semibold(600), -0.02em
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = textOf(children)
      .replace(/[^\w一-鿿]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase()
      .slice(0, 60);
    return (
      <h2
        id={id}
        className="group relative font-sans text-[24px] leading-[32px] sm:text-[36px] sm:leading-[44px] font-semibold text-ink mt-[32px] sm:mt-[48px] mb-[12px] sm:mb-[16px] tracking-[-0.02em] scroll-mt-24"
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

  // h3 — mobile: 20px/28px, desktop: 28px/36px, semibold(600)
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="font-sans text-[20px] leading-[28px] sm:text-[28px] sm:leading-[36px] font-semibold text-ink mt-[24px] sm:mt-[32px] mb-[8px] sm:mb-[12px]"
      {...props}
    />
  ),

  // h4 — mobile: 18px/26px, desktop: 22px/30px, semibold(600)
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className="font-sans text-[18px] leading-[26px] sm:text-[22px] sm:leading-[30px] font-semibold text-ink mt-[20px] sm:mt-[24px] mb-[6px] sm:mb-[8px]"
      {...props}
    />
  ),

  // h5 / h6 — 保持语义化标题元素，退化为正文加粗样式
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5 className="leading-[28px] sm:leading-[32px] font-semibold text-ink" {...props} />
  ),
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6 className="leading-[28px] sm:leading-[32px] font-semibold text-ink" {...props} />
  ),

  // 段落 — mobile: 16px/28px, desktop: 18px/32px, 段距由 prose-article 统一控制
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="leading-[28px] sm:leading-[32px]" {...props} />
  ),

  // 链接 — color.accent, font-weight: medium(500)
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
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
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-bold text-ink" {...props} />
  ),
  // 斜体
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic text-ink/85" {...props} />
  ),
  // 删除线
  del: (props: React.DelHTMLAttributes<HTMLModElement>) => (
    <del className="line-through decoration-[1.5px] text-ink-tertiary" {...props} />
  ),

  // 列表 — mobile: my-4, desktop: my-5
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-4 sm:my-5 list-disc list-outside pl-5 marker:text-border space-y-1.5" {...props} />
  ),
  ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol className="my-4 sm:my-5 list-decimal list-outside pl-5 marker:text-ink-tertiary space-y-1.5" {...props} />
  ),
  li: (props: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className="text-ink/80 pl-1" {...props} />
  ),

  // 引用 — mobile: 17px/28px, desktop: 20px/34px, regular(400)
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="font-sans text-[17px] leading-[28px] sm:text-[20px] sm:leading-[34px] font-normal text-ink-secondary my-[24px] sm:my-[32px] pl-[1em] border-l-2 border-border"
      {...props}
    />
  ),

  // 分隔线 — mobile: my-8, desktop: my-12
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-8 sm:my-12 border-border" {...props} />
  ),

  // 表格 — 响应式滚动容器 + 标准表格样式
  table: ({ children, ...rest }: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="table-wrapper mt-6 sm:mt-8 mb-0 overflow-x-auto rounded-lg border border-border">
      <table className="min-w-full text-sm" {...rest}>
        {filterKids(children)}
      </table>
    </div>
  ),
  thead: ({ children, ...rest }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="border-b border-border bg-subtle" {...rest}>
      {filterKids(children)}
    </thead>
  ),
  tbody: ({ children, ...rest }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className="divide-y divide-border" {...rest}>
      {filterKids(children)}
    </tbody>
  ),
  tr: ({ children, ...rest }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="even:bg-subtle" {...rest}>
      {filterKids(children)}
    </tr>
  ),
  // th — mobile: 13px/20px, desktop: 14px/24px, tracking: 0.01em
  th: (props: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
    <th
      scope="col"
      className="px-3 sm:px-4 py-2 sm:py-3 text-left font-sans text-[13px] leading-[20px] sm:text-[14px] sm:leading-[24px] font-medium text-ink-secondary tracking-[0.01em] uppercase whitespace-nowrap"
      {...props}
    />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
    <td
      className="px-3 sm:px-4 py-2 sm:py-3 align-top text-[14px] leading-[24px] sm:text-[16px] sm:leading-[28px]"
      {...props}
    />
  ),

  // 代码块外层 — 剥离 MDX 默认的 <pre>，避免与 Shiki 输出的 <pre> 重复嵌套
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => <>{props.children}</>,

  // 代码 — 块级用 Shiki 服务端高亮，行内样式匹配 code.inline token
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    const className = props.className || "";
    const match = className.match(/language-(\w+)/);
    const isBlock = match && typeof props.children === "string";

    if (isBlock) {
      const lang = match![1] as string;
      const code = (props.children as string).trimEnd();
      const highlighter = React.use(getHighlighter());
      let html: string;
      try {
        html = highlighter.codeToHtml(code, { lang, theme: "css-variables" });
      } catch {
        // 不支持的语言或 Shiki 内部错误 → 降级为无高亮代码块
        return (
          <div className="shiki-wrapper">
            <pre><code>{code}</code></pre>
          </div>
        );
      }
      return (
        <div
          className="shiki-wrapper"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    // inline code — code.inline: 0.9em / weight: medium / background enabled
    return (
      <code
        {...props}
        className="inline rounded bg-subtle px-1.5 py-0.5 text-[0.9em] font-medium text-ink font-mono break-words"
      />
    );
  },

  // 图片 — 本地用 next/image 优化，外部用原生 <img> 避免 SSRF
  img: ({ src, alt, width: _w, height: _h, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (!src || typeof src !== "string") return null;
    if (src.startsWith("http")) {
      return (
        <img
          src={src}
          alt={alt || ""}
          className="my-6 sm:my-8 rounded-lg w-full h-auto"
          loading="lazy"
          {...props}
        />
      );
    }
    return (
      <span className="relative block w-full my-6 sm:my-8" style={{ aspectRatio: "16/9" }}>
        <Image
          src={`/images/${src}`}
          alt={alt || ""}
          fill
          className="rounded-lg object-contain"
          sizes="(max-width: 720px) 100vw, 720px"
          {...props}
        />
      </span>
    );
  },

  // <FigCaption> — mobile: 13px/20px, desktop: 14px/24px
  FigCaption: (props: React.HTMLAttributes<HTMLElement>) => (
    <span
      className="block mt-3 text-center caption font-normal text-ink-tertiary"
      {...props}
    />
  ),

  // <Caption> — mobile: 13px/20px, desktop: 14px/24px
  Caption: (props: React.HTMLAttributes<HTMLElement>) => (
    <span
      className="block my-3 font-sans text-[13px] leading-[20px] sm:text-[14px] sm:leading-[24px] font-normal text-ink-tertiary tracking-[0.01em]"
      {...props}
    />
  ),

  // <Small> — mobile: 14px/24px, desktop: 16px/28px
  Small: (props: React.HTMLAttributes<HTMLElement>) => (
    <small
      className="block my-2 font-sans text-[14px] leading-[24px] sm:text-[16px] sm:leading-[28px] font-normal text-ink-secondary"
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
    ...components,
  };
}
