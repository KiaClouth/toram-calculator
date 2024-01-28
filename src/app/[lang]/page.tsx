import Link from "next/link";
import Image from "next/image";

import { type StaticImport } from "next/dist/shared/lib/get-img-props";
import iconBasketball from "~/../public/app-image/icons/Basketball.svg";
import iconBox2 from "~/../public/app-image/icons/Box 2.svg";
import iconCalendar from "~/../public/app-image/icons/Calendar.svg";
import iconCategory2 from "~/../public/app-image/icons/Category 2.svg";
import iconCoins from "~/../public/app-image/icons/Coins.svg";
import iconFilter from "~/../public/app-image/icons/Filter.svg";
import iconGamepad from "~/../public/app-image/icons/Gamepad.svg";
import iconMoney from "~/../public/app-image/icons/Money.svg";
import { getDictionary } from "get-dictionary";
import { type Locale } from "i18n-config";

export default async function Index({params: {lang}}: {params: { lang: Locale }}) {
  const dictionary = await getDictionary(lang);
  const Nav: [string, StaticImport | undefined, string | undefined][] = [
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

  return (
    <div className="flex h-dvh w-full flex-col items-center justify-between">
      <div className="Top h-full min-h-48 w-full flex items-center justify-center lg:h-3/4">
        <h1 className="w-full text-center text-5xl font-extrabold tracking-tight text-main-color-100 lg:text-9xl">
        Toram <span className=" text-brand-color-blue">の</span>{" "}
          Calculactor
        </h1>
      </div>
      <div className="Bottom h-full w-full flex flex-1 flex-col items-center justify-between lg:h-1/4">
        <div className="Content w-full h-full p-5">
          <div className="Nav lg:invisible flex h-full w-full shrink flex-col items-center gap-2 overflow-y-auto last:mb-0">
            {Nav.map(([btnName, iconPath, url]) => {
              if (
                btnName !== undefined &&
                iconPath !== undefined &&
                url !== undefined
              ) {
                return (
                  <Link
                    href={url}
                    key={btnName}
                    className={
                      "btn-" +
                      btnName +
                      " group flex w-full flex-row items-center gap-4 bg-bg-grey-8 py-2 active:bg-brand-color-blue"
                    }
                  >
                    <div className="iconArea rounded-full px-8 py-1">
                      <Image
                        src={iconPath}
                        alt={btnName}
                        height={24}
                        width={0}
                        style={{ width: "24px", height: "auto" }}
                      />
                    </div>
                    <div className="text-base text-main-color-100">
                      {btnName}
                    </div>
                  </Link>
                );
              } else {
                return (
                  <div
                    key={btnName}
                    className={"Line h-line w-full bg-bg-grey-8"}
                  ></div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
