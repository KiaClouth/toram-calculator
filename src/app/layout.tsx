import { env } from "~/env";
import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { getServerAuthSession } from "~/server/auth";

import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Image from "next/image";
import CssBaseline from "@mui/material/CssBaseline";
import SignInOrOut from "./_components/signInOrOut";

const Nav = [
  ["怪物", "/app-image/icons/Calendar.svg", "/monster"],
  ["LineA"],
  ["技能", "/app-image/icons/Basketball.svg", ""],
  ["装备", "/app-image/icons/Category 2.svg", ""],
  ["锻晶", "/app-image/icons/Box 2.svg", ""],
  ["宠物", "/app-image/icons/Money.svg", "/pet"],
  ["消耗品", "/app-image/icons/Coins.svg", ""],
  ["LineB"],
  ["机体配置", "/app-image/icons/Gamepad.svg", "/character"],
  ["连击分析", "/app-image/icons/Filter.svg", ""],
]

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const dynamic = "force-dynamic";

const APP_NAME = "托拉姆计算器-ToramCalculator";
const APP_DEFAULT_TITLE = "一个简单的托拉姆数值计算器";
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

  const session = await getServerAuthSession();
  return (
    <html lang="zh-CN">
      <body
        className={
          `font-sans ${inter.variable}` +
          " min-h-dvh flex-row items-start justify-start"
        }
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          <CssBaseline />
          <div className="Nav fixed -left-full lg:static lg:w-24 h-dvh w-3/4 flex flex-col items-center gap-3 bg-bg-white-100 px-2.5 py-10 lg:bg-bg-grey-8 lg:py-5">
            <div className="Top flex h-full w-full flex-1 flex-col gap-20 overflow-hidden lg:gap-10">
              <Link href={"/"} className="LOGO flex w-min flex-none flex-col px-4 lg:top-5 lg:w-[78px] lg:items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  viewBox="0 0 50 50"
                  fill="none"
                >
                  <rect
                    x="0.75"
                    y="0.75"
                    width="48.5"
                    height="48.5"
                    rx="24.25"
                    fill="white"
                  />
                  <rect
                    x="0.75"
                    y="0.75"
                    width="48.5"
                    height="48.5"
                    rx="24.25"
                    stroke="#2F1A49"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="12.3611"
                    y="12.2222"
                    width="8.61111"
                    height="27.7778"
                    rx="4.30556"
                    fill="#2F1A49"
                  />
                  <rect
                    x="23.2077"
                    y="28.6913"
                    width="5.20137"
                    height="16.7786"
                    rx="2.60068"
                    transform="rotate(-45 23.2077 28.6913)"
                    fill="#FD7E50"
                  />
                  <rect
                    x="35.0366"
                    y="25"
                    width="5.20137"
                    height="16.7786"
                    rx="2.60068"
                    transform="rotate(45 35.0366 25)"
                    fill="#FD7E50"
                  />
                  <rect
                    x="24.4444"
                    y="11.8055"
                    width="12.7778"
                    height="12.7778"
                    rx="6.38889"
                    fill="#FFA63C"
                  />
                </svg>
              </Link>
              <div className="NavBtnList flex h-full w-full shrink flex-col items-center gap-2 overflow-y-auto last:mb-0 lg:gap-4">
                {Nav.map(([btnName, iconPath, url]) => {
                  if (btnName !== undefined && iconPath !== undefined && url !== undefined) {
                    return (
                      <Link
                        href={url}
                        key={btnName}
                        className={
                          "btn-" +
                          btnName +
                          " group flex w-full flex-row items-center gap-8 py-1 active:bg-brand-color-blue lg:flex-col lg:gap-1 lg:py-0 lg:active:bg-transparent"
                        }
                      >
                        <div className="iconArea rounded-full px-4 py-1 lg:group-hover:bg-brand-color-blue">
                          <Image
                            src={iconPath}
                            alt={btnName}
                            height={0}
                            width={0}
                            style={{ width: "24px", height: "auto" }}
                          />
                        </div>
                        <div className="text-base text-main-color-100 lg:text-xs">
                          {btnName}
                        </div>
                      </Link>
                    );
                  } else {
                    return (
                      <div
                        key={btnName}
                        className={
                          "Line h-line w-full bg-bg-grey-8 lg:w-12 lg:bg-brand-color-blue"
                        }
                      ></div>
                    );
                  }
                })}
              </div>
            </div>
            <div className="NavFunctionBtnList flex w-full flex-none flex-col items-center justify-center gap-3 last:mb-0">
              <div className="ThemeModuleSwitchBtn rounded-full border-1.5 border-brand-color-blue p-1 hover:p-2">
                <SignInOrOut session={session} />
              </div>
              {/* <div className="ThemeModuleSwitchBtn p-2 rounded-full border-1.5 border-main-color-100">
                <Image
                  src={"/app-image/icons/Loading.svg"}
                  alt={"模式切换按钮"}
                  width={24}
                  height={24}
                />
              </div> */}
            </div>
          </div>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
