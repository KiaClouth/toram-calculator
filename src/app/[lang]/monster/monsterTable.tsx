"use client";

import { type Monster } from "@prisma/client";
import {
  flexRender,
  type Column,
  type Table,
} from "@tanstack/react-table";

import { useVirtualizer } from "@tanstack/react-virtual";
import React, { type CSSProperties } from "react";

export default function Table(props: {
  table: Table<Monster>;
  hiddenData: Array<keyof Monster>;
  monsterList: Monster[];
  setMonster: (m: Monster) => void;
  setMonsterDialogState: (state: boolean) => void;
}) {
  const {
    table,
    hiddenData,
    monsterList,
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
      className="TableBox z-0 flex-1 overflow-auto"
    >
      <table className="Table grid">
        <thead className="sticky top-0 z-10 flex">
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <tr key={headerGroup.id} className=" absolute flex min-w-full gap-0 bg-primary-color border-b-2">
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
                        className={`border-1 flex-1 border-transition-color-8 px-2 py-4 text-left hover:bg-transition-color-8 ${
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
          className="grid relative z-0 px-2 lg:mt-16"
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
                className={`group min-w-full flex cursor-pointer transition-none  ${virtualRow.index % 2 === 0 ? "" : "bg-transition-color-8"}`}
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
                      className={`border-1 flex border-transition-color-8 px-2 py-4 group-hover:bg-brand-color-1st}`}
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
