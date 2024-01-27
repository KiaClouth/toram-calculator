import "~/styles/globals.css";
import { env } from "~/env";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";
import CssBaseline from "@mui/material/CssBaseline";
import type { Metadata, Viewport } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const dynamic = "force-dynamic";

const APP_NAME = "托拉姆计算器-ToramCalculator:一个简单的托拉姆数值计算器";
const APP_DEFAULT_TITLE = "托拉姆计算器-ToramCalculator";
const APP_TITLE_TEMPLATE = "ToramCalculator";
const APP_DESCRIPTION = "Wiki、角色配置、连击计算等";

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
  metadataBase: new URL(env.NEXTAUTH_URL)
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body
        className={
          `font-sans ${inter.variable}` +
          " min-h-dvh flex-row items-start justify-start"
        }
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          <CssBaseline />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
