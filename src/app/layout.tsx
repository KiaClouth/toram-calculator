import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import Image from "next/image";

import { TRPCReactProvider } from "~/trpc/react";
import CssBaseline from "@mui/material/CssBaseline";
import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";
import SignInOrOut from "./_components/signInOrOut";

const session = await getServerAuthSession();

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const dynamic = "force-dynamic";

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
              <div className="LOGO flex w-min flex-none flex-col px-4 lg:top-5 lg:w-[78px] lg:items-center">
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
              </div>
              <div className="NavBtnList flex h-full w-full shrink flex-col items-center gap-2 overflow-y-auto last:mb-0 lg:gap-4">
                {[
                  ["怪物", "/app-image/icons/Calendar.svg"],
                  [],
                  ["技能", "/app-image/icons/Basketball.svg"],
                  ["装备", "/app-image/icons/Category 2.svg"],
                  ["锻晶", "/app-image/icons/Box 2.svg"],
                  ["宠物", "/app-image/icons/money.svg"],
                  ["消耗品", "/app-image/icons/Coins.svg"],
                  [],
                  ["机体配置", "/app-image/icons/Gamepad.svg"],
                  ["连击分析", "/app-image/icons/Filter.svg"],
                ].map(([btnName, iconUrl]) => {
                  if (btnName !== undefined && iconUrl !== undefined) {
                    return (
                      <Link
                        href={""}
                        key={btnName}
                        className={
                          "btn-" +
                          btnName +
                          " group flex w-full flex-row items-center gap-8 py-1 active:bg-brand-color-blue lg:flex-col lg:gap-1 lg:py-0 lg:active:bg-transparent"
                        }
                      >
                        <div className="iconArea rounded-full px-4 py-1 lg:group-hover:bg-brand-color-blue">
                          <Image
                            src={iconUrl}
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
            <div className="NavFunctionBtnList flex w-full flex-none flex-col items-center gap-3 last:mb-0">
              <div className="ThemeModuleSwitchBtn rounded-full border-1.5 border-brand-color-blue p-2">
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
