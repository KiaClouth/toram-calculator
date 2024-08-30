"use client";

import type { $Enums } from "@prisma/client";
import {
  type Column,
  type ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { type getDictionary } from "~/app/get-dictionary";
import { type Session } from "next-auth";
import React, { useState, type CSSProperties, useEffect } from "react";
import MonsterForm from "./monsterForm";
import Button from "../../_components/button";
import {
  IconCloudUpload,
  IconElementWind,
  IconElementDark,
  IconElementEarth,
  IconElementFire,
  IconElementLight,
  IconElementNoElement,
  IconElementWater,
  IconFilter,
} from "../../_components/iconsList";
import Dialog from "../../_components/dialog";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useStore } from "~/app/store";
import { type Monster, defaultMonster } from "~/schema/monster";
import { rApi } from "~/trpc/react";

interface Props {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
}

// 计算各星级属性的方法
export const computeMonsterAugmentedList = (monsterList: Monster[], dictionary: ReturnType<typeof getDictionary>) => {
  const monsterAugmentedList: Monster[] = [];
  monsterList.forEach((monster) => {
    // 表中记录的是1星状态下的定点王数据， 2 / 3 / 4 星的经验和HP为1星的 2 / 5 / 10 倍；物防、魔防、回避值为1星的 2 / 4 / 6 倍。
    if (monster.monsterType !== "COMMON_BOSS") {
      monsterAugmentedList.push(monster);
    } else {
      monsterAugmentedList.push(
        {
          ...monster,
          name: monster.name + " " + dictionary.ui.monster.monsterDegreeOfDifficulty[1],
        },
        {
          ...monster,
          id: monster.id + "**",
          name: monster.name + " " + dictionary.ui.monster.monsterDegreeOfDifficulty[2],
          baseLv: monster.baseLv !== null ? monster.baseLv + 10 : 0,
          experience: monster.experience !== null ? monster.experience * 2 : 0,
          maxhp: monster.maxhp !== null ? monster.maxhp * 2 : 0,
          physicalDefense: monster.physicalDefense !== null ? monster.physicalDefense * 2 : 0,
          magicalDefense: monster.magicalDefense !== null ? monster.magicalDefense * 2 : 0,
        },
        {
          ...monster,
          id: monster.id + "***",
          name: monster.name + " " + dictionary.ui.monster.monsterDegreeOfDifficulty[3],
          baseLv: monster.baseLv !== null ? monster.baseLv + 20 : 0,
          experience: monster.experience !== null ? monster.experience * 5 : 0,
          maxhp: monster.maxhp !== null ? monster.maxhp * 5 : 0,
          physicalDefense: monster.physicalDefense !== null ? monster.physicalDefense * 4 : 0,
          magicalDefense: monster.magicalDefense !== null ? monster.magicalDefense * 4 : 0,
          avoidance: monster.avoidance !== null ? monster.avoidance * 4 : 0,
        },
        {
          ...monster,
          id: monster.id + "****",
          name: monster.name + " " + dictionary.ui.monster.monsterDegreeOfDifficulty[4],
          baseLv: monster.baseLv !== null ? monster.baseLv + 40 : 0,
          experience: monster.experience !== null ? monster.experience * 10 : 0,
          maxhp: monster.maxhp !== null ? monster.maxhp * 10 : 0,
          physicalDefense: monster.physicalDefense !== null ? monster.physicalDefense * 6 : 0,
          magicalDefense: monster.magicalDefense !== null ? monster.magicalDefense * 6 : 0,
          avoidance: monster.avoidance !== null ? monster.avoidance * 6 : 0,
        },
      );
    }
  });
  return monsterAugmentedList;
};

