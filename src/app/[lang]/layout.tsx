import "~/styles/globals.css";
import { env } from "~/env";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { TRPCReactProvider } from "~/trpc/react";
import type { Metadata, Viewport } from "next";
import { type Locale } from "~/../i18n-config";
import { getServerAuthSession } from "~/server/auth";

import SignInOrOut from "./_components/signInOrOut";

import Logo from "~/../public/app-image/LOGO.svg";
import { type StaticImport } from "next/dist/shared/lib/get-img-props";
import iconBasketball from "~/../public/app-image/icons/Basketball.svg";
import iconBox2 from "~/../public/app-image/icons/Box 2.svg";
import iconCalendar from "~/../public/app-image/icons/Calendar.svg";
import iconCategory2 from "~/../public/app-image/icons/Category 2.svg";
import iconCoins from "~/../public/app-image/icons/Coins.svg";
import iconFilter from "~/../public/app-image/icons/Filter.svg";
import iconGamepad from "~/../public/app-image/icons/Gamepad.svg";
import iconMoney from "~/../public/app-image/icons/Money.svg";
import iconHome from "~/../public/app-image/icons/Home.svg";
import { getDictionary } from "get-dictionary";

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
  const rNav: [string, StaticImport | undefined, string | undefined][] = [
    [dictionary.ui.root.monsters, iconCalendar, "/monster"],
    ["LineA", , ,],
    [dictionary.ui.root.skills, iconBasketball, ""],
    [dictionary.ui.root.equipments, iconCategory2, ""],
    [dictionary.ui.root.crystas, iconBox2, ""],
    [dictionary.ui.root.pets, iconMoney, "/pet"],
    [dictionary.ui.root.items, iconCoins, ""],
    ["LineB", , ,],
    [dictionary.ui.root.character, iconGamepad, "/character"],
    [dictionary.ui.root.comboAnalyze, iconFilter, ""],
  ];
  const bNav: [string, StaticImport | undefined, string | undefined][] = [
    [dictionary.ui.root.home, iconHome, "/"],
    [dictionary.ui.root.monsters, iconCalendar, "/monster"],
    [dictionary.ui.root.skills, iconBasketball, ""],
    [dictionary.ui.root.equipments, iconCategory2, ""],
    [dictionary.ui.root.crystas, iconBox2, ""],
    [dictionary.ui.root.pets, iconMoney, "/pet"],
    [dictionary.ui.root.items, iconCoins, ""],
    [dictionary.ui.root.character, iconGamepad, "/character"],
    [dictionary.ui.root.comboAnalyze, iconFilter, ""],
    ["LineA", , ,],
  ];

  return (
    <html lang={lang}>
      <body
        className={
          `font-sans ${inter.variable}` +
          " min-h-dvh flex flex-col lg:flex-row"
        }
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          <div
            id="rootNav"
            className="Nav fixed -left-full flex h-dvh w-4/5 flex-none flex-col items-center gap-3 lg:static lg:w-24 lg:bg-bg-grey-8 lg:py-5"
          >
            <div className="Top flex h-full w-full flex-1 flex-col gap-10 overflow-hidden">
              <Link
                href={"/"}
                className="LOGO my-12 flex flex-none items-center gap-4 px-4 lg:top-5 lg:my-0 lg:justify-center"
                tabIndex={1}
              >
                <Image
                  src={Logo as StaticImport}
                  alt="Logo"
                  height={50}
                  width={50}
                  style={{ width: "50px", height: "auto" }}
                  priority
                />
                <span className=" text-2xl lg:hidden">ToramCalculator</span>
              </Link>
              <div className="NavBtnList flex h-full w-full shrink flex-col items-center gap-2 overflow-y-auto last:mb-0 lg:gap-4">
                {rNav.map(([btnName, iconPath, url]) => {
                  if (iconPath !== undefined && url !== undefined) {
                    return (
                      <Link
                        href={url}
                        key={btnName}
                        tabIndex={0}
                        className={
                          "btn-" +
                          btnName +
                          " group flex w-full flex-row items-center gap-8 py-2 active:bg-brand-color-blue lg:flex-col lg:gap-1 lg:py-0 lg:active:bg-transparent"
                        }
                      >
                        <div className="iconArea rounded-full px-4 py-1 lg:group-hover:bg-brand-color-blue">
                          <Image
                            src={iconPath}
                            alt={btnName}
                            width={24}
                            height={0}
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
                          "Line h-line w-full bg-bg-grey-20 lg:w-12 lg:bg-brand-color-blue"
                        }
                      ></div>
                    );
                  }
                })}
              </div>
            </div>
            <div className="NavFunctionBtnList hidden w-full flex-none flex-col items-center justify-center gap-3 last:mb-0 lg:flex">
              <SignInOrOut session={session} />
            </div>
          </div>
          {children}
          <div
            id="bottomNav"
            className="flex items-center justify-between overflow-x-auto bg-bg-grey-8 lg:hidden"
          >
            {bNav.map(([btnName, iconPath, url]) => {
              if (iconPath !== undefined && url !== undefined) {
                return (
                  <Link
                    href={url}
                    key={btnName}
                    tabIndex={0}
                    className={
                      "btn-" +
                      btnName +
                      " group flex flex-none flex-col items-center p-3 gap-0.5"
                    }
                  >
                    <div className="iconArea rounded-full px-4 py-1">
                      <Image
                        src={iconPath}
                        alt={btnName}
                        width={24}
                        height={0}
                        style={{ width: "24px", height: "auto" }}
                      />
                    </div>
                    <div className=" text-xs text-main-color-100">
                      {btnName}
                    </div>
                  </Link>
                );
              } else {
                return (
                  <div
                    key={"bottomNavSignInOrOut"}
                    className=" group flex flex-none flex-row items-center gap-1 p-4 active:bg-brand-color-blue"
                  >
                    <SignInOrOut session={session} />
                  </div>
                );
              }
            })}
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
