"use client";
import Link from "next/link";
import Image from "next/image";

const Nav = [
  ["怪物", "/app-image/icons/Calendar.svg", "/monster"],
  ["line1"],
  ["技能", "/app-image/icons/Basketball.svg", ""],
  ["装备", "/app-image/icons/Category 2.svg", ""],
  ["锻晶", "/app-image/icons/Box 2.svg", ""],
  ["宠物", "/app-image/icons/money.svg", "/pet"],
  ["消耗品", "/app-image/icons/Coins.svg", ""],
  ["line2"],
  ["机体配置", "/app-image/icons/Gamepad.svg", "/character"],
  ["连击分析", "/app-image/icons/Filter.svg", ""],
]

export default function Index() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-between">
      <div className="Top flex h-1/5 w-full items-center justify-center lg:h-3/4">
        <h1 className="w-full text-center text-2xl font-extrabold tracking-tight text-main-color-100 lg:text-7xl">
          Kiya <span className=" text-brand-color-blue">の</span>{" "}
          Toram-Calculactor
        </h1>
      </div>
      <div className="Bottom flex h-4/5 w-full flex-col items-center justify-between lg:h-1/4">
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
                        height={0}
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
