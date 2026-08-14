import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://string-tuner.vercel.app";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "String Tuner｜弦楽器の無料オンラインチューナー", template: "%s｜String Tuner" },
  description: "ギター、ベース、ウクレレ、バイオリン、三味線などに対応した無料オンラインチューナー。登録不要、マイク音声は端末内で処理します。",
  alternates: { canonical: "/" }, robots: { index: true, follow: true },
  openGraph: { type: "website", locale: "ja_JP", title: "String Tuner", description: "多数の弦楽器に対応した無料・登録不要のWebチューナー。", url: siteUrl },
  twitter: { card: "summary", title: "String Tuner", description: "多数の弦楽器に対応した無料Webチューナー。" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ja"><body>{children}<Analytics/></body></html>; }
