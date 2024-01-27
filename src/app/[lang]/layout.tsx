import { getServerAuthSession } from "~/server/auth";

import Link from "next/link";
import Image from "next/image";
import SignInOrOut from "./_components/signInOrOut";

import { type StaticImport } from "next/dist/shared/lib/get-img-props";
import iconBasketball from "~/../public/app-image/icons/Basketball.svg";
import iconBox2 from "~/../public/app-image/icons/Box 2.svg";
import iconCalendar from "~/../public/app-image/icons/Calendar.svg";
import iconCategory2 from "~/../public/app-image/icons/Category 2.svg";
import iconCoins from "~/../public/app-image/icons/Coins.svg";
import iconFilter from "~/../public/app-image/icons/Filter.svg";
import iconGamepad from "~/../public/app-image/icons/Gamepad.svg";
import iconMoney from "~/../public/app-image/icons/Money.svg";

const Nav: [string, StaticImport | undefined, string | undefined][] = [
  ["怪物", iconCalendar, "/monster"],
  ["LineA", , ,],
  ["技能", iconBasketball, ""],
  ["装备", iconCategory2, ""],
  ["锻晶", iconBox2, ""],
  ["宠物", iconMoney, "/pet"],
  ["消耗品", iconCoins, ""],
  ["LineB", , ,],
  ["机体配置", iconGamepad, "/character"],
  ["连击分析", iconFilter, ""],
];

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  return (
    <>
      <div className="Nav fixed -left-full flex h-dvh w-3/4 flex-col items-center gap-3 bg-bg-white-100 px-2.5 py-10 lg:static lg:w-24 lg:bg-bg-grey-8 lg:py-5">
        <div className="Top flex h-full w-full flex-1 flex-col gap-20 overflow-hidden lg:gap-10">
          <Link
            href={"/"}
            className="LOGO flex w-min flex-none flex-col px-4 lg:top-5 lg:w-[78px] lg:items-center"
          >
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
              if (iconPath !== undefined && url !== undefined) {
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
          <SignInOrOut session={session} />
        </div>
      </div>
      {children}
    </>
  );
}
