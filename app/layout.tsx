import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://string-tuner.vercel.app";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl), title: { default: "String Tuner｜無料・広告なし", template: "%s｜String Tuner" },
  description: "マイクだけで使える無料・広告なしのWebギターチューナー。音声は端末内で処理し、保存・外部送信しません。",
  alternates: { canonical: "/" }, robots: { index: true, follow: true },
  openGraph: { type: "website", locale: "ja_JP", title: "String Tuner", description: "無料・広告なし。ブラウザですぐ使えるギターチューナー。", url: siteUrl },
  twitter: { card: "summary_large_image", title: "String Tuner", description: "無料・広告なしのWebギターチューナー" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ja"><body>{children}<Analytics /></body></html>; }
