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
  IconLeft,
  IconLogoText,
  IconSearch,
} from "./_components/iconsList";
import Button from "./_components/button";
import Link from "next/link";
import { type Session } from "next-auth";
import * as _ from "lodash-es";
import { motion } from "framer-motion";
import { evaluate } from "mathjs";
import { type Monster } from "~/schema/monster";
import { type Skill } from "~/schema/skill";
import { type Crystal } from "~/schema/crystal";
import { type SkillEffect } from "~/schema/skillEffect";
import { type SkillCost } from "~/schema/skillCost";
import { rApi } from "~/trpc/react";
import { type ConvertToAllString } from "../dictionaries/type";

type DataType = Monster | Skill | Crystal;
type DataName = "monsters" | "skills" | "crystals";

type Related =
  | {
      key: string;
      value: string | number;
    }
  | undefined;

type Result =
  | {
      name: string;
      relateds: Related[];
      data: DataType;
    }
  | undefined;

export default function IndexPageClient(props: {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
}) {
  const { dictionary, session } = props;
  const monsterQuery = rApi.monster.getAll.useQuery();
  const skillQuery = rApi.skill.getAll.useQuery();
  const crystalQuery = rApi.crystal.getAll.useQuery();
  const searchButtonRef = React.useRef<HTMLButtonElement>(null);

  type FinalResult = Partial<Record<DataName, Result[]>>;

  const [greetings, setGreetings] = React.useState(dictionary.ui.index.goodMorning);
  const [searchInputFocused, setSearchInputFocused] = React.useState(false);
  const [searchInputValue, setSearchInputValue] = React.useState("");
  const [searchResult, setSearchResult] = React.useState<FinalResult>({
    monsters: [],
    skills: [],
    crystals: [],
  });
  const [resultDialogOpened, setResultDialogOpened] = React.useState(false);
  const [isNullResult, setIsNullResult] = React.useState(true);
  const [resultListSate, setResultListState] = React.useState<boolean[]>([]);
  const [currentCardId, setCurrentCardId] = React.useState<string>("defaultId");

  const [isPC, setIsPC] = React.useState(true);

  // 搜索函数
  const monsterHiddenData = useMemo<Array<keyof Monster>>(
    () => ["id", "updatedAt", "updatedByUserId", "createdByUserId"],
    [],
  );
  const skillHiddenData = useMemo<Array<keyof (Skill & SkillEffect & SkillCost)>>(
    () => ["id", "skillEffectId", "belongToskillId", "updatedAt", "updatedByUserId", "createdAt", "createdByUserId"],
    [],
  );
  const crystalHiddenData = useMemo<Array<keyof Crystal>>(
    () => ["id", "front", "updatedAt", "updatedByUserId", "createdAt", "createdByUserId", "modifiersListId"],
    [],
  );

  // 对象属性字符串匹配方法
  const keyWordSearch = useCallback(
    <T extends Record<string, unknown>>(
      obj: T,
      keyWord: string | number,
      hiddenData: string[],
      path: string[] = [],
      relateds: Related[] = [],
    ): Related[] | undefined => {
      Object.keys(obj).forEach((key) => {
        const currentPath = [...path, key];
        if (hiddenData.some((data) => data === key)) return;
        if (_.isArray(obj[key])) {
          const currentArr = obj[key] as unknown[];
          currentArr.forEach((item) => {
            const subRealateds = keyWordSearch(item as Record<string, unknown>, keyWord, hiddenData, currentPath);
            if (subRealateds) relateds = relateds.concat(subRealateds);
          });
        } else if (_.isObject(obj[key])) {
          const currentObj = obj[key] as Record<string, unknown>;
          const subRealateds = keyWordSearch(currentObj, keyWord, hiddenData, currentPath);
          if (subRealateds) relateds = relateds.concat(subRealateds);
        } else if (_.isNumber(obj[key])) {
          // console.log("数字类型：", currentPath.join("."), obj[key]);
          const value = obj[key] as number;
          if (value === keyWord) {
            relateds.push({ key: currentPath.join("."), value: value });
          } else if (typeof keyWord === "string") {
            try {
              // const node = parse(keyWord);
              // const nodeString = node.toString();
              // math表达式匹配
              // console.log("准备评估：", keyWord, "上下文为：", { [`${key}`]: value }, "节点类型为：", node.type);
              if (evaluate(keyWord, { [`${key}`]: value })) {
                relateds.push({ key: currentPath.join("."), value: value });
              }
            } catch (error) {}
          }
        } else if (_.isString(obj[key])) {
          const value = obj[key] as string;
          // console.log("字符串类型：", currentPath.join("."), obj[key]);
          if (typeof keyWord === "string") {
            // console.log("在：", value, "中寻找：", keyWord);
            if (value.match(keyWord)) {
              // console.log("符合条件");
              // 常规字符串匹配
              relateds.push({ key: currentPath.join("."), value: value });
            }
          }
        } else {
          // console.log("未知类型：", currentPath.join("."), obj[key]);
        }
      });
      if (relateds.length > 0) {
        // console.log("在：", path.join("."), "匹配的结果：", relateds);
        return relateds;
      }
    },
    [],
  );

  // 变量对象，返回所有字符串属性值组成的数组
  function getAllValues(obj: Record<string, unknown>) {
    const values: string[] = [];

    function collectValues(o: object) {
      _.forOwn(o, (value) => {
        if (_.isObject(value) && !_.isArray(value)) {
          collectValues(value);
        } else if (_.isString(value)) {
          values.push(value);
        }
      });
    }

    collectValues(obj);
    return values;
  }

  const searchInList = useCallback(
    <T extends Monster | Skill | Crystal>(
      list: T[],
      key: string | number,
      dictionary: ConvertToAllString<T>,
      hiddenData: string[],
    ) => {
      if (!key) return;
      if (typeof key === "string") {
        // 字典替换
        // 获取所有字典值
        console.log(getAllValues(dictionary));
      }
      const result: Result[] = [];
      list.forEach((item) => {
        keyWordSearch(item, key, hiddenData)
          ? result.push({
              name: item.name,
              relateds: keyWordSearch(item, key, hiddenData)!,
              data: item,
            })
          : null;
      });
      // console.log("搜索结果：", result);
      return result;
    },
    [keyWordSearch],
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
        searchButtonRef.current?.click();
      }
    };

    // esc键监听
    const handleEscapeKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setResultDialogOpened(false);
      }
    };

    // 浏览器后退事件监听
    const handlePopState = () => {
      setResultDialogOpened(false);
      history.replaceState(null, "", location.href);
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
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("keydown", handleEnterKeyPress);
      document.removeEventListener("keydown", handleEscapeKeyPress);
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [dictionary.ui.index.goodAfternoon, dictionary.ui.index.goodEvening, searchInputFocused, searchInputValue]);

  return (
    <React.Fragment>
      <motion.div
        initial={false}
        animate={resultDialogOpened ? "open" : "closed"}
        className={`Client flex max-h-[100dvh] max-w-[100dvw] flex-1 flex-col justify-between lg:mx-auto lg:max-w-[1536px] lg:p-8`}
      >
        <motion.div
         className="QueryStarus hidden lg:flex flex-col fixed left-10 top-10 text-xs text-accent-color-30"
        >
          <motion.span>MonsterList: {monsterQuery.status}</motion.span>
          <motion.span>SkillList: {skillQuery.status}</motion.span>
          <motion.span>CrystalList:{crystalQuery.status}</motion.span>
        </motion.div>
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
            <h1 className={`py-4 text-accent-color-70 lg:hidden`}>
              {greetings + ",  " + (session?.user.name ?? dictionary.ui.adventurer)}
            </h1>
          </motion.div>
          <motion.div className="FunctionBox flex w-full flex-col items-center justify-center lg:flex-row">
            <motion.div
              className="BackButton hidden w-full flex-none self-start lg:flex lg:w-60"
              animate={resultDialogOpened ? "open" : "closed"}
              layout
              variants={{
                open: {
                  opacity: 1,
                  margin: isPC ? "0rem 0rem 0rem 0rem" : "0rem 0rem 0.75rem 0rem",
                  pointerEvents: "auto",
                },
                closed: {
                  opacity: 0,
                  margin: isPC ? "0rem 0rem 0rem 0rem" : "0rem 0rem -3rem 0rem",
                  pointerEvents: "none",
                },
              }}
            >
              <Button
                level="quaternary"
                onClick={() => {
                  setResultDialogOpened(false);
                }}
                className="w-full"
              >
                <IconBack />
                <span className="w-full text-left">{dictionary.ui.back}</span>
              </Button>
            </motion.div>
            <motion.div
              className={`SearchBox border-b-none box-content flex w-full items-center gap-1 border-transition-color-20 p-0.5 focus-within:border-accent-color hover:border-accent-color  lg:border-b-2 lg:focus-within:px-4 lg:hover:px-4`}
              animate={resultDialogOpened ? "open" : "closed"}
              variants={{
                open: {
                  width: `100%`,
                },
                closed: {
                  width: isPC ? `426px` : `100%`,
                },
              }}
            >
              <input
                id="searchInput-PC"
                type="text"
                placeholder={greetings + "," + (session?.user.name ?? dictionary.ui.adventurer)}
                onFocus={() => setSearchInputFocused(true)}
                onBlur={() => setSearchInputFocused(false)}
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                className="hidden w-full flex-1 rounded px-4 py-2 text-lg font-bold mix-blend-multiply placeholder:text-base placeholder:font-normal placeholder:text-accent-color-50 focus-within:outline-none dark:mix-blend-normal lg:flex lg:bg-transparent"
              />
              <input
                id="searchInput-Mobile"
                type="text"
                placeholder={dictionary.ui.searchPlaceholder}
                onFocus={() => setSearchInputFocused(true)}
                onBlur={() => setSearchInputFocused(false)}
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                className="w-full flex-1 rounded bg-transition-color-8 px-4 py-2 text-lg font-bold mix-blend-multiply backdrop-blur placeholder:font-normal placeholder:text-accent-color-50 dark:mix-blend-normal lg:hidden"
              />
              <Button
                ref={searchButtonRef}
                level="tertiary"
                icon={<IconSearch />}
                className="flex focus-within:outline-none lg:bg-transparent"
                onClick={() => {
                  setIsNullResult(true);
                  if (searchInputValue === "" || searchInputValue === null) {
                    setResultDialogOpened(false);
                    return;
                  }
                  if (!resultDialogOpened) {
                    setResultDialogOpened(true);
                    history.pushState({ popup: true }, "");
                  }

                  const parsedInput = parseFloat(searchInputValue);
                  const isNumber = !isNaN(parsedInput) && searchInputValue.trim() !== "";
                  const searchValue = isNumber ? parsedInput : searchInputValue;

                  const finalResult: FinalResult = {
                    monsters: monsterQuery.isSuccess
                      ? searchInList(monsterQuery.data, searchValue, dictionary.db.models.monster, monsterHiddenData)
                      : [],
                    skills: skillQuery.isSuccess
                      ? searchInList(skillQuery.data, searchValue, dictionary.db.models.skill, skillHiddenData)
                      : [],
                    crystals: crystalQuery.isSuccess
                      ? searchInList(crystalQuery.data, searchValue, dictionary.db.models.crystal, crystalHiddenData)
                      : [],
                  };
                  setSearchResult(finalResult);
                  // 动态初始化列表状态
                  const resultListSate: boolean[] = [];
                  Object.entries(finalResult).forEach(([_key, value]) => {
                    if (value.length > 0) {
                      setIsNullResult(false);
                    }
                    resultListSate.push(true);
                  });
                  setResultListState(resultListSate);
                }}
              ></Button>
            </motion.div>
            <motion.div className="hidden w-60 flex-none lg:flex"></motion.div>
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
              transitionEnd: {
                opacity: 1,
              },
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
              <motion.p
                className="NullResultTips text-center leading-loose text-accent-color-70"
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
              >
                {dictionary.ui.root.nullSearchResultTips.split("\n").map((line, index) => (
                  <motion.span
                    key={index}
                    variants={{
                      open: {
                        opacity: 1,
                        y: 0,
                        transition: { type: "spring", stiffness: 300, damping: 24 },
                      },
                      closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
                    }}
                  >
                    {line}
                    <br />
                  </motion.span>
                ))}
              </motion.p>
            </div>
          ) : (
            <motion.div
              variants={{
                open: {
                  clipPath: "inset(0% 0% 0% 0% round 12px)",
                  transition: {
                    type: "spring",
                    bounce: 0,
                    duration: 0.7,
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
              {Object.entries(searchResult).map(([key, value], groupIndex) => {
                let icon: React.ReactNode = null;
                let groupName = "未知分类";
                switch (key) {
                  case "skills":
                    icon = <IconBasketball />;
                    groupName = dictionary.ui.root.skills;
                    break;
                  case "crystals":
                    icon = <IconBox2 />;
                    groupName = dictionary.ui.root.crystals;
                    break;
                  case "monsters":
                    icon = <IconCalendar />;
                    groupName = dictionary.ui.root.monsters;
                    break;
                  default:
                    break;
                }

                return (
                  value.length > 0 && (
                    <motion.div className="RsultGroup flex flex-col gap-1" key={key}>
                      <motion.button
                        onClick={() =>
                          setResultListState([
                            ...resultListSate.slice(0, groupIndex),
                            !resultListSate[groupIndex],
                            ...resultListSate.slice(groupIndex + 1),
                          ])
                        }
                        className={`Group flex cursor-pointer justify-center gap-2 ${resultListSate[groupIndex] ? "bg-transition-color-8" : " bg-primary-color"} rounded-md px-3 py-4`}
                      >
                        {icon}
                        <span className="w-full text-left">
                          {groupName} [{value.length}]
                        </span>
                        {resultListSate[groupIndex] ? (
                          <IconLeft className="rotate-[360deg]" />
                        ) : (
                          <IconLeft className=" rotate-[270deg]" />
                        )}
                      </motion.button>
                      <motion.div
                        className="Content flex flex-col gap-1"
                        transition={{
                          ease: "easeInOut",
                        }}
                        variants={{
                          open: {
                            transition: {
                              delayChildren: 0.3,
                              staggerChildren: 0.05,
                            },
                          },
                          closed: {},
                        }}
                      >
                        {value.map((item, index) => {
                          return (
                            <motion.button
                              key={index}
                              className={`Item group flex flex-col gap-1 ${resultListSate[groupIndex] ? "" : "hidden"} rounded-md border border-transition-color-20 bg-primary-color p-3`}
                              variants={{
                                open: {
                                  opacity: 1,
                                  y: 0,
                                  transition: { type: "spring", stiffness: 300, damping: 24 },
                                },
                                closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
                              }}
                              onClick={() => {
                                if (item?.data.id === currentCardId) {
                                  setCurrentCardId("defaultId");
                                } else {
                                  setCurrentCardId(item?.data.id ?? "未知ID");
                                }
                              }}
                            >
                              <div className="Name border-b-2 border-transparent p-1 font-bold group-hover:border-accent-color">
                                {item?.name}
                              </div>
                              <div className="Value flex w-full flex-col flex-wrap p-1 text-sm text-accent-color-70 group-hover:text-accent-color">
                                {item?.relateds.map((related, index) => {
                                  return (
                                    <motion.div key={index} className="Related w-fit pr-2">
                                      <span>
                                        {related?.key}: {related?.value}
                                      </span>
                                    </motion.div>
                                  );
                                })}
                              </div>
                              <motion.div
                                className={`Data ${currentCardId === item?.data.id ? "flex" : "hidden"} w-full flex-1 flex-wrap rounded-md bg-transition-color-8 p-1`}
                                // animate={currentCardId === item?.data.id ? "open" : "closed"}
                                // layout
                                // variants={{
                                //   open: {
                                //     height: "auto",
                                //     clipPath: "inset(0% 0% 0% 0% round 4px)",
                                //     transition: {
                                //       bounce: 0,
                                //       duration: isPC ? 0.1 : 0.3,
                                //     },
                                //   },
                                //   closed: {
                                //     height: 0,
                                //     clipPath: "inset(10% 50% 10% 50% round 4px)",
                                //     transition: {
                                //       bounce: 0,
                                //       duration: isPC ? 0 : 0.3,
                                //     },
                                //   },
                                // }}
                              >
                                {JSON.stringify(item?.data, null, 2)
                                  .split(",")
                                  .map((line, index) => (
                                    <motion.span key={index} className="text-left lg:basis-1/4">
                                      {line}
                                      <br />
                                    </motion.span>
                                  ))}
                              </motion.div>
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    </motion.div>
                  )
                );
              })}
            </motion.div>
          )}
        </motion.div>
        <motion.div
          className={`Bottom flex-none flex-col items-center bg-accent-color dark:bg-transition-color-8 lg:bg-transparent dark:lg:bg-transparent`}
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
                className="group w-full flex-col rounded-md border-2 border-primary-color-10 bg-primary-color-10 dark:bg-primary-color dark:text-accent-color lg:w-fit lg:flex-row lg:bg-accent-color lg:px-4 lg:py-3"
                level="primary"
                icon={
                  <IconFaceBrowser className="h-10 w-10 text-brand-color-1st group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                <span className="text-ellipsis text-nowrap text-sm lg:text-base">{dictionary.ui.root.monsters}</span>
              </Button>
            </Link>
            <Link href={"/skill"} className=" flex-none basis-[calc(33.33%-8px)] overflow-hidden lg:basis-auto">
              <Button
                className="group w-full flex-col rounded-md border-2 border-primary-color-10 bg-primary-color-10 dark:bg-primary-color dark:text-accent-color lg:w-fit lg:flex-row lg:bg-accent-color lg:px-4 lg:py-3"
                level="primary"
                icon={
                  <IconFaceBasketball className="h-10 w-10 text-brand-color-2nd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                <span className="text-ellipsis text-nowrap text-sm lg:text-base">{dictionary.ui.root.skills}</span>
              </Button>
            </Link>
            <Link href={"/equipment"} className=" flex-none basis-[calc(33.33%-8px)] overflow-hidden lg:basis-auto">
              <Button
                className="group w-full flex-col rounded-md border-2 border-primary-color-10 bg-primary-color-10 dark:bg-primary-color dark:text-accent-color lg:w-fit lg:flex-row lg:bg-accent-color lg:px-4 lg:py-3"
                level="primary"
                icon={
                  <IconFaceCategory2 className="h-10 w-10 text-brand-color-3rd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                <span className="text-ellipsis text-nowrap text-sm lg:text-base">{dictionary.ui.root.equipments}</span>
              </Button>
            </Link>
            <Link href={"/crystal"} className=" flex-none basis-[calc(33.33%-8px)] overflow-hidden lg:basis-auto">
              <Button
                className="group w-full flex-col rounded-md border-2 border-primary-color-10 bg-primary-color-10 dark:bg-primary-color dark:text-accent-color lg:w-fit lg:flex-row lg:bg-accent-color lg:px-4 lg:py-3"
                level="primary"
                icon={
                  <IconFaceBox2 className="h-10 w-10 text-brand-color-1st group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                <span className="text-ellipsis text-nowrap text-sm lg:text-base">{dictionary.ui.root.crystals}</span>
              </Button>
            </Link>
            <Link href={"/pet"} className=" flex-none basis-[calc(33.33%-8px)] overflow-hidden lg:basis-auto">
              <Button
                className="group w-full flex-col rounded-md border-2 border-primary-color-10 bg-primary-color-10 dark:bg-primary-color dark:text-accent-color lg:w-fit lg:flex-row lg:bg-accent-color lg:px-4 lg:py-3"
                level="primary"
                icon={
                  <IconFaceHeart className="h-10 w-10 text-brand-color-2nd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                <span className="text-ellipsis text-nowrap text-sm lg:text-base">{dictionary.ui.root.pets}</span>
              </Button>
            </Link>
            <Link href={"/building"} className=" flex-none basis-[calc(33.33%-8px)] overflow-hidden lg:basis-auto">
              <Button
                className="group w-full flex-col rounded-md border-2 border-primary-color-10 bg-primary-color-10 dark:bg-primary-color dark:text-accent-color lg:w-fit lg:flex-row lg:bg-accent-color lg:px-4 lg:py-3"
                level="primary"
                icon={
                  <IconFaceLayers className="h-10 w-10 text-brand-color-3rd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                <span className="text-ellipsis text-nowrap text-sm lg:text-base">{dictionary.ui.root.items}</span>
              </Button>
            </Link>
            <Link href={"/character"} className=" flex-none basis-[calc(33.33%-8px)] overflow-hidden lg:basis-auto">
              <Button
                className="group w-full flex-col rounded-md border-2 border-primary-color-10 bg-primary-color-10 dark:bg-primary-color dark:text-accent-color lg:w-fit lg:flex-row lg:bg-accent-color lg:px-4 lg:py-3"
                level="primary"
                icon={
                  <IconFaceUser className="h-10 w-10 text-brand-color-1st group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                <span className="text-ellipsis text-nowrap text-sm lg:text-base">{dictionary.ui.root.character}</span>
              </Button>
            </Link>
            <Link href={"/analyze"} className=" flex-none basis-[calc(33.33%-8px)] overflow-hidden lg:basis-auto">
              <Button
                className="group w-full flex-col rounded-md border-2 border-primary-color-10 bg-primary-color-10 dark:bg-primary-color dark:text-accent-color lg:w-fit lg:flex-row lg:bg-accent-color lg:px-4 lg:py-3"
                level="primary"
                icon={
                  <IconFaceGamepad className="h-10 w-10 text-brand-color-2nd group-hover:text-primary-color lg:h-6 lg:w-6" />
                }
              >
                <span className="text-ellipsis text-nowrap text-sm lg:text-base">
                  {dictionary.ui.root.comboAnalyze}
                </span>
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </React.Fragment>
  );
}
