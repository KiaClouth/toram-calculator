"use client";

import { $Enums, type Monster } from "@prisma/client";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
} from "@tanstack/react-table";

import { useVirtualizer } from "@tanstack/react-virtual";
import { type Session } from "next-auth";
import React, { type CSSProperties } from "react";
import { type getDictionary } from "~/app/get-dictionary";
import CreateMonster from "./create-monster";

export default function Table(props: {
  defaultMonster: Monster;
  dictionary: ReturnType<typeof getDictionary>;
  tableData: Monster[];
  session: Session | null;
  setMonsteData: (m: Monster) => void;
  setMonsterDialogState: (state: boolean) => void;
}) {
  const {
    defaultMonster,
    dictionary,
    tableData,
    session,
    setMonsteData,
    setMonsterDialogState,
  } = props;

  // 以下注释内容的作用是往数据里添加一个tId字段，由于数据库中的模型都具备此字段，因此跳过
  // const range = (len: number) => {
  //   const arr: number[] = [];
  //   for (let i = 0; i < len; i++) {
  //     arr.push(i);
  //   }
  //   return arr;
  // };

  // const newRow = (index: number): Monster & { tId: number } => {
  //   return {
  //     tId: index + 1,
  //     ...(tableData[index]!),
  //   };
  // };

  // function makeData(...lens: number[]) {
  //   const makeDataLevel = (depth = 0): Monster[] => {
  //     const len = lens[depth]!;
  //     return range(len).map((d): Monster => {
  //       return {
  //         ...newRow(d),
  //       };
  //     });
  //     };
  //   return makeDataLevel();
  // }

  
  // 列配置
  const clounmDefine: ColumnDef<Monster>[] = [];
  // 定义不需要展示的列
  const hiddenData: Array<keyof Monster> = ["id", "updatedAt", "updatedById"];
  const inputSchema = <T,>(obj: T) => {
    const schema: {
      attrName: keyof T;
      value: T[keyof T][] | string;
    }[] = [];
    for (const key in obj) {
      const value = obj[key];
      if (Object.keys($Enums).includes(key)) {
        console.log(key);
      }
      schema.push({
        attrName: key,
        value: Object.keys($Enums).includes(key)
          ? (Object.keys($Enums[key as keyof typeof $Enums]) as T[keyof T][])
          : typeof value,
      });
    }
    // console.log(schema)
    return schema;
  };

  inputSchema(defaultMonster);

  const columns = React.useMemo<ColumnDef<Monster>[]>(
    () => [
      {
        accessorKey: "id",
        header: () => "ID",
        cell: (info) => info.getValue(),
        size: 250,
      },
      {
        accessorKey: "name",
        header: () => "名字",
        cell: (info) => info.getValue(),
        size: 120,
      },
      {
        accessorKey: "type",
        header: () => "类型",
        cell: (info) =>
          dictionary.db.enums.MonsterType[info.getValue<$Enums.MonsterType>()],
        size: 80,
      },
      {
        accessorKey: "element",
        header: () => "属性",
        cell: (info) =>
          dictionary.db.enums.Element[info.getValue<$Enums.Element>()],
        size: 80,
      },
      {
        accessorKey: "baseLv",
        header: () => "等级",
        size: 80,
      },
      {
        accessorKey: "physicalDefense",
        header: () => "物理防御",
        size: 110,
      },
      {
        accessorKey: "physicalResistance",
        header: () => "物理抗性",
        size: 110,
      },
      {
        accessorKey: "magicalDefense",
        header: () => "魔法防御",
        size: 110,
      },
      {
        accessorKey: "magicalResistance",
        header: () => "魔法抗性",
        size: 110,
      },
      {
        accessorKey: "criticalResistance",
        header: () => "暴击抗性",
        size: 110,
      },
      {
        accessorKey: "avoidance",
        header: () => "回避值",
        size: 100,
      },
      {
        accessorKey: "dodge",
        header: () => "闪躲率",
        size: 100,
      },
      {
        accessorKey: "block",
        header: () => "格挡率",
        size: 100,
      },
      {
        accessorKey: "updatedAt",
        header: "距离上一次更新(天)",
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
    [dictionary.db.enums.Element, dictionary.db.enums.MonsterType],
  );

  // const [data, _setData] = React.useState(() => makeData(20));
  const [data, _setData] = React.useState(() => tableData);

  const table = useReactTable({
    // state: {
    //   columnVisibility: {
    //     id: false,
    //   },
    // },
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const { rows } = table.getRowModel();

  //The virtualizer needs to know the scrollable container element
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  const handleTrClick = (id: string) => {
    tableData.forEach((monster) => {
      if (monster.id !== id) return;
      setMonsteData(monster);
      setMonsterDialogState(true);
    });
  };

  // 列粘性布局样式计算函数
  const getCommonPinningStyles = (column: Column<Monster>): CSSProperties => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn =
      isPinned === "left" && column.getIsLastColumn("left");
    const isFirstRightPinnedColumn =
      isPinned === "right" && column.getIsFirstColumn("right");
    return {
      borderWidth: isLastLeftPinnedColumn
        ? "0px 2px 0px 0px"
        : isFirstRightPinnedColumn
          ? "0px 0px 0px 2px"
          : undefined,
      left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
      right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
      position: isPinned ? "sticky" : "relative",
      width: column.getSize(),
      zIndex: isPinned ? 1 : 0,
    };
  };

  return (
    <div
      ref={tableContainerRef}
      className="TableBox z-0 flex flex-1 flex-col overflow-auto bg-primary-color-30"
    >
      <div className="Filter flex gap-1 bg-primary-color py-2">
        <CreateMonster
          dictionary={dictionary}
          session={session}
          defaultMonster={defaultMonster}
        />
        <div className="flex items-center bg-transition-color-8 px-1">
          <label className="flex gap-1 text-nowrap">
            <input
              {...{
                type: "checkbox",
                checked: table.getIsAllColumnsVisible(),
                onChange: table.getToggleAllColumnsVisibilityHandler(),
              }}
            />{" "}
            All
          </label>
        </div>
        {table.getAllLeafColumns().map((column) => {
          // 默认隐藏的数据
          if (hiddenData.includes(column.id as keyof Monster)) {
            return;
          }
          return (
            <div
              key={column.id}
              className="flex items-center bg-transition-color-8 px-1"
            >
              <label className="flex gap-1 text-nowrap">
                <input
                  {...{
                    type: "checkbox",
                    checked: column.getIsVisible(),
                    onChange: column.getToggleVisibilityHandler(),
                  }}
                />{" "}
                {column.id}
              </label>
            </div>
          );
        })}
      </div>
      <table className="Table flex-1 backdrop-blur-xl">
        <thead className=" sticky top-0 z-10 flex border-b-2 bg-primary-color">
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <tr key={headerGroup.id} className="flex gap-0">
                {headerGroup.headers.map((header) => {
                  const { column } = header;
                  // 默认隐藏的数据
                  if (["id", "updateAt"].includes(column.id)) {
                    return;
                  }
                  return (
                    <th
                      key={header.id}
                      style={{
                        ...getCommonPinningStyles(column),
                      }}
                      className="flex flex-col bg-primary-color"
                    >
                      <div
                        {...{
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                        className={`border-1 flex-1 border-transition-color-8 p-2 text-left ${
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
                      {!header.isPlaceholder && header.column.getCanPin() && (
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
                      )}
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
          className="z-0 px-2 backdrop-blur-xl"
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
                className=" group flex transition-none"
                onClick={() => handleTrClick(row.getValue("id"))}
              >
                {row.getVisibleCells().map((cell) => {
                  const { column } = cell;
                  // 默认隐藏的数据
                  if (hiddenData.includes(column.id as keyof Monster)) {
                    return;
                  }
                  return (
                    <td
                      key={cell.id}
                      style={{
                        ...getCommonPinningStyles(column),
                      }}
                      className="border-1 flex border-transition-color-8 bg-primary-color p-2 group-hover:bg-brand-color-1st"
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
  );
}
