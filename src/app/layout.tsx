import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://prowres-tracker.vercel.app"),
  title: {
    default: "ジャパン プロレスマニア",
    template: "%s | ジャパン プロレスマニア",
  },
  description:
    "日本国内のプロレス興行情報を一覧・検索できるサービス。新日本プロレス、全日本プロレス、NOAH、DDT、スターダム、ドラゴンゲートなど主要団体の興行スケジュールをリスト・カレンダー・マップで確認できます。",
  openGraph: {
    siteName: "ジャパン プロレスマニア",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-sans antialiased bg-gray-950 text-gray-100`}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
