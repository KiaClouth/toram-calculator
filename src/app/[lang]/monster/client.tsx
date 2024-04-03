"use client";

import type { $Enums, Monster } from "@prisma/client";
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
import Button from "../_components/button";
import { IconCloudUpload, IconFilter } from "../_components/iconsList";
import Dialog from "../_components/dialog";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useBearStore } from "~/app/store";
import { defaultMonster } from "~/app/store";

export default function MonserPageClient(props: {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
  monsterList: Monster[];
}) {
  const { dictionary, session } = props;
  const [defaultMonsterList, setDefaultMonsterList] = useState(
    props.monsterList,
  );

  // 状态管理参数
  const {
    monster,
    setMonster,
    monsterList,
    setMonsterList,
    monsterDialogState,
    setMonsterDialogState,
    setMonsterFormState,
    filterState,
    setFilterState,
  } = useBearStore((state) => state.monsterPage);

  // 搜索框行为函数
  const handleSearchFilterChange = (value: string) => {
    if (value === "" || value === null) {
      setMonsterList(defaultMonsterList);
    }
    // 搜索时需要忽略的数据
    const hiddenData: Array<keyof Monster> = [
      "id",
      // "updatedAt",
      "updatedByUserId",
      "state",
      "createdByUserId",
    ];
    const newMonsterList: Monster[] = [];
    defaultMonsterList.forEach((monster) => {
      let filter = false;
      for (const attr in monster) {
        if (!hiddenData.includes(attr as keyof Monster)) {
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

  // 定义不需要展示的列
  const hiddenData: Array<keyof Monster> = ["id", "updatedByUserId"];

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
        size: 150,
      },
      {
        accessorKey: "monsterType",
        header: () => dictionary.db.models.monster.monsterType,
        cell: (info) =>
          dictionary.db.enums.MonsterType[info.getValue<$Enums.MonsterType>()],
        size: 120,
      },
      {
        accessorKey: "element",
        header: () => dictionary.db.models.monster.element,
        cell: (info) =>
          dictionary.db.enums.Element[info.getValue<$Enums.Element>()],
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
      {
        accessorKey: "usageCount",
        header: () => dictionary.db.models.monster.usageCount,
        size: 140,
      },
    ],
    [
      dictionary.db.enums.Element,
      dictionary.db.enums.MonsterType,
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
      dictionary.db.models.monster.usageCount,
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
          id: 'baseLv',
          desc: true, // 默认按等级降序排列
        },
      ]
    },
  });

  // 虚拟表格容器
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  // 表格虚拟滚动
  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    estimateSize: () => 33, // estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    // measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  // 表格行点击事件
  const handleTrClick = (id: string) => {
    monsterList.forEach((monster) => {
      if (monster.id !== id) return;
      setMonster(monster);
      setMonsterDialogState(true);
      setMonsterFormState("UPDATE");
    });
  };

  // 表头固定
  const getCommonPinningStyles = (column: Column<Monster>): CSSProperties => {
    const isPinned = column.getIsPinned();
    const isLastLeft = isPinned === "left" && column.getIsLastColumn("left");
    const isFirstRight =
      isPinned === "right" && column.getIsFirstColumn("right");
    const styles: CSSProperties = {
      position: isPinned ? "sticky" : "relative",
      width: column.getSize(),
      zIndex: isPinned ? 1 : 0,
    };
    if (isPinned) {
      styles.left = isLastLeft ? `${column.getStart("left")}px` : undefined;
      styles.right = isFirstRight ? `${column.getAfter("right")}px` : undefined;
      styles.borderWidth = isLastLeft
        ? "0px 2px 0px 0px"
        : isFirstRight
          ? "0px 0px 0px 2px"
          : undefined;
    }
    return styles;
  };

  useEffect(() => {
    setMonsterList(defaultMonsterList);
    // u键监听
    const handleEscapeKeyPress = (e: KeyboardEvent) => {
      if (e.key === "u") {
        setMonsterDialogState(!monsterDialogState);
      }
    };
    document.addEventListener("keydown", handleEscapeKeyPress);
    return () => {
      document.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, [defaultMonsterList, monsterDialogState, setMonsterDialogState, setMonsterList]);

  return (
    <main className="flex flex-col lg:w-[calc(100dvw-96px)] lg:flex-row">
      <div
        className={`Module1 fixed left-0 top-0 z-50 lg:z-0 ${filterState ? " translate-x-0 " : " -translate-x-full "} flex-none border-transition-color-8 bg-primary-color backdrop-blur-xl lg:sticky lg:translate-x-0 lg:border-x-1.5 lg:bg-transition-color-8 ${filterState ? " pointer-events-auto visible basis-[260px] opacity-100 " : " pointer-events-none invisible basis-[0px] opacity-0 "}`}
      >
        <div
          className={`Content flex h-dvh w-dvw flex-col-reverse gap-4 overflow-y-auto px-6 pt-8 lg:absolute lg:left-0 lg:top-0 lg:w-[260px] lg:flex-col`}
        >
          <div className="Title flex items-center justify-between">
            <h1 className="text-lg">{dictionary.ui.monster.filter}</h1>
            <Button
              level="tertiary"
              onClick={() => setFilterState(!filterState)}
            >
              X
            </Button>
          </div>
          <div className="module flex flex-col gap-3">
            <div className="title">{dictionary.ui.monster.columnsHidden}</div>
            <div className="content flex flex-wrap gap-2 ">
              <Button
                size="sm"
                level={table.getIsAllColumnsVisible() ? "tertiary" : "primary"}
                onClick={table.getToggleAllColumnsVisibilityHandler()}
              >
                ALL
              </Button>
              {table.getAllLeafColumns().map((column) => {
                if (hiddenData.includes(column.id as keyof Monster)) {
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
                    {dictionary.db.models.monster[column.id as keyof Monster]}
                  </Button>
                );
              })}
            </div>
          </div>
          <div className="module flex flex-col gap-3">
            <div className="title">{dictionary.ui.monster.columnsHidden}</div>
            <div className="content flex flex-wrap gap-2 "></div>
          </div>
        </div>
      </div>
      <div className="Module2 flex flex-1 px-3 backdrop-blur-xl">
        <div className="LeftArea sticky top-0 z-10 flex-1"></div>
        <div
          ref={tableContainerRef}
          className="ModuleContent h-[calc(100dvh-67px)] w-full flex-col overflow-auto lg:h-dvh 2xl:w-[1536px]"
        >
          <div className="Title sticky left-0 flex flex-col gap-9 py-5 lg:pb-10 lg:pt-20">
            <div className="Row flex flex-row items-center justify-between gap-4 lg:justify-start">
              <h1 className="Text hidden text-left text-2xl font-bold lg:block lg:bg-transparent lg:text-4xl">
                {dictionary.ui.monster.pageTitle}
              </h1>
              <div className="Control flex flex-1 gap-2">
                <input
                  type="search"
                  placeholder={dictionary.ui.monster.searchPlaceholder}
                  className="flex-1 border-b-1.5 border-transition-color-20 bg-transparent py-2 backdrop-blur-xl placeholder:text-accent-color-50
                  hover:border-accent-color-70 hover:bg-transition-color-8 focus:border-accent-color-70 focus:outline-none lg:flex-1 lg:px-5 lg:font-normal"
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
                {session?.user ? (
                  <React.Fragment>
                    <Button // 仅移动端显示
                      size="sm"
                      level="tertiary"
                      icon={<IconCloudUpload />}
                      className="flex lg:hidden"
                      onClick={() => setMonsterDialogState(true)}
                    ></Button>
                    <Button // 仅PC端显示
                      level="primary"
                      icon={<IconCloudUpload />}
                      className="hidden lg:flex"
                      onClick={() => {
                        setMonster(defaultMonster);
                        setMonsterDialogState(true);
                        setMonsterFormState("CREATE");
                      }}
                    >
                      {dictionary.ui.monster.upload} [u]
                    </Button>
                  </React.Fragment>
                ) : undefined}
              </div>
            </div>
            <div className="Discription my-3 hidden rounded-sm bg-transition-color-8 p-3 lg:block">
              {dictionary.ui.monster.discription}
            </div>
          </div>
          <table className="Table bg-transition-color-8 px-2 lg:bg-transparent">
            <thead className="TableHead sticky top-0 z-10 flex bg-primary-color">
              {table.getHeaderGroups().map((headerGroup) => {
                return (
                  <tr
                    key={headerGroup.id}
                    className=" flex min-w-full gap-0 border-b-2"
                  >
                    {headerGroup.headers.map((header) => {
                      const { column } = header;
                      if (hiddenData.includes(column.id as keyof Monster)) {
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
                            className={`border-1 flex-1 border-transition-color-8 px-3 py-3 text-left hover:bg-transition-color-8 lg:py-3 ${
                              header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : ""
                            }`}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {{
                              asc: " ↓",
                              desc: " ↑",
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                          {/* {!header.isPlaceholder &&
                              header.column.getCanPin() && ( // 固定列
                                <div className="flex gap-1 p-2">
                                  {header.column.getIsPinned() !== "left" ? (
                                    <button
                                      className="flex-1 rounded bg-transition-color-8 px-1"
                                      onClick={() => {
                                        header.column.pin("left");
                                      }}
                                    >
                                      {"<"}
                                    </button>
                                  ) : null}
                                  {header.column.getIsPinned() ? (
                                    <button
                                      className="flex-1 rounded bg-transition-color-8 px-1"
                                      onClick={() => {
                                        header.column.pin(false);
                                      }}
                                    >
                                      X
                                    </button>
                                  ) : null}
                                  {header.column.getIsPinned() !== "right" ? (
                                    <button
                                      className="flex-1 rounded bg-transition-color-8 px-1"
                                      onClick={() => {
                                        header.column.pin("right");
                                      }}
                                    >
                                      {">"}
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
                    className={`group flex cursor-pointer border-y-1.5 border-transition-color-8 transition-none hover:border-brand-color-1st`}
                    onClick={() => handleTrClick(row.getValue("id"))}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const { column } = cell;
                      if (hiddenData.includes(column.id as keyof Monster)) {
                        // 默认隐藏的数据
                        return;
                      }
                      return (
                        <td
                          key={cell.id}
                          style={{
                            ...getCommonPinningStyles(column),
                          }}
                          className={
                            `px-3 py-6 ` +
                            ((key: string, value) => {
                              switch (key) {
                                case "element": // 元素
                                  switch (value) {
                                    case "WATER":
                                      return "text-water";
                                    case "FIRE":
                                      return "text-fire";
                                    case "EARTH":
                                      return "text-earth";
                                    case "WIND":
                                      return "text-wind";
                                    case "LIGHT":
                                      return "text-light";
                                    case "DARK":
                                      return "text-dark";
                                    default:
                                      return "";
                                  }
                                default:
                                  return "";
                              }
                            })(cell.column.id, cell.getValue())
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="RightArea sticky top-0 z-10 flex-1"></div>
      </div>
      {monsterDialogState ? (
        session ? (
          <Dialog state={monsterDialogState} setState={setMonsterDialogState}>
            {
              <MonsterForm
                dictionary={dictionary}
                defaultMonster={monster}
                setDefaultMonsterList={setDefaultMonsterList}
              />
            }
          </Dialog>
        ) : undefined
      ) : undefined}
    </main>
  );
}
