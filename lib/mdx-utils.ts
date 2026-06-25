import React from "react";

/**
 * Filter MDX whitespace text nodes to avoid hydration errors.
 * MDX can insert whitespace-only text nodes between elements;
 * stripping them keeps the DOM consistent between server and client.
 */
export function filterKids(children: React.ReactNode) {
  return React.Children.toArray(children).filter(
    (c) => typeof c !== "string" || c.trim()
  );
}

/**
 * Recursively extract plain text from React children.
 * Used for generating anchor IDs from heading content.
 */
export function textOf(c: React.ReactNode): string {
  if (typeof c === "string") return c;
  if (typeof c === "number") return String(c);
  if (Array.isArray(c)) return c.map(textOf).join("");
  if (React.isValidElement(c)) return textOf((c.props as any).children);
  return "";
}
