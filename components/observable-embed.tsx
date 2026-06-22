interface ObservableEmbedProps {
  /** ObservableHQ 用户名/notebook，如 "@shu/plot-regression" */
  notebook: string;
  /** 要嵌入的 cell 名称，英文逗号分隔 */
  cells?: string;
  /** iframe 高度 */
  height?: number;
  className?: string;
}

/**
 * ObservableHQ notebook cell 嵌入组件，使用官方 embed API。
 *
 * 在 MDX 文章中使用：
 *   <ObservableEmbed notebook="@shu/plot-regression" cells="RegressionLinear" />
 */
export function ObservableEmbed({
  notebook,
  cells,
  height = 440,
  className,
}: ObservableEmbedProps) {
  const src = `https://observablehq.com/embed/${notebook}${cells ? `?cells=${cells}` : ""}`;

  return (
    <figure className="my-8 not-prose">
      <iframe
        src={src}
        title={`ObservableHQ: ${notebook}`}
        className={`w-full border border-border rounded-lg bg-paper ${className || ""}`}
        style={{ height }}
        loading="lazy"
      />
    </figure>
  );
}
