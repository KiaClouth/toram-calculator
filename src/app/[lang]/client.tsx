"use client";
import { type getDictionary } from "~/app/get-dictionary";
import React, { useCallback, useEffect, useMemo } from "react";
import {
  IconBack,
  IconBasketball,
  IconBox2,
  IconCalendar,
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
import { motion } from "framer-motion";
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

export default function IndexPageClient(props: {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
  monsterList: Monster[];
  skillList: Skill[];
  crystalList: Crystal[];
}) {
  const { dictionary, session, skillList, monsterList, crystalList } = props;

  type FinalResult = Partial<Record<keyof (typeof dictionary)["ui"]["root"], Result[]>>;

  const [greetings, setGreetings] = React.useState(dictionary.ui.index.goodMorning);
  const [searchInputFocused, setSearchInputFocused] = React.useState(false);
  const [searchInputValue, setSearchInputValue] = React.useState("");
  const [searchResult, setSearchResult] = React.useState<FinalResult>({
    monsters: [],
    skills: [],
    crystals: [],
  });
  const [resultDialogOpened, setResultDialogOpened] = React.useState(false);
  const [resultTaleContent, setResultTaleContent] = React.useState<Result[]>([]);
  const [isNullResult, setIsNullResult] = React.useState(true);

  const [isPC, setIsPC] = React.useState(true);

  // 搜索函数
  const monsterHiddenData: Array<keyof Monster> = useMemo(
    () => ["id", "updatedAt", "updatedByUserId", "state", "createdByUserId", "specialBehavior"],
    [],
  );
  const skillHiddenData: Array<keyof (Skill & SkillEffect & SkillCost)> = useMemo(
    () => [
      "id",
      "state",
      "skillEffectId",
      "belongToskillId",
      "updatedAt",
      "updatedByUserId",
      "createdAt",
      "createdByUserId",
    ],
    [],
  );
  const crystalHiddenData: Array<keyof Crystal> = useMemo(
    () => ["id", "state", "updatedAt", "updatedByUserId", "createdAt", "createdByUserId", "modifiersListId"],
    [],
  );

  const keyWordSearch = useCallback(
    <T extends Record<string, unknown>>(obj: T, keyWord: string, hiddenData: string[], path: string[] = []) => {
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
            relateds.push({ key: currentPath.join("."), value: value });
          }
        }
      });
      if (relateds.length > 0) {
        return { id: obj.id as string, name: obj.name as string, relateds: relateds };
      }
    },
    [],
  );

  const searchMonster = useCallback(
    (key: string) => {
      const result: Result[] = [];
      monsterList.forEach((monster) => {
        keyWordSearch(monster, key, monsterHiddenData)
          ? result.push(keyWordSearch(monster, key, monsterHiddenData))
          : null;
      });
      return result;
    },
    [keyWordSearch, monsterHiddenData, monsterList],
  );

  const searchSkill = useCallback(
    (key: string) => {
      const result: Result[] = [];
      skillList.forEach((skill) => {
        keyWordSearch(skill, key, skillHiddenData) ? result.push(keyWordSearch(skill, key, skillHiddenData)) : null;
      });
      return result;
    },
    [keyWordSearch, skillHiddenData, skillList],
  );

  const searchCrystal = useCallback(
    (key: string) => {
      const result: Result[] = [];
      crystalList.forEach((crystal) => {
        keyWordSearch(crystal, key, crystalHiddenData)
          ? result.push(keyWordSearch(crystal, key, crystalHiddenData))
          : null;
      });
      return result;
    },
    [crystalHiddenData, crystalList, keyWordSearch],
  );

  const search = useCallback(
    (key: string) => {
      setIsNullResult(true);
      if (key === "" || key === null) {
        setResultDialogOpened(false);
        return;
      }
      setResultDialogOpened(true);
      const finalResult: FinalResult = {
        monsters: searchMonster(key),
        skills: searchSkill(key),
        crystals: searchCrystal(key),
      };
      setSearchResult(finalResult);
      Object.entries(finalResult).forEach(([_key, value]) => {
        if (value.length > 0) {
          setIsNullResult(false);
          setResultTaleContent(value);
        }
      });
    },
    [searchCrystal, searchMonster, searchSkill],
  );

  useEffect(() => {
    // 问候语计算
    const now = new Date().getHours();
    if (now >= 13 && now < 18) {
      setGreetings(dictionary.ui.index.goodAfternoon);
    } else if ((now >= 18 && now < 24) || now < 5) {
      setGreetings(dictionary.ui.index.goodEvening);
    }
    // enter键监听
    const handleEnterKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && searchInputFocused) {
        search(searchInputValue);
      }
    };

    // esc键监听
    const handleEscapeKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setResultDialogOpened(false);
      }
    };

    // 媒体查询
    const mediaQuery = window.matchMedia("(max-width: 1024px)");

    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setIsPC(!e.matches);
    };

    // 设置初始状态
    setIsPC(!mediaQuery.matches);

    // 监听绑带与清除
    document.addEventListener("keydown", handleEnterKeyPress);
    document.addEventListener("keydown", handleEscapeKeyPress);
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      document.removeEventListener("keydown", handleEnterKeyPress);
      document.removeEventListener("keydown", handleEscapeKeyPress);
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, [
    dictionary.ui.index.goodAfternoon,
    dictionary.ui.index.goodEvening,
    search,
    searchInputFocused,
    searchInputValue,
  ]);

  return (
    <React.Fragment>
      <motion.div
        initial={false}
        animate={resultDialogOpened ? "open" : "closed"}
        className={`Client flex max-h-[100dvh] max-w-[100dvw] flex-1 flex-col justify-between lg:mx-auto lg:max-w-[1536px] lg:p-8`}
      >
        <motion.div
          initial={false}
          className={`Top flex flex-col items-center justify-center lg:px-0`}
          animate={resultDialogOpened ? "open" : "closed"}
          variants={{
            open: {
              flex: "0 0 auto",
              padding: isPC ? "0rem" : "0.75rem",
              paddingTop: isPC ? "0rem" : "0.75rem",
              paddingBottom: "0.75rem",
            },
            closed: {
              flex: "1 1 0%",
              padding: "1.5rem",
              paddingTop: isPC ? "5rem" : "1.5rem",
              paddingBottom: "1.5rem",
            },
          }}
        >
          <motion.div
            className={`Greetings flex-col items-center justify-center gap-2 overflow-hidden lg:flex-none  `}
            animate={resultDialogOpened ? "open" : "closed"}
            variants={{
              open: {
                opacity: 0,
                paddingBottom: "0rem",
                flex: "0 0 auto",
                display: "none",
              },
              closed: {
                opacity: 1,
                paddingBottom: "3rem",
                flex: isPC ? "0 0 auto" : "1 1 0%",
                display: "flex",
              },
            }}
          >
            <motion.div className={`LogoBox mb-2 overflow-hidden rounded-md backdrop-blur lg:mb-0`}>
              <IconLogoText className="h-12 w-fit lg:h-auto" />
            </motion.div>
            <h1 className={`py-4 text-accent-color-70 lg:hidden`}>{greetings + ",  " + session?.user.name}</h1>
          </motion.div>
          <motion.div className="FunctionBox flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
            <motion.div
              animate={resultDialogOpened ? "open" : "closed"}
              variants={{
                open: {
                  opacity: 1,
                  display: "block",
                },
                closed: {
                  opacity: 0,
                  display: "none",
                },
              }}
              className="BackButton flex-none w-full lg:w-60"
            >
              <Button
                level="quaternary"
                onClick={() => {
                  setResultDialogOpened(false);
                }}
              >
                <IconBack />
                <span className="w-full text-left">{dictionary.ui.back}</span>
              </Button>
            </motion.div>
            <motion.div
              className={`SearchBox ${resultDialogOpened ? "max-w-full" : "lg:max-w-[400px] lg:focus-within:max-w-[426px] lg:hover:max-w-[426px]"} border-b-none flex w-full items-center gap-1 border-transition-color-20 p-0.5  focus-within:border-accent-color hover:border-accent-color lg:border-b-2`}
              variants={{
                open: {
                  maxWidth: `${screen.width}px`,
                },
                closed: {
                  maxWidth: isPC ? `400px` : `${screen.width}px`,
                },
              }}
            >
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
                onClick={() => search(searchInputValue)}
              ></Button>
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div
          className={`Result flex h-full flex-col gap-1 overflow-hidden lg:flex-row lg:p-0`}
          animate={resultDialogOpened ? "open" : "closed"}
          variants={{
            open: {
              flex: "1 1 0%",
              transform: "translateY(0px)",
              padding: isPC ? "0rem" : "0.75rem",
              paddingTop: "0rem",
              opacity: 1,
            },
            closed: {
              flex: "0 0 0%",
              transform: "translateY(50%)",
              padding: "0rem",
              opacity: 0,
            },
          }}
        >
          {isNullResult ? (
            <div className="NullResult flex h-full flex-1 flex-col items-center justify-center gap-12 p-6 lg:p-0">
              <span className="NullResultWarring text-xl font-bold leading-loose lg:text-2xl">
                {dictionary.ui.root.nullSearchResultWarring}
              </span>
              <p className="NullResultTips text-center leading-loose text-accent-color-70">
                {dictionary.ui.root.nullSearchResultTips.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            </div>
          ) : (
            <React.Fragment>
              <motion.div
                variants={{
                  open: {
                    clipPath: "inset(0% 0% 0% 0% round 12px)",
                    transition: {
                      type: "spring",
                      bounce: 0,
                      duration: 0.7,
                      delayChildren: 0.3,
                      staggerChildren: 0.05,
                    },
                  },
                  closed: {
                    clipPath: "inset(10% 50% 90% 50% round 12px)",
                    transition: {
                      type: "spring",
                      bounce: 0,
                      duration: 0.3,
                    },
                  },
                }}
                className="Tab flex w-full gap-1 self-start bg-primary-color py-1 lg:w-60 lg:flex-col lg:gap-2 lg:rounded-md lg:bg-transition-color-8 lg:p-3"
              >
                {searchResult.monsters && searchResult.monsters?.length > 0 && (
                  <Button
                    className="lg:w-full"
                    level="tertiary"
                    onClick={() => {
                      searchResult.monsters && setResultTaleContent(searchResult.monsters);
                    }}
                  >
                    <IconCalendar />
                    <span className="w-full text-left">{dictionary.ui.root.monsters}</span>
                  </Button>
                )}
                {searchResult.skills && searchResult.skills.length > 0 && (
                  <Button
                    className="lg:w-full"
                    level="tertiary"
                    onClick={() => {
                      searchResult.skills && setResultTaleContent(searchResult.skills);
                    }}
                  >
                    <IconBasketball />
                    <span className="w-full text-left">{dictionary.ui.root.skills}</span>
                  </Button>
                )}
                {searchResult.crystals && searchResult.crystals.length > 0 && (
                  <Button
                    className="lg:w-full"
                    level="tertiary"
                    onClick={() => {
                      searchResult.crystals && setResultTaleContent(searchResult.crystals);
                    }}
                  >
                    <IconBox2 />
                    <span className="w-full text-left">{dictionary.ui.root.crystals}</span>
                  </Button>
                )}
              </motion.div>
              <motion.div
                variants={{
                  open: {
                    clipPath: "inset(0% 0% 0% 0% round 12px)",
                    transition: {
                      type: "spring",
                      bounce: 0,
                      duration: 0.7,
                      delayChildren: 0.3,
                      staggerChildren: 0.05,
                    },
                  },
                  closed: {
                    clipPath: "inset(10% 50% 90% 50% round 12px)",
                    transition: {
                      type: "spring",
                      bounce: 0,
                      duration: 0.3,
                    },
                  },
                }}
                className={`Content flex h-full flex-1 flex-col gap-2 overflow-y-auto rounded-md bg-transition-color-8 p-2 backdrop-blur-md`}
              >
                {resultTaleContent.map((item, index) => {
                  return (
                    <motion.button
                      key={index}
                      className="Item group flex flex-col gap-1 rounded-md border border-transition-color-20 bg-primary-color p-3"
                      variants={{
                        open: {
                          opacity: 1,
                          y: 0,
                          transition: { type: "spring", stiffness: 300, damping: 24 },
                        },
                        closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
                      }}
                    >
                      <div className="Name border-b-2 border-transparent p-1 font-bold group-hover:border-accent-color">
                        {item?.name}
                      </div>
                      <div className="Value p-1 text-sm text-accent-color-70 group-hover:text-accent-color">
                        {item?.relateds.map((related, index) => {
                          return (
                            <div key={index} className="pr-2">
                              {related?.key}: {related?.value}
                            </div>
                          );
                        })}
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            </React.Fragment>
          )}
        </motion.div>
        <motion.div
          className={`Bottom flex-none flex-col items-center bg-accent-color lg:bg-transparent`}
          animate={resultDialogOpened ? "open" : "closed"}
          variants={{
            open: {
              opacity: 0,
              padding: 0,
              display: "none",
            },
            closed: {
              opacity: 1,
              padding: "1.5rem",
              paddingTop: isPC ? "5rem" : "1.5rem",
              paddingBottom: isPC ? "5rem" : "1.5rem",
              display: "flex",
            },
          }}
        >
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
        </motion.div>
      </motion.div>
    </React.Fragment>
  );
}
