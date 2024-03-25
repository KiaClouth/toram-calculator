'use client';
import Link from "next/link";
import {
  IconBasketball,
  IconBox2,
  IconCalendar,
  IconCategory2,
  IconCoins,
  IconFilter,
  IconGamepad,
  IconHome,
  IconLogo,
  IconMoney,
} from "./iconsList";
import SignInOrOut from "./signInOrOut";
import ThemeSwitch from "./themeSwitch";
import { type getDictionary } from "~/app/get-dictionary";
import { type Session } from "next-auth";
import { useEffect, useState } from "react";

export default function Nav(props: {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
}) {
  const { dictionary, session } = props;
  const NavBtnConfig: [string, JSX.Element | undefined, string | undefined][] =
    [
      [
        dictionary.ui.root.monsters,
        <IconCalendar key={"IconCalendar"} />,
        "/monster",
      ],
      ["LineA", , ,],
      [
        dictionary.ui.root.skills,
        <IconBasketball key={"IconBasketball"} />,
        "/building",
      ],
      [
        dictionary.ui.root.equipments,
        <IconCategory2 key={"IconCategory2"} />,
        "/building",
      ],
      [dictionary.ui.root.crystas, <IconBox2 key={"IconBox2"} />, "/building"],
      [dictionary.ui.root.pets, <IconMoney key={"IconMoney"} />, "/pet"],
      [dictionary.ui.root.items, <IconCoins key={"IconCoins"} />, "/building"],
      ["LineB", , ,],
      [
        dictionary.ui.root.character,
        <IconGamepad key={"IconGamepad"} />,
        "/building",
      ],
      [
        dictionary.ui.root.comboAnalyze,
        <IconFilter key={"IconFilter"} />,
        "/building",
      ],
    ];

  const [isImageCached, setImageCached] = useState("false");

  useEffect(() => {
    // 从localstorage读取图片缓存状态
    const bgImageCachedStatus = localStorage.getItem("isImageCached");
    bgImageCachedStatus && setImageCached(bgImageCachedStatus);
  }, []);

  return (
    <div 
    // 为了防止图片尚未加载出来而出现的闪烁，只有在localstorage中存在isImageCached时导航栏才显示
      className={`Nav border-t-1 flex w-dvw flex-shrink-0 overflow-x-auto border-transition-color-20 backdrop-blur lg:h-dvh lg:w-24 lg:flex-col lg:gap-10 lg:border-none lg:bg-transition-color-8 lg:py-5 ${
        isImageCached === "true"
          ? "pointer-events-auto visible opacity-100"
          : "pointer-events-none invisible opacity-0"
      }`}
    >
      <div>
        <Link
          href={"/"}
          className="Home lgpx-4 group flex flex-col items-center justify-center gap-0.5 px-1 py-2 lg:gap-4"
          tabIndex={1}
          scroll={false}
        >
          <div className="iconArea rounded-full px-4 py-1 group-hover:bg-brand-color-1st group-focus:bg-brand-color-1st lg:hidden">
            <IconHome />
          </div>
          <IconLogo className="hidden lg:block" />
          <div className="text-xs lg:hidden">{dictionary.ui.root.home}</div>
        </Link>
      </div>
      <div className="NavBtnList flex flex-1 items-center lg:flex-col lg:gap-4 lg:overflow-y-auto">
        {NavBtnConfig.map(([btnName, icon, url]) => {
          if (icon !== undefined && url !== undefined) {
            return (
              <Link
                href={url}
                key={btnName}
                tabIndex={0}
                className={
                  "NavBtn btn-" +
                  btnName +
                  " group flex flex-shrink-0 flex-col items-center gap-0.5 px-1 py-2 lg:gap-1 lg:p-0"
                }
              >
                <div className="iconArea rounded-full px-4 py-1 group-hover:bg-brand-color-1st group-focus:bg-brand-color-1st">
                  {icon}
                </div>
                <div className="text-xs">{btnName}</div>
              </Link>
            );
          } else {
            return (
              <div
                key={btnName}
                className={
                  "Line h-line flex-none lg:w-12 lg:bg-brand-color-1st"
                }
              ></div>
            );
          }
        })}
      </div>
      <div className="FunctionGroup flex items-center justify-center gap-3 px-6 lg:flex-col lg:p-0">
        <SignInOrOut session={session} />
        <ThemeSwitch />
      </div>
    </div>
  );
}