export default function MonserPageClient(props: Props) {
  const { dictionary, session } = props;
  const monsterQuery = rApi.monster.getAll.useQuery();
  const [basicMonsterList, setBasicMonsterList] = useState<Monster[]>(monsterQuery.data ?? []);

  // 状态管理参数
  const {
    augmented,
    setAugmented,
    monsterList,
    setMonsterList,
    monsterDialogState,
    setMonsterDialogState,
    setMonsterFormState,
    filterState,
    setFilterState,
  } = useStore((state) => state.monsterPage);
  const { monster, setMonster } = useStore((state) => state);

  // 搜索框行为函数
  const handleSearchFilterChange = (value: string) => {
    const currentList = augmented ? computeMonsterAugmentedList(basicMonsterList, dictionary) : basicMonsterList;
    if (value === "" || value === null) {
      setMonsterList(currentList);
    }
    // 搜索时需要忽略的数据
    const monsterHiddenData: Array<keyof Monster> = [
      "id",
      "experience",
      "radius",
      "difficultyOfMelee",
      "difficultyOfRanged",
      "difficultyOfTank",
      "updatedAt",
      "updatedByUserId",
      "createdAt",
      "createdByUserId",
    ];
    const newMonsterList: Monster[] = [];
    currentList.forEach((monster) => {
      let filter = false;
      for (const attr in monster) {
        if (!monsterHiddenData.includes(attr as keyof Monster)) {
          const monsterAttr = monster[attr as keyof Monster]?.toString();
          if (monsterAttr?.match(value)?.input !== undefined) {
            filter = true;
          }
        }
      }
      filter ? newMonsterList.push(monster) : null;
    });
    setMonsterList(newMonsterList);
  };

  // 弹出层同名怪物列表
  const [sameNameMonsterList, setSameNameMonsterList] = useState<Monster[]>([]);
  const compusteSameNameMonsterList = (monster: Monster, monsterList: Monster[]) => {
    const list: Monster[] = [];
    monsterList.forEach((m) => {
      m.name === monster.name && m.monsterType === monster.monsterType && list.push(m);
    });
    return list.sort((monsterA, monsterB) => {
      const dateA = new Date(monsterA.updatedAt);
      const dateB = new Date(monsterB.updatedAt);
      return dateA.getTime() - dateB.getTime();
    });
  };

  // 定义不需要展示的列
  const monsterHiddenData: Array<keyof Monster> = ["id", "address", "monsterType", "updatedByUserId"];

  // 列定义
  const columns = React.useMemo<ColumnDef<Monster>[]>(
    () => [
      {
        accessorKey: "id",
        header: () => dictionary.db.models.monster.id,
        cell: (info) => info.getValue(),
        size: 200,
      },
      {
        accessorKey: "name",
        header: () => dictionary.db.models.monster.name,
        cell: (info) => info.getValue(),
        size: 220,
      },
      {
        accessorKey: "address",
        header: () => dictionary.db.models.monster.address,
        cell: (info) => info.getValue(),
        size: 150,
      },
      {
        accessorKey: "monsterType",
        header: () => dictionary.db.models.monster.monsterType,
        cell: (info) => dictionary.db.enums.MonsterType[info.getValue<$Enums.MonsterType>()],
        size: 120,
      },
      {
        accessorKey: "element",
        header: () => dictionary.db.models.monster.element,
        cell: (info) => dictionary.db.enums.Element[info.getValue<$Enums.Element>()],
        size: 120,
      },
      {
        accessorKey: "baseLv",
        header: () => dictionary.db.models.monster.baseLv,
        size: 120,
      },
      {
        accessorKey: "experience",
        header: () => dictionary.db.models.monster.experience,
        size: 120,
      },
      {
        accessorKey: "physicalDefense",
        header: () => dictionary.db.models.monster.physicalDefense,
        size: 120,
      },
      {
        accessorKey: "physicalResistance",
        header: () => dictionary.db.models.monster.physicalResistance,
        size: 120,
      },
      {
        accessorKey: "magicalDefense",
        header: () => dictionary.db.models.monster.magicalDefense,
        size: 120,
      },
      {
        accessorKey: "magicalResistance",
        header: () => dictionary.db.models.monster.magicalResistance,
        size: 120,
      },
      {
        accessorKey: "criticalResistance",
        header: () => dictionary.db.models.monster.criticalResistance,
        size: 120,
      },
      {
        accessorKey: "avoidance",
        header: () => dictionary.db.models.monster.avoidance,
        size: 100,
      },
      {
        accessorKey: "dodge",
        header: () => dictionary.db.models.monster.dodge,
        size: 100,
      },
      {
        accessorKey: "block",
        header: () => dictionary.db.models.monster.block,
        size: 100,
      },
      {
        accessorKey: "updatedAt",
        header: dictionary.db.models.monster.updatedAt,
        cell: (info) => info.getValue<Date>().toLocaleDateString(),
        size: 100,
      },
    ],
    [
      dictionary.db.enums.Element,
      dictionary.db.enums.MonsterType,
      dictionary.db.models.monster.address,
      dictionary.db.models.monster.avoidance,
      dictionary.db.models.monster.baseLv,
      dictionary.db.models.monster.block,
      dictionary.db.models.monster.criticalResistance,
      dictionary.db.models.monster.dodge,
      dictionary.db.models.monster.element,
      dictionary.db.models.monster.experience,
      dictionary.db.models.monster.id,
      dictionary.db.models.monster.magicalDefense,
      dictionary.db.models.monster.magicalResistance,
      dictionary.db.models.monster.monsterType,
      dictionary.db.models.monster.name,
      dictionary.db.models.monster.physicalDefense,
      dictionary.db.models.monster.physicalResistance,
      dictionary.db.models.monster.updatedAt,
    ],
  );

  // 创建表格
  const table = useReactTable({
    data: monsterList,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    initialState: {
      sorting: [
        {
          id: "experience",
          desc: true, // 默认按热度降序排列
        },
      ],
    },
  });

  // 虚拟表格容器
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  // 表格虚拟滚动
  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    estimateSize: () => 112, // estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    // measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" && navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  // 表头固定
  const getCommonPinningStyles = (column: Column<Monster>): CSSProperties => {
    const isPinned = column.getIsPinned();
    const isLastLeft = isPinned === "left" && column.getIsLastColumn("left");
    const isFirstRight = isPinned === "right" && column.getIsFirstColumn("right");
    const styles: CSSProperties = {
      position: isPinned ? "sticky" : "relative",
      width: column.getSize(),
      zIndex: isPinned ? 1 : 0,
    };
    if (isPinned) {
      styles.left = isLastLeft ? `${column.getStart("left")}px` : undefined;
      styles.right = isFirstRight ? `${column.getAfter("right")}px` : undefined;
      styles.borderWidth = isLastLeft ? "0px 2px 0px 0px" : isFirstRight ? "0px 0px 0px 2px" : undefined;
    }
    return styles;
  };

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const startX = e.pageX;
    const startY = e.pageY;
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      offsetX = e.pageX - startX;
      offsetY = e.pageY - startY;
      if (!isDragging) {
        // 判断是否开始拖动
        isDragging = Math.abs(offsetX) > 3 || Math.abs(offsetY) > 3;
      }
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        if (tableContainerRef.current?.parentElement) {
          tableContainerRef.current.style.transition = "none";
          tableContainerRef.current.parentElement.style.transition = "none";
          // tableContainerRef.current.scrollTop -= offsetY / 100;
          tableContainerRef.current.scrollLeft += offsetX / 100;
        }
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      if (!isDragging) {
        console.log(id);
        const targetMonster = monsterList.find((monster) => monster.id === id);
        if (targetMonster) {
          setMonster(targetMonster);
          setSameNameMonsterList(compusteSameNameMonsterList(targetMonster, monsterList));
          setMonsterDialogState(true);
          setMonsterFormState("DISPLAY");
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    console.log("--Monster Client Render");
    if (monsterQuery.isSuccess) {
      console.log("MonsterQuery.data Success");
      setBasicMonsterList(monsterQuery.data);
      setMonsterList(augmented ? computeMonsterAugmentedList(monsterQuery.data, dictionary) : monsterQuery.data);
    }
    // u键监听
    const handleUKeyPress = (e: KeyboardEvent) => {
      if (e.key === "u") {
        setMonster(defaultMonster);
        setSameNameMonsterList([]);
        setMonsterDialogState(true);
        setMonsterFormState("CREATE");
      }
    };
    document.addEventListener("keydown", handleUKeyPress);
    return () => {
      console.log("--Monster Client Unmount");
      document.removeEventListener("keydown", handleUKeyPress);
    };
  }, [
    augmented,
    basicMonsterList,
    dictionary,
    monsterQuery.data,
    monsterQuery.isSuccess,
    setMonster,
    setMonsterDialogState,
    setMonsterFormState,
    setMonsterList,
  ]);

  return (
    <main className="flex flex-col lg:w-[calc(100dvw-96px)] lg:flex-row">
      {/* <div
        className={`Module1 pointer-events-none invisible fixed left-0 top-0 z-50 flex-none basis-[0px] -translate-x-full border-transition-color-8 bg-primary-color opacity-0 backdrop-blur-xl lg:sticky lg:z-0 lg:translate-x-0 lg:border-x-1.5 lg:bg-transition-color-8`}
      >
        <div
          className={`Content flex h-dvh w-dvw flex-col gap-4 overflow-y-auto px-6 pt-8 lg:absolute lg:left-0 lg:top-0 lg:w-[260px]`}
        >
          <div className="Title flex items-center justify-between">
            <h1 className="text-lg">{dictionary.ui.filter}</h1>
            <Button level="tertiary" onClick={() => setFilterState(!filterState)}>
              X
            </Button>
          </div>
        </div>
      </div> */}
      <div className="Module2 flex w-full flex-1 overflow-hidden px-3 backdrop-blur-xl">
        <div className="LeftArea sticky top-0 z-10 flex-1"></div>
        <div
          ref={tableContainerRef}
          className={`ModuleContent h-[calc(100dvh-67px)] w-full flex-col overflow-auto lg:h-dvh lg:max-w-[1536px]`}
        >
          <div className="Title sticky left-0 mt-3 flex flex-col gap-9 py-5 lg:pt-20">
            <div className="Row flex flex-col items-center justify-between gap-10 lg:flex-row lg:justify-start lg:gap-4">
              <h1 className="Text text-left text-3xl lg:bg-transparent lg:text-4xl">
                {dictionary.ui.monster.pageTitle}
              </h1>
              <div className="Control flex flex-1 gap-2">
                <input
                  id="MonsterSearchBox"
                  type="search"
                  placeholder={dictionary.ui.searchPlaceholder}
                  className="w-full flex-1 rounded-sm border-transition-color-20 bg-transition-color-8 px-3 py-2 backdrop-blur-xl placeholder:text-accent-color-50 hover:border-accent-color-70 hover:bg-transition-color-8
                  focus:border-accent-color-70 focus:outline-none lg:flex-1 lg:rounded-none lg:border-b-1.5 lg:bg-transparent lg:px-5 lg:font-normal"
                  onChange={(e) => handleSearchFilterChange(e.target.value)}
                />
                <Button // 仅移动端显示
                  size="sm"
                  level="tertiary"
                  className="switch lg:hidden"
                  icon={<IconFilter />}
                  onClick={() => setFilterState(!filterState)}
                ></Button>
                <Button // 仅PC端显示
                  className="switch hidden lg:flex"
                  icon={<IconFilter />}
                  onClick={() => setFilterState(!filterState)}
                ></Button>

                {session?.user && (
                  <React.Fragment>
                    <Button // 仅移动端显示
                      size="sm"
                      level="tertiary"
                      icon={<IconCloudUpload />}
                      className="flex lg:hidden"
                      onClick={() => {
                        setMonster(defaultMonster);
                        setSameNameMonsterList([]);
                        setMonsterDialogState(true);
                        setMonsterFormState("CREATE");
                      }}
                    ></Button>
                    <Button // 仅PC端显示
                      level="primary"
                      icon={<IconCloudUpload />}
                      className="hidden lg:flex"
                      onClick={() => {
                        setMonster(defaultMonster);
                        setSameNameMonsterList([]);
                        setMonsterDialogState(true);
                        setMonsterFormState("CREATE");
                      }}
                    >
                      {dictionary.ui.upload} [u]
                    </Button>
                  </React.Fragment>
                )}
              </div>
            </div>
            <div className="Content flex flex-col gap-2">
              <div
                className={`FilterBox flex overflow-y-auto rounded bg-transition-color-8 ${filterState ? " max-h-[50dvh] " : " max-h-0 "}`}
              >
                <div
                  className={`Content flex h-fit flex-col gap-2 p-4 ${filterState ? " pointer-events-auto opacity-100 " : " pointer-events-none opacity-0 "} `}
                >
                  <div className="module flex flex-col gap-3">
                    <div className="title">{dictionary.ui.columnsHidden}</div>
                    <div className="content flex flex-wrap gap-2 ">
                      <Button
                        size="sm"
                        level={table.getIsAllColumnsVisible() ? "tertiary" : "primary"}
                        onClick={table.getToggleAllColumnsVisibilityHandler()}
                      >
                        ALL
                      </Button>
                      {table.getAllLeafColumns().map((column) => {
                        if (monsterHiddenData.includes(column.id as keyof Monster)) {
                          // 默认隐藏的数据
                          return;
                        }
                        return (
                          <Button
                            key={column.id}
                            size="sm"
                            level={column.getIsVisible() ? "tertiary" : "primary"}
                            onClick={column.getToggleVisibilityHandler()}
                          >
                            {typeof dictionary.db.models.monster[column.id as keyof Monster] === "string"
                              ? (dictionary.db.models.monster[column.id as keyof Monster] as string)
                              : column.id}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="module flex flex-col gap-3">
                    <div className="title">{dictionary.ui.monster.augmented}</div>
                    <div className="content flex flex-wrap gap-2 ">
                      <Button level="tertiary" onClick={() => setAugmented(!augmented)}>
                        {augmented ? "Yes" : "No"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="Discription my-3 hidden rounded-sm bg-transition-color-8 p-3 lg:block">
                {dictionary.ui.monster.description}
              </div>
            </div>
          </div>
          <table className="Table bg-transition-color-8 px-2 lg:bg-transparent">
            <thead className="TableHead sticky top-0 z-10 flex bg-primary-color">
              {table.getHeaderGroups().map((headerGroup) => {
                return (
                  <tr key={headerGroup.id} className=" flex min-w-full gap-0 border-b-2">
                    {headerGroup.headers.map((header) => {
                      const { column } = header;
                      if (monsterHiddenData.includes(column.id as keyof Monster)) {
                        // 默认隐藏的数据
                        return;
                      }
                      return (
                        <th
                          key={header.id}
                          style={{
                            ...getCommonPinningStyles(column),
                          }}
                          className="flex flex-col"
                        >
                          <div
                            {...{
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                            className={`border-1 flex-1 border-transition-color-8 px-3 py-4 text-left hover:bg-transition-color-8 lg:py-6 ${
                              header.column.getCanSort() ? "cursor-pointer select-none" : ""
                            }`}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: " ↓",
                              desc: " ↑",
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                          {/* {!header.isPlaceholder &&
                            header.column.getCanPin() && ( // 固定列
                              <div className="flex">
                                {header.column.getIsPinned() !== "left" ? (
                                  <button
                                    className="flex-1 rounded bg-transition-color-8 px-1"
                                    onClick={() => {
                                      header.column.pin("left");
                                    }}
                                  >
                                    {"←"}
                                  </button>
                                ) : null}
                                {header.column.getIsPinned() ? (
                                  <button
                                    className="flex-1 rounded bg-transition-color-8 px-1"
                                    onClick={() => {
                                      header.column.pin(false);
                                    }}
                                  >
                                    {"x"}
                                  </button>
                                ) : null}
                                {header.column.getIsPinned() !== "right" ? (
                                  <button
                                    className="flex-1 rounded bg-transition-color-8 px-1"
                                    onClick={() => {
                                      header.column.pin("right");
                                    }}
                                  >
                                    {"→"}
                                  </button>
                                ) : null}
                              </div>
                            )} */}
                        </th>
                      );
                    })}
                  </tr>
                );
              })}
            </thead>
            <tbody
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
              }}
              className="TableBody relative mt-[54px] px-2 lg:mt-[84px]"
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = table.getRowModel().rows[virtualRow.index]!;
                return (
                  <tr
                    data-index={virtualRow.index} //needed for dynamic row height measurement
                    ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                    key={row.id}
                    style={{
                      position: "absolute",
                      transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                    }}
                    className={`group flex cursor-pointer border-y-[1px] border-transition-color-8 transition-none hover:rounded hover:border-transparent hover:bg-transition-color-8 hover:font-bold lg:border-y-1.5`}
                    onMouseDown={(e) => handleMouseDown(row.getValue("id"), e)}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const { column } = cell;
                      if (monsterHiddenData.includes(column.id as keyof Monster)) {
                        // 默认隐藏的数据
                        return;
                      }

                      switch (cell.column.id as Exclude<keyof Monster, keyof typeof monsterHiddenData>) {
                        case "name":
                          return (
                            <td
                              key={cell.id}
                              style={{
                                ...getCommonPinningStyles(column),
                              }}
                              className="flex flex-col justify-center px-3 py-6 lg:py-8"
                            >
                              <span className=" text-lg font-bold">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </span>
                              <span className="text-sm font-normal text-accent-color-70">
                                {(row.getValue("address") === ("" ?? undefined ?? null) && "不知名的地方") ||
                                  row.getValue("address")}
                              </span>
                            </td>
                          );

                        case "element": {
                          const icon =
                            {
                              WATER: <IconElementWater className="h-12 w-12" />,
                              FIRE: <IconElementFire className="h-12 w-12" />,
                              EARTH: <IconElementEarth className="h-12 w-12" />,
                              WIND: <IconElementWind className="h-12 w-12" />,
                              LIGHT: <IconElementLight className="h-12 w-12" />,
                              DARK: <IconElementDark className="h-12 w-12" />,
                              NO_ELEMENT: <IconElementNoElement className="h-12 w-12" />,
                            }[cell.getValue() as keyof typeof $Enums.Element] ?? undefined;
                          return (
                            <td
                              key={cell.id}
                              style={{
                                ...getCommonPinningStyles(column),
                              }}
                              className={"flex flex-col justify-center px-3 py-6"}
                            >
                              {icon}
                            </td>
                          );
                        }

                        // 以下值需要添加百分比符号
                        case "physicalResistance":
                        case "magicalResistance":
                        case "dodge":
                        case "block":
                        case "normalAttackResistanceModifier":
                        case "physicalAttackResistanceModifier":
                        case "magicalAttackResistanceModifier":
                          return (
                            <td
                              key={cell.id}
                              style={{
                                ...getCommonPinningStyles(column),
                              }}
                              className={`flex flex-col justify-center px-3 py-6 `}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}%
                            </td>
                          );

                        case "criticalResistance":

                        default:
                          return (
                            <td
                              key={cell.id}
                              style={{
                                ...getCommonPinningStyles(column),
                              }}
                              className={`flex flex-col justify-center px-3 py-6 `}
                            >
                              {((cell) => {
                                try {
                                  const content =
                                    dictionary.db.enums[
                                      (cell.column.id.charAt(0).toLocaleUpperCase() +
                                        cell.column.id.slice(1)) as keyof typeof $Enums
                                    ][cell.getValue() as keyof (typeof $Enums)[keyof typeof $Enums]];
                                  return content;
                                } catch (error) {
                                  return flexRender(cell.column.columnDef.cell, cell.getContext());
                                }
                              })(cell)}
                            </td>
                          );
                      }
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="RightArea sticky top-0 z-10 flex-1"></div>
      </div>
      <Dialog state={monsterDialogState} setState={setMonsterDialogState}>
        {monsterDialogState && (
          <div className="Content flex w-full flex-col overflow-y-auto lg:flex-row 2xl:w-[1536px]">
            {sameNameMonsterList.length > 1 && (
              <div className="SameNameMonsterList flow-row flex flex-none basis-[8%] gap-1 overflow-x-auto overflow-y-hidden border-r-1.5 border-brand-color-1st p-3 lg:w-60 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden">
                {sameNameMonsterList.map((currentMonster) => {
                  const order = sameNameMonsterList.indexOf(currentMonster) + 1;
                  return (
                    <Button
                      key={"SameNameMonsterId" + currentMonster.id}
                      level="tertiary"
                      onClick={() => {
                        setMonster(currentMonster);
                      }}
                      active={currentMonster.id === monster.id}
                      className="SameNameMonster flex h-full basis-1/4 flex-col rounded-sm lg:h-auto lg:w-full lg:basis-auto"
                    >
                      <span className="w-full text-nowrap px-2 text-left text-lg lg:font-bold">{order}</span>
                      <span className="hidden text-left text-sm lg:block">
                        {currentMonster.updatedAt.toLocaleString()}
                      </span>
                    </Button>
                  );
                })}
              </div>
            )}
            {/* <div className="tab flex w-32 flex-col justify-center gap-1 border-r-1.5 border-brand-color-1st p-3"></div> */}
            <MonsterForm
              dictionary={dictionary}
              session={session}
              basicMonsterList={basicMonsterList}
              setBasicMonsterList={setBasicMonsterList}
            />
          </div>
        )}
      </Dialog>
    </main>
  );
}
