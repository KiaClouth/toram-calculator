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
import SkillForm from "./skillForm";
import Button from "../_components/button";
import {
  IconCloudUpload,
  IconFilter,
} from "../_components/iconsList";
import Dialog from "../_components/dialog";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useBearStore } from "~/app/store";
import { defaultSkill } from "~/app/store";
import { type Skill } from "~/server/api/routers/skill";

export default function MonserPageClient(props: {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
  skillList: Skill[];
}) {
  const { dictionary, session } = props;
  const [defaultSkillList, setDefaultSkillList] = useState(props.skillList);

  // 状态管理参数
  const {
    setSkill,
    skillList,
    setSkillList,
    skillDialogState,
    setSkillDialogState,
    setSkillFormState,
    filterState,
    setFilterState,
  } = useBearStore((state) => state.skillPage);

  // 搜索框行为函数
  const handleSearchFilterChange = (value: string) => {
    if (value === "" || value === null) {
      setSkillList(defaultSkillList);
    }
    // 搜索时需要忽略的数据
    const hiddenData: Array<keyof Skill> = [
      "id",
      "state",
      "updatedAt",
      "updatedByUserId",
      "createdAt",
      "createdByUserId",
    ];
    const newSkillList: Skill[] = [];
    defaultSkillList.forEach((skill) => {
      let filter = false;
      for (const attr in skill) {
        if (!hiddenData.includes(attr as keyof Skill)) {
          const skillAttr = skill[attr as keyof Skill]?.toString();
          if (skillAttr?.match(value)?.input !== undefined) {
            filter = true;
          }
        }
      }
      filter ? newSkillList.push(skill) : null;
    });
    setSkillList(newSkillList);
  };

  // 定义不需要展示的列
  const hiddenData: Array<keyof Skill> = ["id"];

  // 列定义
  const columns = React.useMemo<ColumnDef<Skill>[]>(
    () => [
      {
        accessorKey: "id",
        header: () => dictionary.db.models.skill.id,
        cell: (info) => info.getValue(),
        size: 200,
      },
      {
        accessorKey: "name",
        header: () => dictionary.db.models.skill.name,
        cell: (info) => info.getValue(),
        size: 180,
      },
      {
        accessorKey: "element",
        header: dictionary.db.models.skill.element,
        cell: (info) => info.getValue(),
        size: 180,
      },
      {
        accessorKey: "skillTreeName",
        header: dictionary.db.models.skill.skillTreeName,
        cell: (info) => info.getValue(),
        size: 180,
      },
      {
        accessorKey: "skillType",
        header: dictionary.db.models.skill.skillType,
        cell: (info) => info.getValue(),
        size: 180,
      },
      {
        accessorKey: "updatedAt",
        header: dictionary.db.models.skill.updatedAt,
        cell: (info) => info.getValue<Date>().toLocaleDateString(),
        size: 100,
      },
      {
        accessorKey: "usageCount",
        header: () => dictionary.db.models.skill.usageCount,
        size: 140,
      },
    ],
    [
      dictionary.db.models.skill.element,
      dictionary.db.models.skill.id,
      dictionary.db.models.skill.name,
      dictionary.db.models.skill.skillTreeName,
      dictionary.db.models.skill.skillType,
      dictionary.db.models.skill.updatedAt,
      dictionary.db.models.skill.usageCount,
    ],
  );

  // 创建表格
  const table = useReactTable({
    data: skillList,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    initialState: {
      sorting: [
        {
          id: "usageCount",
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
    skillList.forEach((skill) => {
      if (skill.id !== id) return;
      setSkill(skill);
      setSkillDialogState(true);
      setSkillFormState("DISPLAY");
    });
  };

  // 表头固定
  const getCommonPinningStyles = (column: Column<Skill>): CSSProperties => {
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
    console.log("--Skill Client Render")
    setSkillList(defaultSkillList);
    // u键监听
    const handleEscapeKeyPress = (e: KeyboardEvent) => {
      if (e.key === "u") {
        setSkillDialogState(true);
        setSkillFormState("DISPLAY");
      }
    };
    document.addEventListener("keydown", handleEscapeKeyPress);
    return () => {
      console.log("--Skill Client Unmount")
      document.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, [defaultSkillList, setSkillDialogState, setSkillFormState, setSkillList]);

  return (
    <main className="flex flex-col lg:w-[calc(100dvw-96px)] lg:flex-row">
      <div
        className={`Module1 fixed left-0 top-0 z-50 lg:z-0 ${filterState ? " translate-x-0 " : " -translate-x-full "} flex-none border-transition-color-8 bg-primary-color backdrop-blur-xl lg:sticky lg:translate-x-0 lg:border-x-1.5 lg:bg-transition-color-8 ${filterState ? " pointer-events-auto visible basis-[260px] opacity-100 " : " pointer-events-none invisible basis-[0px] opacity-0 "}`}
      >
        <div
          className={`Content flex h-dvh w-dvw flex-col gap-4 overflow-y-auto px-6 pt-8 lg:absolute lg:left-0 lg:top-0 lg:w-[260px]`}
        >
          <div className="Title flex items-center justify-between">
            <h1 className="text-lg">{dictionary.ui.skill.filter}</h1>
            <Button
              level="tertiary"
              onClick={() => setFilterState(!filterState)}
            >
              X
            </Button>
          </div>
          <div className="module flex flex-col gap-3">
            <div className="title">{dictionary.ui.skill.columnsHidden}</div>
            <div className="content flex flex-wrap gap-2 ">
              <Button
                size="sm"
                level={table.getIsAllColumnsVisible() ? "tertiary" : "primary"}
                onClick={table.getToggleAllColumnsVisibilityHandler()}
              >
                ALL
              </Button>
              {table.getAllLeafColumns().map((column) => {
                if (hiddenData.includes(column.id as keyof Skill)) {
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
                    {typeof dictionary.db.models.skill[column.id as keyof Skill]}
                  </Button>
                );
              })}
            </div>
          </div>
          <div className="module flex flex-col gap-3">
            <div className="title">{dictionary.ui.skill.columnsHidden}</div>
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
          <div className="Title sticky left-0 mt-3 flex flex-col gap-9 py-10 lg:py-5 lg:pb-10 lg:pt-20">
            <div className="Row flex flex-col items-center justify-between gap-10 lg:flex-row lg:justify-start lg:gap-4">
              <h1 className="Text text-nowrap text-left text-3xl lg:bg-transparent lg:text-4xl">
                {dictionary.ui.skill.pageTitle}
              </h1>
              <div className="Control flex flex-1 gap-2">
                <input
                  type="search"
                  placeholder={dictionary.ui.skill.searchPlaceholder}
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
                        setSkillDialogState(true);
                        setSkillFormState("CREATE");
                      }}
                    ></Button>
                    <Button // 仅PC端显示
                      level="primary"
                      icon={<IconCloudUpload />}
                      className="hidden lg:flex"
                      onClick={() => {
                        setSkill(defaultSkill);
                        setSkillDialogState(true);
                        setSkillFormState("CREATE");
                      }}
                    >
                      {dictionary.ui.skill.upload} [u]
                    </Button>
                  </React.Fragment>
                )}
              </div>
            </div>
            <div className="Discription my-3 hidden rounded-sm bg-transition-color-8 p-3 lg:block">
              {dictionary.ui.skill.discription}
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
                      if (hiddenData.includes(column.id as keyof Skill)) {
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
                            className={`border-1 flex-1 border-transition-color-8 px-3 py-3 text-left hover:bg-transition-color-8 ${
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
                      if (hiddenData.includes(column.id as keyof Skill)) {
                        // 默认隐藏的数据
                        return;
                      }

                      switch (
                        cell.column.id as Exclude<
                          keyof Skill,
                          keyof typeof hiddenData
                        >
                      ) {
                        case "name":
                          return (
                            <td
                              key={cell.id}
                              style={{
                                ...getCommonPinningStyles(column),
                              }}
                              className="flex flex-col justify-center px-3 py-6"
                            >
                              <span className=" text-lg font-bold">
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </span>
                            </td>
                          );

                        default: {
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
                                      (cell.column.id
                                        .charAt(0)
                                        .toLocaleUpperCase() +
                                        cell.column.id.slice(
                                          1,
                                        )) as keyof typeof $Enums
                                    ][
                                      cell.getValue() as keyof (typeof $Enums)[keyof typeof $Enums]
                                    ];
                                  return content;
                                } catch (error) {
                                  return flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext(),
                                  );
                                }
                              })(cell)}
                            </td>
                          );
                        }
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
      {/* {(() => { console.log("重新渲染了"); return null})()} */}
      <Dialog state={skillDialogState} setState={setSkillDialogState}>
        {skillDialogState && (
          <SkillForm
            dictionary={dictionary}
            session={session}
            setDefaultSkillList={setDefaultSkillList}
          />
        )}
      </Dialog>
    </main>
  );
}
