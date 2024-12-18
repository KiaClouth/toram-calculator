import "~/styles/globals.css";
import { env } from "~/env";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";
import type { Metadata, Viewport } from "next";
import type { Locale } from "~/app/i18n-config";
// import { GoogleAnalytics } from "@next/third-parties/google";
import ThemeProvider from "./_components/themeProvider";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const APP_NAME = "托拉姆计算器-ToramCalculator:一个简单的托拉姆数值计算器";
const APP_DEFAULT_TITLE = "托拉姆计算器-ToramCalculator";
const APP_TITLE_TEMPLATE = "ToramCalculator";
const APP_DESCRIPTION = "Wiki、角色配置、连击计算等";

// export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  icons: [{ rel: "icon", url: "/icons/48.ico" }],
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  metadataBase: new URL(env.NEXTAUTH_URL),
  other: {
    // 百度HTML标签验证字段
    "baidu-site-verification": env.BAIDU_HTML_LABEL,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <ThemeProvider>
            {/* <BabylonBg /> */}
            {children}
          </ThemeProvider>
        </TRPCReactProvider>
        <Script
          id="umami"
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id={env.UMAMI_ID}
        ></Script>
      </body>
    </html>
  );
}
