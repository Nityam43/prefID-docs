import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: {
    default: "prefID — Type-safe, prefixed IDs",
    template: "%s — prefID",
  },
  description:
    "prefID generates type-safe, prefixed IDs like user_a1b2c3 with zero dependencies. Secure, tiny, and universal.",
};

const themeScript = `(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&m)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

const langScript = `(function(){try{var l=localStorage.getItem('prefid-lang');document.documentElement.dataset.lang=(l==='js')?'js':'ts';}catch(e){document.documentElement.dataset.lang='ts';}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: langScript }} />
      </head>
      <body className="min-h-screen font-sans">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
