"use client";

import { type $Enums, type Monster } from "@prisma/client";
import {
  type ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  flexRender,
} from "@tanstack/react-table";
import { type getDictionary } from "~/app/get-dictionary";
import { type Session } from "next-auth";
import React, { type CSSProperties } from "react";
import LongSearchBox from "./monsterSearchBox";
import MonsterForm from "./monsterForm";
import Button from "../_components/button";
import { IconCloudUpload, IconFilter } from "../_components/iconsList";
import Dialog from "../_components/dialog";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useBearStore } from "~/app/store";

export default function MonserPageClient(props: {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
  monsterList: Monster[];
}) {
  const { dictionary, session, monsterList } = props;

  // 状态管理参数
  const {
    monster,
    setMonster,
    monsterDialogState,
    setMonsterDialogState,
    filterState,
    setFilterState,
  } = useBearStore((state) => state.monsterPage);

  // 定义不需要展示的列
  const hiddenData: Array<keyof Monster> = ["id", "updatedAt", "updatedById"];

  const columns = React.useMemo<ColumnDef<Monster>[]>(
    () => [
      {
        accessorKey: "id",
        header: () => dictionary.db.models.monster.id,
        cell: (info) => info.getValue(),
        size: 250,
      },
      {
        accessorKey: "name",
        header: () => dictionary.db.models.monster.name,
        cell: (info) => info.getValue(),
        size: 250,
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
        size: 110,
      },
      {
        accessorKey: "avoidance",
        header: () => dictionary.db.models.monster.avoidance,
        size: 120,
      },
      {
        accessorKey: "dodge",
        header: () => dictionary.db.models.monster.dodge,
        size: 120,
      },
      {
        accessorKey: "block",
        header: () => dictionary.db.models.monster.block,
        size: 120,
      },
      {
        accessorKey: "updatedAt",
        header: dictionary.db.models.monster.updatedAt,
        cell: (info) => {
          const currentDate = new Date();
          // 计算更新时间和当前时间的时间差（毫秒）
          const timeDifference =
            currentDate.getTime() - info.getValue<Date>().getTime();
          // 将时间差转换为天数
          const daysDifference = Math.ceil(
            timeDifference / (1000 * 60 * 60 * 24),
          );
          return daysDifference;
        },
        size: 180,
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

  const [data] = React.useState(monsterList);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const { rows } = table.getRowModel();

  // The virtualizer needs to know the scrollable container element
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
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

  const handleTrClick = (id: string) => {
    monsterList.forEach((monster) => {
      if (monster.id !== id) return;
      setMonster(monster);
      setMonsterDialogState(true);
    });
  };

  // 列粘性布局样式计算函数
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

  return (
    <main className="flex flex-1 flex-col overflow-auto lg:flex-row">
      <div
        className={`Module1 fixed left-0 top-0 z-50 lg:z-0 ${filterState ? " translate-x-0 " : " -translate-x-full "} flex-none border-transition-color-8 bg-primary-color backdrop-blur-xl lg:sticky lg:translate-x-0 lg:border-x-1.5 lg:bg-transparent ${filterState ? " pointer-events-auto visible basis-[260px] opacity-100 " : " pointer-events-none invisible basis-[0px] opacity-0 "}`}
      >
        <div className="content flex h-dvh w-dvw flex-col-reverse gap-4 overflow-y-auto px-6 pt-8 lg:absolute lg:right-0 lg:top-0 lg:w-[260px] lg:flex-col">
          <div className="module flex flex-col gap-3">
            <Button
              level="tertiary"
              onClick={() => setFilterState(!filterState)}
            >
              {dictionary.ui.monster.close}
            </Button>
            <div className="content flex flex-wrap gap-2 "></div>
          </div>
          <div className="module flex flex-col gap-3">
            <div className="title text-lg font-bold">
              {dictionary.ui.monster.columnsHidden}
            </div>
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
            <div className="title text-lg font-bold">
              {dictionary.ui.monster.columnsHidden}
            </div>
            <div className="content flex flex-wrap gap-2 "></div>
          </div>
        </div>
      </div>
      <div
        ref={tableContainerRef}
        className="Module2 flex flex-1 overflow-y-auto backdrop-blur-xl lg:px-6"
      >
        <div className="LeftArea flex-1"></div>
        <div className="ModuleContent flex flex-1 flex-col 2xl:basis-[1536px]">
          <div className="Title flex flex-1 flex-col gap-9 p-2 pt-20">
            <div className="row flex flex-col lg:flex-row">
            <h1 className="Text text-center text-2xl font-bold lg:block lg:bg-transparent lg:text-left lg:text-4xl">
              {dictionary.ui.monster.pageTitle}
            </h1>
            <div className="Control bottom-2 right-2 z-10 flex flex-1 flex-col gap-1 lg:static lg:flex-row">
              <LongSearchBox
                dictionary={dictionary}
                monsterList={monsterList}
                setMonster={setMonster}
                setMonsterDialogState={setMonsterDialogState}
              />
              <Button
                className="switch w-fit rounded-full px-2 py-2 lg:rounded lg:px-4 lg:py-2"
                icon={<IconFilter />}
                onClick={() => setFilterState(!filterState)}
              ></Button>
              {session?.user ? (
                <React.Fragment>
                  <Button
                    onClick={() => setMonsterDialogState(true)}
                    // level="primary"
                    icon={<IconCloudUpload />}
                    className="hidden lg:flex"
                  >
                    {dictionary.ui.monster.upload}
                  </Button>
                  <Button
                    onClick={() => setMonsterDialogState(true)}
                    icon={<IconCloudUpload />}
                    className="flex rounded-full px-2 py-2 lg:hidden"
                  ></Button>
                </React.Fragment>
              ) : undefined}
            </div>
            </div>
            <p className="discription my-3 hidden rounded-sm bg-transition-color-8 p-3 lg:block">
              {dictionary.ui.monster.discription}
            </p>
          </div>
          <table className="Table w-[200px] flex-none bg-transition-color-8 px-2 lg:bg-transparent overflow-x-hidden">
            <thead className="sticky top-0 z-10 flex">
              {table.getHeaderGroups().map((headerGroup) => {
                return (
                  <tr
                    key={headerGroup.id}
                    className=" flex min-w-full gap-0 border-b-2 bg-primary-color px-2"
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
                            className={`border-1 flex-1 border-transition-color-8 py-3 text-left hover:bg-transition-color-8 lg:py-7 ${
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
                              asc: " 🔼",
                              desc: " 🔽",
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
              className="relative z-0 mt-[54px] px-2 lg:mt-[84px]"
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index]!;
                return (
                  <tr
                    data-index={virtualRow.index} //needed for dynamic row height measurement
                    ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                    key={row.id}
                    style={{
                      position: "absolute",
                      transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                    }}
                    className={`group flex cursor-pointer border-y-1.5 border-transition-color-8 px-2 py-6 transition-none hover:border-brand-color-1st`}
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
        <div className="RightArea flex-1"></div>
      </div>
      {monsterDialogState ? (
        <Dialog state={monsterDialogState} setState={setMonsterDialogState}>
          {<MonsterForm dictionary={dictionary} defaultMonster={monster} />}
        </Dialog>
      ) : (
        ""
      )}
    </main>
  );
}
