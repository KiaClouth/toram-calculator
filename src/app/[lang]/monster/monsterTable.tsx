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
        header: () => dictionary.db.models.monster.id,
        cell: (info) => info.getValue(),
        size: 250,
      },
      {
        accessorKey: "name",
        header: () => dictionary.db.models.monster.name,
        cell: (info) => info.getValue(),
        size: 120,
      },
      {
        accessorKey: "monsterType",
        header: () => dictionary.db.models.monster.monsterType,
        cell: (info) =>
          dictionary.db.enums.MonsterType[info.getValue<$Enums.MonsterType>()],
        size: 80,
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
        size: 110,
      },
      {
        accessorKey: "physicalResistance",
        header: () => dictionary.db.models.monster.physicalResistance,
        size: 110,
      },
      {
        accessorKey: "magicalDefense",
        header: () => dictionary.db.models.monster.magicalDefense,
        size: 110,
      },
      {
        accessorKey: "magicalResistance",
        header: () => dictionary.db.models.monster.magicalResistance,
        size: 110,
      },
      {
        accessorKey: "criticalResistance",
        header: () => dictionary.db.models.monster.criticalResistance,
        size: 110,
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
    [dictionary.db.enums.Element, dictionary.db.enums.MonsterType, dictionary.db.models.monster.avoidance, dictionary.db.models.monster.baseLv, dictionary.db.models.monster.block, dictionary.db.models.monster.criticalResistance, dictionary.db.models.monster.dodge, dictionary.db.models.monster.element, dictionary.db.models.monster.id, dictionary.db.models.monster.magicalDefense, dictionary.db.models.monster.magicalResistance, dictionary.db.models.monster.monsterType, dictionary.db.models.monster.name, dictionary.db.models.monster.physicalDefense, dictionary.db.models.monster.physicalResistance, dictionary.db.models.monster.updatedAt],
  );

  const [data, _setData] = React.useState(() => tableData);

  const table = useReactTable({
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
    styles.borderWidth = isLastLeft
      ? "0px 2px 0px 0px"
      : isFirstRight
        ? "0px 0px 0px 2px"
        : undefined;
  }
  return styles;
};

  return (
    <div
      ref={tableContainerRef}
      className="TableBox z-0 flex flex-1 flex-col overflow-auto"
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
          if (hiddenData.includes(column.id as keyof Monster)) { // 默认隐藏的数据
            return;
          }
          return (
            <div
              key={column.id}
              className="flex items-center bg-transition-color-8 px-2"
            >
              <label className="flex gap-1 text-nowrap">
                <input
                  {...{
                    type: "checkbox",
                    checked: column.getIsVisible(),
                    onChange: column.getToggleVisibilityHandler(),
                  }}
                />{" "}
                {dictionary.db.models.monster[column.id as keyof Monster]}
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
                  if (hiddenData.includes(column.id as keyof Monster)) { // 默认隐藏的数据
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
                      {/* {!header.isPlaceholder && header.column.getCanPin() && ( // 固定列
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
                className=" group flex transition-none cursor-pointer"
                onClick={() => handleTrClick(row.getValue("id"))}
              >
                {row.getVisibleCells().map((cell) => {
                  const { column } = cell;
                  if (hiddenData.includes(column.id as keyof Monster)) { // 默认隐藏的数据
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
