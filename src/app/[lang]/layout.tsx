import "~/styles/globals.css";
import { env } from "~/env";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import Link from "next/link";
import { TRPCReactProvider } from "~/trpc/react";
import type { Metadata, Viewport } from "next";
import type { Locale } from "~/../i18n-config";
import { getServerAuthSession } from "~/server/auth";

import SignInOrOut from "./_components/signInOrOut";
import { getDictionary } from "get-dictionary";
import ThemeProvider from "./_components/themeProvider";
import ThemeSwitch from "./_components/themeSwitch";
import {
  IconLogo,
  IconBasketball,
  IconBox2,
  IconCalendar,
  IconCategory2,
  IconCoins,
  IconFilter,
  IconGamepad,
  IconHome,
  IconMoney,
} from "./_components/iconsList";

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
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default async function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const session = await getServerAuthSession();
  const dictionary = getDictionary(lang);
  const rNav: [string, JSX.Element | undefined, string | undefined][] = [
    [
      dictionary.ui.root.monsters,
      <IconCalendar key={"IconCalendar"} />,
      "/monster",
    ],
    ["LineA", , ,],
    [dictionary.ui.root.skills, <IconBasketball key={"IconBasketball"} />, ""],
    [
      dictionary.ui.root.equipments,
      <IconCategory2 key={"IconCategory2"} />,
      "",
    ],
    [dictionary.ui.root.crystas, <IconBox2 key={"IconBox2"} />, ""],
    [dictionary.ui.root.pets, <IconMoney key={"IconMoney"} />, "/pet"],
    [dictionary.ui.root.items, <IconCoins key={"IconCoins"} />, ""],
    ["LineB", , ,],
    [
      dictionary.ui.root.character,
      <IconGamepad key={"IconGamepad"} />,
      "/character",
    ],
    [dictionary.ui.root.comboAnalyze, <IconFilter key={"IconFilter"} />, ""],
  ];
  const bNav: [string, JSX.Element | undefined, string | undefined][] = [
    [dictionary.ui.root.home, <IconHome key={"IconHome"} />, "/"],
    [
      dictionary.ui.root.monsters,
      <IconCalendar key={"IconCalendar"} />,
      "/monster",
    ],
    [dictionary.ui.root.skills, <IconBasketball key={"IconBasketball"} />, ""],
    [
      dictionary.ui.root.equipments,
      <IconCategory2 key={"IconCategory2"} />,
      "",
    ],
    [dictionary.ui.root.crystas, <IconBox2 key={"IconBox2"} />, ""],
    [dictionary.ui.root.pets, <IconMoney key={"IconMoney"} />, "/pet"],
    [dictionary.ui.root.items, <IconCoins key={"IconCoins"} />, ""],
    [
      dictionary.ui.root.character,
      <IconGamepad key={"IconGamepad"} />,
      "/character",
    ],
    [dictionary.ui.root.comboAnalyze, <IconFilter key={"IconFilter"} />, ""],
    ["LineA", , ,],
  ];

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={
          `font-sans ${inter.variable}` +
          " flex h-dvh w-dvw flex-none flex-col overflow-visible lg:flex-row lg:overflow-hidden"
        }
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          <ThemeProvider>
            <div
              id="rootNav"
              className="Nav fixed -left-full flex h-dvh w-4/5 flex-none flex-col items-center gap-3 backdrop-blur lg:left-0 lg:w-24 lg:-translate-x-3/4 lg:bg-transition-color-8 lg:py-5 lg:opacity-0 lg:hover:translate-x-0 lg:hover:opacity-100"
            >
              <div className="Top flex flex-1 flex-col gap-10 overflow-hidden">
                <Link
                  href={"/"}
                  className="LOGO my-12 flex flex-none items-center gap-4 px-4 lg:top-5 lg:my-0 lg:justify-center"
                  tabIndex={1}
                >
                  <IconLogo />
                  <span className=" text-2xl lg:hidden">ToramCalculator</span>
                </Link>
                <div className="NavBtnList flex shrink flex-col items-center gap-2 overflow-y-auto lg:gap-4">
                  {rNav.map(([btnName, icon, url]) => {
                    if (icon !== undefined && url !== undefined) {
                      return (
                        <Link
                          href={url}
                          key={btnName}
                          tabIndex={0}
                          className={
                            "btn-" +
                            btnName +
                            " group flex flex-row items-center gap-8 py-2 active:bg-brand-color-1st lg:flex-col lg:gap-1 lg:py-0 lg:active:bg-transparent"
                          }
                        >
                          <div className="iconArea rounded-full px-4 py-1 lg:group-hover:bg-brand-color-1st">
                            {icon}
                          </div>
                          <div className="text-main-color-100 text-base lg:text-xs">
                            {btnName}
                          </div>
                        </Link>
                      );
                    } else {
                      return (
                        <div
                          key={btnName}
                          className={
                            "Line bg-bg-grey-20 h-line lg:w-12 lg:bg-brand-color-1st"
                          }
                        ></div>
                      );
                    }
                  })}
                </div>
              </div>
              <div className="NavFunctionBtnList hidden flex-none flex-col items-center justify-center gap-3 lg:flex">
                <SignInOrOut session={session} />
                <ThemeSwitch />
              </div>
            </div>
            {children}
            <div
              id="bottomNav"
              className="fixed bottom-0 flex w-dvw items-center justify-between overflow-x-auto bg-transition-color-8 backdrop-blur lg:hidden"
            >
              {bNav.map(([btnName, icon, url]) => {
                if (icon !== undefined && url !== undefined) {
                  return (
                    <Link
                      href={url}
                      key={btnName}
                      tabIndex={0}
                      className={
                        "btn-" +
                        btnName +
                        " group flex flex-none flex-col items-center gap-0.5 p-3"
                      }
                    >
                      <div className="iconArea rounded-full px-4 py-1">
                        {icon}
                      </div>
                      <div className=" text-main-color-100 text-xs">
                        {btnName}
                      </div>
                    </Link>
                  );
                } else {
                  return (
                    <div
                      key={"bottomNavSignInOrOut"}
                      className=" group flex flex-none flex-row items-center gap-1 p-4 active:bg-brand-color-1st"
                    >
                      <SignInOrOut session={session} />
                      <ThemeSwitch />
                    </div>
                  );
                }
              })}
            </div>
            <div className="BG fixed -z-10 h-dvh w-dvw">
              <div className="BGMask h-dvh w-dvw"></div>
            </div>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
