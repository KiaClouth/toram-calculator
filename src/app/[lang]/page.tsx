import { getDictionary } from "~/app/get-dictionary";
import { type Locale } from "~/app/i18n-config";
import React from "react";
import Filing from "./_components/filing";
import {
  IconFaceBasketball,
  IconFaceBox2,
  IconFaceBrowser,
  IconFaceCategory2,
  IconFaceGamepad,
  IconFaceHeart,
  IconFaceLayers,
  IconFaceUser,
  IconLogoText,
  IconSearch,
} from "./_components/iconsList";
import Button from "./_components/button";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import RandomBallBackground from "./_components/randomBallBg";
import { sApi } from "~/trpc/server";

export default async function Index({ params: { lang } }: { params: { lang: Locale } }) {
  // const monsterList = await sApi.monster.getUserVisbleList.query();
  // const skillList = await sApi.skill.getUserVisbleList.query();
  // // const equipmentList = await sApi.equipment.getUserVisbleList.query();
  // const crystalList = await sApi.crystal.getUserVisbleList.query();
  // const petList = await sApi.pet.getUserVisbleList.query();
  // const consumableList = await sApi.consumable.getUserVisbleList.query();
  // const characterList = await sApi.character.getUserVisbleList.query();

  const dictionary = getDictionary(lang);
  const session = await getServerAuthSession();
  const now = new Date().getHours();
  let greetings = dictionary.ui.index.goodMorning;
  if (now >= 13 && now < 18) {
    greetings = dictionary.ui.index.goodAfternoon;
  } else if ((now >= 18 && now < 24) || now < 5) {
    greetings = dictionary.ui.index.goodEvening;
  }

  return (
    <React.Fragment>
      <div className={`flex flex-1 flex-col justify-between p-8`}>
        <div className="Top flex flex-col items-start justify-center gap-6 pt-8 lg:flex-1 lg:items-center lg:pt-20">
          <IconLogoText className="h-12 w-fit rounded-md backdrop-blur lg:h-auto" />
          <div className="SearchBox flex w-full items-center gap-1 border-b-2 border-transition-color-20 p-0.5 focus-within:max-w-[426px] focus-within:border-accent-color hover:max-w-[426px] hover:border-accent-color lg:max-w-[400px]">
            <input
              type="text"
              placeholder={greetings + "," + session?.user.name}
              className="flex-1 bg-transparent px-4 py-2 text-lg font-bold mix-blend-multiply placeholder:font-normal placeholder:text-accent-color-50 focus-within:outline-none"
            />
            <Button
              level="tertiary"
              icon={<IconSearch />}
              className=" bg-transparent focus-within:outline-none"
            ></Button>
          </div>
        </div>
        <div className="Bottom flex flex-col items-center rounded-md lg:py-20">
          <div className="Content flex-co flex flex-1 flex-wrap gap-3 rounded-md backdrop-blur lg:flex-row lg:bg-transition-color-8 lg:p-3">
            <Link href={"/monster"} className=" basis-[calc(50%-6px)] lg:basis-auto">
              <Button
                className="group w-full flex-col rounded-md px-4 py-3 lg:w-fit lg:flex-row"
                level="primary"
                icon={<IconFaceBrowser className=" text-brand-color-1st group-hover:text-primary-color" />}
              >
                {dictionary.ui.root.monsters}
              </Button>
            </Link>
            <Link href={"/skill"} className=" basis-[calc(50%-6px)] lg:basis-auto">
              <Button
                className="group w-full flex-col rounded-md px-4 py-3 lg:w-fit lg:flex-row"
                level="primary"
                icon={<IconFaceBasketball className=" text-brand-color-2nd group-hover:text-primary-color" />}
              >
                {dictionary.ui.root.skills}
              </Button>
            </Link>
            <Link href={"/equipment"} className=" basis-[calc(50%-6px)] lg:basis-auto">
              <Button
                className="group w-full flex-col rounded-md px-4 py-3 lg:w-fit lg:flex-row"
                level="primary"
                icon={<IconFaceCategory2 className=" text-brand-color-3rd group-hover:text-primary-color" />}
              >
                {dictionary.ui.root.equipments}
              </Button>
            </Link>
            <Link href={"/crystal"} className=" basis-[calc(50%-6px)] lg:basis-auto">
              <Button
                className="group w-full flex-col rounded-md px-4 py-3 lg:w-fit lg:flex-row"
                level="primary"
                icon={<IconFaceBox2 className=" text-brand-color-1st group-hover:text-primary-color" />}
              >
                {dictionary.ui.root.crystals}
              </Button>
            </Link>
            <Link href={"/pet"} className=" basis-[calc(50%-6px)] lg:basis-auto">
              <Button
                className="group w-full flex-col rounded-md px-4 py-3 lg:w-fit lg:flex-row"
                level="primary"
                icon={<IconFaceHeart className=" text-brand-color-2nd group-hover:text-primary-color" />}
              >
                {dictionary.ui.root.pets}
              </Button>
            </Link>
            <Link href={"/building"} className=" basis-[calc(50%-6px)] lg:basis-auto">
              <Button
                className="group w-full flex-col rounded-md px-4 py-3 lg:w-fit lg:flex-row"
                level="primary"
                icon={<IconFaceLayers className=" text-brand-color-3rd group-hover:text-primary-color" />}
              >
                {dictionary.ui.root.items}
              </Button>
            </Link>
            <Link href={"/character"} className=" basis-[calc(50%-6px)] lg:basis-auto">
              <Button
                className="group w-full flex-col rounded-md px-4 py-3 lg:w-fit lg:flex-row"
                level="primary"
                icon={<IconFaceUser className=" text-brand-color-1st group-hover:text-primary-color" />}
              >
                {dictionary.ui.root.character}
              </Button>
            </Link>
            <Link href={"/analyze"} className=" basis-[calc(50%-6px)] lg:basis-auto">
              <Button
                className="group w-full flex-col rounded-md px-4 py-3 lg:w-fit lg:flex-row"
                level="primary"
                icon={<IconFaceGamepad className=" text-brand-color-2nd group-hover:text-primary-color" />}
              >
                {dictionary.ui.root.comboAnalyze}
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Filing />
      <RandomBallBackground />
    </React.Fragment>
  );
}
