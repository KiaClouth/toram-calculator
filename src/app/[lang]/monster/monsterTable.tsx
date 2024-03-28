"use client";

import { type Monster } from "@prisma/client";
import { flexRender, type Column, type Table } from "@tanstack/react-table";

import { useVirtualizer } from "@tanstack/react-virtual";
import React, { type CSSProperties } from "react";
import Button from "../_components/button";
import { IconCloudUpload, IconFilter } from "../_components/iconsList";
import LongSearchBox from "./monsterSearchBox";
import { type getDictionary } from "~/app/get-dictionary";
import { type Session } from "next-auth";

export default function Table(props: {
  table: Table<Monster>;
  hiddenData: Array<keyof Monster>;
  monsterList: Monster[];
  session: Session | null;
  dictionary: ReturnType<typeof getDictionary>;
  filterState: boolean;
  setFilterState: (state: boolean) => void;
  setMonster: (m: Monster) => void;
  setMonsterDialogState: (state: boolean) => void;
}) {
  const {
    table,
    hiddenData,
    monsterList,
    session,
    dictionary,
    filterState,
    setFilterState,
    setMonster,
    setMonsterDialogState,
  } = props;

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
    <div
      ref={tableContainerRef}
      className="TableBox z-0 flex-1 overflow-auto lg:overflow-visible"
    >
      <table className="Table grid">
        <thead className="sticky top-0 z-10 flex">
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <tr
                key={headerGroup.id}
                className=" absolute flex min-w-full gap-0 px-2 border-b-2 bg-primary-color"
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
                        className={`border-1 flex-1 border-transition-color-8 py-7 text-left hover:bg-transition-color-8 ${
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
          className="relative z-0 grid px-2 lg:mt-[86px]"
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
                className={`group flex min-w-full px-2 cursor-pointer border-b-1.5 border-transition-color-8 py-6 transition-none hover:bg-transition-color-8 hover:border-brand-color-1st`}
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
  );
}
