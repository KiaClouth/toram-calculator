"use client";
import { type getDictionary } from "~/app/get-dictionary";
import React, { useEffect } from "react";
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
import { type Session } from "next-auth";
import * as _ from "lodash-es";
import { type SkillCost, type SkillEffect, type Skill } from "~/server/api/routers/skill";
import { type Monster } from "~/server/api/routers/monster";
import { type Crystal } from "~/server/api/routers/crystal";
type Related =
  | {
      key: string;
      value: string;
    }
  | undefined;

type Result =
  | {
      id: string;
      name: string;
      relateds: Related[];
    }
  | undefined;

type FinalResult = {
  monsterResults: Result[];
  skillResults: Result[];
  crystalResults: Result[];
};

export default function IndexPageClient(props: {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
  monsterList: Monster[];
  skillList: Skill[];
  crystalList: Crystal[];
}) {
  const { dictionary, session, skillList, monsterList, crystalList } = props;
  const [greetings, setGreetings] = React.useState(dictionary.ui.index.goodMorning);
  const [searchInputFocused, setSearchInputFocused] = React.useState(false);
  const [searchInputValue, setSearchInputValue] = React.useState("");
  const [searchResult, setSearchResult] = React.useState<FinalResult>({
    monsterResults: [],
    skillResults: [],
    crystalResults: [],
  });
  const [resultDialogOpened, setResultDialogOpened] = React.useState(false);

  useEffect(() => {
    // 问候语计算
    const now = new Date().getHours();
    if (now >= 13 && now < 18) {
      setGreetings(dictionary.ui.index.goodAfternoon);
    } else if ((now >= 18 && now < 24) || now < 5) {
      setGreetings(dictionary.ui.index.goodEvening);
    }

    // 搜索函数
    const monsterHiddenData: Array<keyof Monster> = ["id", "updatedAt", "updatedByUserId", "state", "createdByUserId", "specialBehavior"];
    const skillHiddenData: Array<keyof (Skill & SkillEffect & SkillCost)> = [
      "id",
      "state",
      "skillEffectId",
      "belongToskillId",
      "updatedAt",
      "updatedByUserId",
      "createdAt",
      "createdByUserId",
    ];
    const crystalHiddenData: Array<keyof Crystal> = [
      "id",
      "state",
      "updatedAt",
      "updatedByUserId",
      "createdAt",
      "createdByUserId",
    ];

    const keyWordSearch = <T extends Record<string, unknown>>(
      obj: T,
      keyWord: string,
      hiddenData: string[],
      path: string[] = [],
    ) => {
      const relateds: Related[] = [];
      Object.keys(obj).forEach((key) => {
        const currentPath = [...path, key];
        if (hiddenData.some((data) => data === key)) return;
        if (_.isArray(obj[key])) {
          const currentArr = obj[key] as unknown[];
          currentArr.forEach((item) => {
            keyWordSearch(item as Record<string, unknown>, keyWord, hiddenData, currentPath);
          });
        }
        if (_.isObject(obj[key])) {
          const currentObj = obj[key] as Record<string, unknown>;
          keyWordSearch(currentObj, keyWord, hiddenData, currentPath);
        }
        if (_.isString(obj[key])) {
          const value = obj[key] as string;
          if (value.match(keyWord)) {
            console.log(currentPath.join("."), value);
            relateds.push({ key: currentPath.join("."), value: value });
          }
        }
      });
      if (relateds.length > 0) {
        return { id: obj.id as string, name: obj.name as string, relateds: relateds };
      }
    };

    const searchMonster = (key: string) => {
      const result: Result[] = [];
      monsterList.forEach((monster) => {
        keyWordSearch(monster, key, monsterHiddenData)
          ? result.push(keyWordSearch(monster, key, monsterHiddenData))
          : null;
      });
      return result;
    };

    const searchSkill = (key: string) => {
      const result: Result[] = [];
      skillList.forEach((skill) => {
        keyWordSearch(skill, key, skillHiddenData) ? result.push(keyWordSearch(skill, key, skillHiddenData)) : null;
      });
      return result;
    };

    const searchCrystal = (key: string) => {
      const result: Result[] = [];
      crystalList.forEach((crystal) => {
        keyWordSearch(crystal, key, crystalHiddenData)
          ? result.push(keyWordSearch(crystal, key, crystalHiddenData))
          : null;
      });
      return result;
    };

    const search = (key: string) => {
      if (key === "" || key === null) {
        setResultDialogOpened(false);
        return;
      }
      setResultDialogOpened(true);
      const finalResult: FinalResult = {
        monsterResults: searchMonster(key),
        skillResults: searchSkill(key),
        crystalResults: searchCrystal(key),
      };
      console.log(finalResult);
      setSearchResult(finalResult);
    };

    // enter键监听
    const handleEnterKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && searchInputFocused) {
        search(searchInputValue);
      }
    };

    // 监听绑带与清除
    document.addEventListener("keydown", handleEnterKeyPress);

    return () => {
      document.removeEventListener("keydown", handleEnterKeyPress);
    };
  }, [
    crystalList,
    dictionary.ui.index.goodAfternoon,
    dictionary.ui.index.goodEvening,
    monsterList,
    searchInputFocused,
    searchInputValue,
    skillList,
  ]);

  return (
    <React.Fragment>
      <div className={`flex flex-1 flex-col justify-between gap-4 lg:p-8`}>
        <div className="Top flex flex-1 flex-col p-6 lg:flex-1 lg:items-center lg:justify-center lg:pt-20">
          <div className="Greetings flex flex-1 flex-col items-center justify-center gap-2 pb-12 lg:flex-none">
            <IconLogoText className="mb-2 h-12 w-fit rounded-md backdrop-blur lg:mb-0 lg:h-auto" />
            <h1 className="py-4 text-accent-color-70 lg:hidden">{greetings + ",  " + session?.user.name}</h1>
          </div>
          <div className="SearchBox border-b-none flex w-full items-center gap-1 border-transition-color-20 p-0.5 focus-within:max-w-[426px] focus-within:border-accent-color hover:max-w-[426px] hover:border-accent-color lg:max-w-[400px] lg:border-b-2">
            <input
              type="text"
              placeholder={greetings + "," + session?.user.name}
              onFocus={() => setSearchInputFocused(true)}
              onBlur={() => setSearchInputFocused(false)}
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              className="hidden w-full flex-1 rounded px-4 py-2 text-lg font-bold mix-blend-multiply placeholder:text-base placeholder:font-normal placeholder:text-accent-color-50 focus-within:outline-none lg:flex lg:bg-transparent"
            />
            <input
              type="text"
              placeholder={dictionary.ui.searchPlaceholder}
              onFocus={() => setSearchInputFocused(true)}
              onBlur={() => setSearchInputFocused(false)}
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              className="w-full flex-1 rounded bg-transition-color-8 px-4 py-2 text-lg font-bold mix-blend-multiply backdrop-blur placeholder:font-normal placeholder:text-accent-color-50 lg:hidden"
            />
            <Button
              level="tertiary"
              icon={<IconSearch />}
              className="hidden bg-transparent focus-within:outline-none lg:flex"
            ></Button>
          </div>
        </div>
        <div className="Bottom flex flex-none flex-col items-center rounded-t-md bg-accent-color p-6 lg:bg-transparent lg:py-20">
          <div className="Content flex flex-wrap gap-3 rounded-md backdrop-blur lg:flex-1 lg:bg-transition-color-8 lg:p-3">
            <Link href={"/monster"} className=" flex-none basis-[calc(33.33%-8px)] overflow-hidden lg:basis-auto">
              <Button
                className="group w-full flex-col rounded-md border-2 border-primary-color-10 bg-primary-color-10 text-sm lg:hidden lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
                level="primary"
                icon={
                  <IconFaceBrowser className="h-10 w-10 text-brand-color-1st group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.monsters}
              </Button>
              <Button
                className="group hidden w-full flex-col rounded-md text-sm lg:flex lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
                level="primary"
                icon={
                  <IconFaceBrowser className="h-10 w-10 text-brand-color-1st group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.monsters}
              </Button>
            </Link>
            <Link href={"/skill"} className=" flex-none basis-[calc(33.33%-8px)] overflow-hidden lg:basis-auto">
              <Button
                className="group w-full flex-col rounded-md border-2 border-primary-color-10 bg-primary-color-10 text-sm lg:hidden lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
                level="primary"
                icon={
                  <IconFaceBasketball className="h-10 w-10 text-brand-color-2nd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.skills}
              </Button>
              <Button
                className="group hidden w-full flex-col rounded-md text-sm lg:flex lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
                level="primary"
                icon={
                  <IconFaceBasketball className="h-10 w-10 text-brand-color-2nd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.skills}
              </Button>
            </Link>
            <Link href={"/equipment"} className=" flex-none basis-[calc(33.33%-8px)] overflow-hidden lg:basis-auto">
              <Button
                className="group w-full flex-col rounded-md border-2 border-primary-color-10 bg-primary-color-10 text-sm lg:hidden lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
                level="primary"
                icon={
                  <IconFaceCategory2 className="h-10 w-10 text-brand-color-3rd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.equipments}
              </Button>
              <Button
                className="group hidden w-full flex-col rounded-md text-sm lg:flex lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
                level="primary"
                icon={
                  <IconFaceCategory2 className="h-10 w-10 text-brand-color-3rd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.equipments}
              </Button>
            </Link>
            <Link href={"/crystal"} className=" flex-none basis-[calc(33.33%-8px)] overflow-hidden lg:basis-auto">
              <Button
                className="group w-full flex-col rounded-md border-2 border-primary-color-10 bg-primary-color-10 text-sm lg:hidden lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
                level="primary"
                icon={
                  <IconFaceBox2 className="h-10 w-10 text-brand-color-1st group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.crystals}
              </Button>
              <Button
                className="group hidden w-full flex-col rounded-md text-sm lg:flex lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
                level="primary"
                icon={
                  <IconFaceBox2 className="h-10 w-10 text-brand-color-1st group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.crystals}
              </Button>
            </Link>
            <Link href={"/pet"} className=" flex-none basis-[calc(33.33%-8px)] overflow-hidden lg:basis-auto">
              <Button
                className="group w-full flex-col rounded-md border-2 border-primary-color-10 bg-primary-color-10 text-sm lg:hidden lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
                level="primary"
                icon={
                  <IconFaceHeart className="h-10 w-10 text-brand-color-2nd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.pets}
              </Button>
              <Button
                className="group hidden w-full flex-col rounded-md text-sm lg:flex lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
                level="primary"
                icon={
                  <IconFaceHeart className="h-10 w-10 text-brand-color-2nd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.pets}
              </Button>
            </Link>
            <Link href={"/building"} className=" flex-none basis-[calc(33.33%-8px)] overflow-hidden lg:basis-auto">
              <Button
                className="group w-full flex-col rounded-md border-2 border-primary-color-10 bg-primary-color-10 text-sm lg:hidden lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
                level="primary"
                icon={
                  <IconFaceLayers className="h-10 w-10 text-brand-color-3rd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.items}
              </Button>
              <Button
                className="group hidden w-full flex-col rounded-md text-sm lg:flex lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
                level="primary"
                icon={
                  <IconFaceLayers className="h-10 w-10 text-brand-color-3rd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.items}
              </Button>
            </Link>
            <Link href={"/character"} className=" flex-none basis-[calc(33.33%-8px)] overflow-hidden lg:basis-auto">
              <Button
                className="group w-full flex-col rounded-md border-2 border-primary-color-10 bg-primary-color-10 text-sm lg:hidden lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
                level="primary"
                icon={
                  <IconFaceUser className="h-10 w-10 text-brand-color-1st group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.character}
              </Button>
              <Button
                className="group hidden w-full flex-col rounded-md text-sm lg:flex lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
                level="primary"
                icon={
                  <IconFaceUser className="h-10 w-10 text-brand-color-1st group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.character}
              </Button>
            </Link>
            <Link href={"/analyze"} className=" flex-none basis-[calc(33.33%-8px)] overflow-hidden lg:basis-auto">
              <Button
                className="group w-full flex-col rounded-md border-2 border-primary-color-10 bg-primary-color-10 text-sm lg:hidden lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
                level="primary"
                icon={
                  <IconFaceGamepad className="h-10 w-10 text-brand-color-2nd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                {dictionary.ui.root.comboAnalyze}
              </Button>
              <Button
                className="group hidden w-full flex-col rounded-md text-sm lg:flex lg:w-fit lg:flex-row lg:px-4 lg:py-3 lg:text-base"
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
        <div
          className={`ResultDialog ${resultDialogOpened ? "pointer-events-auto visible translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-1/2 opacity-0"} items-center bg-primary-color`}
        >
          {JSON.stringify(searchResult)}
        </div>
      </div>
    </React.Fragment>
  );
}
