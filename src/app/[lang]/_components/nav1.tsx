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

export default function Nav(props: {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
}) {
  const { dictionary, session } = props;
  type NavBtnGroup = {
    index: number;
    name: string;
    icon: JSX.Element;
    children: {
      name: string;
      icon: JSX.Element;
      url: string;
    }[];
  };

  // const tw = (className: string, state?:string) => {
  //   let result = "";
  //   let prefix = state ?? "";
  //   Array.from(className).forEach(char => {
  //     if (char === " ") {
  //       prefix = "" // 检测到空格说明tailwind类名结束，此时清空，准备记录下一个类名
  //     }
  //     if (char === ":") {
  //       tw(className)
  //     }
  //     prefix += char
  //     className = className.slice(1, className.length)
  //     console.log(prefix,className)
  // });
  //   return result
  // }

  `Nav border-t-1 z-30 flex w-dvw flex-shrink-0 overflow-x-auto border-transition-color-20 backdrop-blur
  lg:[
      fixed left-0 h-dvh w-24 -translate-x-3/4 flex-col gap-10 border-none bg-transition-color-8 py-5 opacity-0
      hover:[
        translate-x-0 opacity-100
      ],
      dark:[
        left-[3dvw] top-1/2 h-[90dvh] -translate-y-1/2 translate-x-0 opacity-100
    ]
  ]`

  // 导航栏信息结构
  const NavBtnConfig: NavBtnGroup[] = [
    {
      index: 0,
      name: "Wiki",
      icon: <IconBasketball />,
      children: [
        {
          name: dictionary.ui.root.monsters,
          icon: <IconCalendar key={"IconCalendar"} />,
          url: "/monster",
        },
        {
          name: dictionary.ui.root.skills,
          icon: <IconBasketball key={"IconBasketball"} />,
          url: "",
        },
        {
          name: dictionary.ui.root.equipments,
          icon: <IconCategory2 key={"IconCategory2"} />,
          url: "",
        },
        {
          name: dictionary.ui.root.crystas,
          icon: <IconBox2 key={"IconBox2"} />,
          url: "",
        },
        {
          name: dictionary.ui.root.pets,
          icon: <IconMoney key={"IconMoney"} />,
          url: "",
        },
        {
          name: dictionary.ui.root.items,
          icon: <IconCoins key={"IconCoins"} />,
          url: "",
        },
      ],
    },
    {
      index: 1,
      name: "Confing",
      icon: <IconCoins key={"IconCoins"} />,
      children: [
        {
          name: dictionary.ui.root.character,
          icon: <IconGamepad key={"IconGamepad"} />,
          url: "",
        },
      ],
    },
    {
      index: 2,
      name: "Analyze",
      icon: <IconCoins key={"IconCoins"} />,
      children: [
        {
          name: dictionary.ui.root.comboAnalyze,
          icon: <IconFilter key={"IconFilter"} />,
          url: "",
        },
      ],
    },
  ];

  return (
    <div
      className={`Nav border-t-1 z-30 flex w-dvw flex-shrink-0 overflow-x-auto border-transition-color-20 backdrop-blur 
      lg:fixed lg:left-0 lg:top-0 lg:h-dvh lg:w-24 lg:-translate-x-3/4 lg:flex-col lg:gap-10 lg:border-none lg:bg-transition-color-8 lg:py-5 lg:opacity-0
      lg:hover:translate-x-0 lg:hover:opacity-100
      lg:dark:left-[3dvw] lg:dark:top-[5dvh] lg:dark:h-[90dvh] lg:dark:translate-x-0  lg:dark:bg-primary-color lg:dark:opacity-100`}
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
        {NavBtnConfig.map((group) => {
          return (
            <div
              key={group.name}
              className={`${group.name} BtnGroup flex flex-1 items-center lg:flex-col lg:gap-4`}
            >
              <div className="BtnContent fixed lg:dark:flex lg:dark:pointer-events-all pointer-events-none invisible opacity-0 lg:dark:visible lg:dark:opacity-100">
                {group.icon}
                {group.name}
              </div>
              <div className="BtnGrouplist flex flex-initial items-center lg:flex-col lg:gap-4 lg:dark:fixed">
                {group.children.map((btn) => {
                  return (
                    <Link
                      key={btn.name}
                      href={btn.url}
                      tabIndex={0}
                      className={`Btn btn-${btn.name} canhidden group flex flex-shrink-0 flex-col items-center gap-0.5 px-1 py-2 lg:gap-1 lg:p-0 lg:dark:pointer-events-none lg:dark:invisible lg:dark:opacity-0`}
                    >
                      <div className="iconArea rounded-full px-4 py-1 group-hover:bg-brand-color-1st group-focus:bg-brand-color-1st">
                        {btn.icon}
                      </div>
                      <div className="text-xs">{btn.name}</div>
                    </Link>
                  );
                })}
                {group.index < NavBtnConfig.length - 1 && (
                  <div
                    className={
                      "Line h-line flex-none lg:w-12 lg:bg-brand-color-1st"
                    }
                  ></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="FunctionGroup flex items-center justify-center gap-3 px-6 lg:flex-col lg:p-0">
        <SignInOrOut session={session} />
        <ThemeSwitch />
      </div>
    </div>
  );
}
