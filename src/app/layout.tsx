import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import CssBaseline from "@mui/material/CssBaseline";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "托拉姆计算器-ToramCalculator",
  description: "一个简单的托拉姆数值计算器：角色配置、连击计算等",
  manifest: "/manifest.json",
  icons: [{ rel: "icon", url: "/icons/48.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <CssBaseline />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
