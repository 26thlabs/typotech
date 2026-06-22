import { createHighlighter, createCssVariablesTheme } from "shiki";

// 博客支持的全部代码高亮语言（按使用频率排列）
const LANGS = [
  // TypeScript / JavaScript
  "ts", "tsx", "js", "jsx",
  // Shell / 配置
  "bash", "shell", "powershell",
  // 数据格式
  "json", "yaml", "toml", "xml",
  // Web
  "css", "scss", "html",
  // 系统 / 底层
  "c", "cpp", "rust", "go", "zig",
  // 高级语言
  "python", "java", "kotlin", "swift", "ruby", "lua",
  // 数据库 / 查询
  "sql",
  // 标记 / 文档
  "markdown", "text", "diff",
];

const theme = createCssVariablesTheme({ name: "css-variables" });

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

/**
 * 获取 Shiki 高亮器实例（自动缓存）。
 * 返回 Promise，配合 React.use() 可在 RSC 中直接 unwrap。
 */
export function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [theme],
      langs: LANGS,
    });
  }
  return highlighterPromise;
}
