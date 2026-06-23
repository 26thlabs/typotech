import type { Metadata } from "next";
import { Inter, Fira_Code, Noto_Sans_SC, DM_Serif_Display } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { site, theme } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  weight: ["400", "500", "600", "700"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: {
    template: `%s — ${site.name}`,
    default: site.name,
  },
  description: site.description,
  metadataBase: new URL(site.url),
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/rss.xml", title: `${site.name} RSS` }],
    },
  },
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
    url: site.url,
  },
  twitter: {
    card: "summary",
    title: site.name,
    description: site.description,
  },
};

/** 从 theme 配置生成 CSS 自定义属性字符串 */
function themeCSS() {
  const { light } = theme;
  const s = light.shiki;
  return `:root {
  --color-ink: ${light.ink};
  --color-ink-secondary: ${light.inkSecondary};
  --color-ink-tertiary: ${light.inkTertiary};
  --color-accent: ${light.accent};
  --color-paper: ${light.paper};
  --color-subtle: ${light.subtle};
  --color-border: ${light.border};
  --shiki-color-text: ${s.text};
  --shiki-color-background: transparent;
  --shiki-token-constant: ${s.constant};
  --shiki-token-string: ${s.string};
  --shiki-token-string-expression: ${s.stringExpression};
  --shiki-token-comment: ${s.comment};
  --shiki-token-keyword: ${s.keyword};
  --shiki-token-function: ${s.function};
  --shiki-token-parameter: ${s.parameter};
  --shiki-token-punctuation: ${s.punctuation};
  --shiki-token-link: ${s.link};
}`;
}

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html
      lang={site.lang}
      className={`${inter.variable} ${firaCode.variable} ${notoSansSC.variable} ${dmSerifDisplay.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCSS() }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light";document.documentElement.classList.add(t);document.documentElement.classList.add("theme-ready")}catch(e){}`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{window.matchMedia("(prefers-color-scheme:dark)").addEventListener("change",function(e){var r=document.documentElement;var t=e.matches?"dark":"light";var a=function(){if(t==="dark"){r.classList.add("dark");r.classList.remove("light")}else{r.classList.remove("dark");r.classList.add("light")}};if(document.startViewTransition){document.startViewTransition(function(){a()})}else{a()}})}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-paper text-ink">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded"
        >
          跳到内容
        </a>
        <Header />
        <main id="main-content" className="flex-1 flex flex-col my-4 max-w-[720px] mx-auto w-full px-4 sm:px-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
