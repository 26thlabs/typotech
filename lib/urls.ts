export const THEME_KEY = "theme" as const;

export const THEME_ATTR = "data-theme" as const;

export function getArticleUrl(slug: string): string {
  return "/blog/" + slug;
}

export function getTagUrl(tag: string): string {
  return "/tags/" + encodeURIComponent(tag);
}
