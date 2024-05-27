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
      <div className={`flex flex-1 flex-col gap-4 lg:justify-between lg:p-8`}>
        <div className="Top flex flex-col items-start justify-center gap-2 p-6 pt-20 lg:flex-1 lg:items-center lg:pt-20">
          <IconLogoText className="mb-2 h-12 w-fit rounded-md backdrop-blur lg:mb-0 lg:h-auto" />
          <div className="SearchBox border-b-none flex w-full items-center gap-1 border-transition-color-20 p-0.5 focus-within:max-w-[426px] focus-within:border-accent-color hover:max-w-[426px] hover:border-accent-color lg:max-w-[400px] lg:border-b-2">
            <input
              type="text"
              placeholder={greetings + "," + session?.user.name}
              className="w-full flex-1 rounded bg-transition-color-8 px-4 py-2 text-lg font-bold mix-blend-multiply placeholder:font-normal placeholder:text-accent-color-50 focus-within:outline-none lg:bg-transparent"
            />
            <Button
              level="tertiary"
              icon={<IconSearch />}
              className="hidden bg-transparent focus-within:outline-none lg:flex"
            ></Button>
          </div>
        </div>
        <div className="Bottom flex flex-1 lg:flex-none flex-col items-center rounded-t-md bg-accent-color lg:bg-transparent p-6 lg:py-20">
          <div className="Content flex lg:flex-1 flex-wrap gap-3 rounded-md backdrop-blur lg:bg-transition-color-8 lg:p-3">
            <Link href={"/monster"} className=" basis-[calc(33.33%-8px)] overflow-hidden flex-none lg:basis-auto">
              <Button
                className="lg:hidden group w-full flex-col rounded-md text-sm lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base bg-primary-color-10 border-primary-color-10 border-2"
                level="primary"
                icon={
                  <IconFaceBrowser className="h-10 w-10 text-brand-color-1st group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.monsters}
              </Button>
              <Button
                className="hidden lg:flex group w-full flex-col rounded-md text-sm lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
                level="primary"
                icon={
                  <IconFaceBrowser className="h-10 w-10 text-brand-color-1st group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.monsters}
              </Button>
            </Link>
            <Link href={"/skill"} className=" basis-[calc(33.33%-8px)] overflow-hidden flex-none lg:basis-auto">
              <Button
                className="lg:hidden group w-full flex-col rounded-md text-sm lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base bg-primary-color-10 border-primary-color-10 border-2"
                level="primary"
                icon={
                  <IconFaceBasketball className="h-10 w-10 text-brand-color-2nd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.skills}
              </Button>
              <Button
                className="hidden lg:flex group w-full flex-col rounded-md text-sm lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
                level="primary"
                icon={
                  <IconFaceBasketball className="h-10 w-10 text-brand-color-2nd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.skills}
              </Button>
            </Link>
            <Link href={"/equipment"} className=" basis-[calc(33.33%-8px)] overflow-hidden flex-none lg:basis-auto">
              <Button
                className="lg:hidden group w-full flex-col rounded-md text-sm lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base bg-primary-color-10 border-primary-color-10 border-2"
                level="primary"
                icon={
                  <IconFaceCategory2 className="h-10 w-10 text-brand-color-3rd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.equipments}
              </Button>
              <Button
                className="hidden lg:flex group w-full flex-col rounded-md text-sm lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
                level="primary"
                icon={
                  <IconFaceCategory2 className="h-10 w-10 text-brand-color-3rd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.equipments}
              </Button>
            </Link>
            <Link href={"/crystal"} className=" basis-[calc(33.33%-8px)] overflow-hidden flex-none lg:basis-auto">
              <Button
                className="lg:hidden group w-full flex-col rounded-md text-sm lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base bg-primary-color-10 border-primary-color-10 border-2"
                level="primary"
                icon={
                  <IconFaceBox2 className="h-10 w-10 text-brand-color-1st group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.crystals}
              </Button>
              <Button
                className="hidden lg:flex group w-full flex-col rounded-md text-sm lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
                level="primary"
                icon={
                  <IconFaceBox2 className="h-10 w-10 text-brand-color-1st group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.crystals}
              </Button>
            </Link>
            <Link href={"/pet"} className=" basis-[calc(33.33%-8px)] overflow-hidden flex-none lg:basis-auto">
              <Button
                className="lg:hidden group w-full flex-col rounded-md text-sm lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base bg-primary-color-10 border-primary-color-10 border-2"
                level="primary"
                icon={
                  <IconFaceHeart className="h-10 w-10 text-brand-color-2nd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.pets}
              </Button>
              <Button
                className="hidden lg:flex group w-full flex-col rounded-md text-sm lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
                level="primary"
                icon={
                  <IconFaceHeart className="h-10 w-10 text-brand-color-2nd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.pets}
              </Button>
            </Link>
            <Link href={"/building"} className=" basis-[calc(33.33%-8px)] overflow-hidden flex-none lg:basis-auto">
              <Button
                className="lg:hidden group w-full flex-col rounded-md text-sm lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base bg-primary-color-10 border-primary-color-10 border-2"
                level="primary"
                icon={
                  <IconFaceLayers className="h-10 w-10 text-brand-color-3rd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.items}
              </Button>
              <Button
                className="hidden lg:flex group w-full flex-col rounded-md text-sm lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
                level="primary"
                icon={
                  <IconFaceLayers className="h-10 w-10 text-brand-color-3rd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.items}
              </Button>
            </Link>
            <Link href={"/character"} className=" basis-[calc(33.33%-8px)] overflow-hidden flex-none lg:basis-auto">
              <Button
                className="lg:hidden group w-full flex-col rounded-md text-sm lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base bg-primary-color-10 border-primary-color-10 border-2"
                level="primary"
                icon={
                  <IconFaceUser className="h-10 w-10 text-brand-color-1st group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.character}
              </Button>
              <Button
                className="hidden lg:flex group w-full flex-col rounded-md text-sm lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
                level="primary"
                icon={
                  <IconFaceUser className="h-10 w-10 text-brand-color-1st group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.character}
              </Button>
            </Link>
            <Link href={"/analyze"} className=" basis-[calc(33.33%-8px)] overflow-hidden flex-none lg:basis-auto">
              <Button
                className="lg:hidden group w-full flex-col rounded-md text-sm lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base bg-primary-color-10 border-primary-color-10 border-2"
                level="primary"
                icon={
                  <IconFaceGamepad className="h-10 w-10 text-brand-color-2nd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.comboAnalyze}
              </Button>
              <Button
                className="hidden lg:flex group w-full flex-col rounded-md text-sm lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
                level="primary"
                icon={
                  <IconFaceGamepad className="h-10 w-10 text-brand-color-2nd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
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
