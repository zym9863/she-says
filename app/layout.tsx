import type { Metadata } from "next";
import { Noto_Sans_SC, Playfair_Display } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// 中文字体
const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-sc",
});

// 标题字体
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "她说",
  description: "分享你的故事",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" className={`${notoSansSC.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <NextAuthProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-64px-200px)]">{children}</main>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}
