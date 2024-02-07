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

export default async function Index({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = getDictionary(lang);
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
  const now = new Date().getHours();
  let greetings = dictionary.ui.index.goodMorning;
  if (now >= 13 && now < 18) {
    greetings = dictionary.ui.index.goodAfternoon;
  } else if ((now >= 18 && now < 24) || now < 5) {
    greetings = dictionary.ui.index.goodEvening;
  }
  return (
    <div className="Index flex flex-1 flex-col overflow-x-hidden">
    <div className="jumbo fixed top-0 left-0 w-dvw h-dvh -z-50 opacity-50"></div>
      <div className="Top flex flex-1 flex-col justify-center">
        <h1 className="Title text-center text-5xl font-extrabold tracking-tight text-main-color-100 lg:text-9xl">
          Toram <span className=" text-brand-color-blue">の</span>{" "}
          Calculactor
        </h1>
        <span className=" hidden text-center">{greetings}</span>
      </div>
      <div className="Bottom flex flex-initial flex-col">
        <div className="Content flex flex-1 flex-col p-5">
        </div>
      </div>
    </div>
  );
}
