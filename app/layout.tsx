import {Metadata} from "next";
import Providers from "@/components/Providers";
import "@/styles/globals.css";
import {Inter} from "next/font/google";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  icons: "/favicon.ico",
  title: "nextjs13-template",
  description: "nextjs13-template: 基于nextjs13+ 和 tailwindcss 创建的一个项目脚手架",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="min-h-full w-full">
      <body className={`${inter.className} min-h-screen w-full bg-globalBg overflow-y-auto`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
