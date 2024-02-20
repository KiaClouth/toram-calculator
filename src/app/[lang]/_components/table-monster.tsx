"use client";

import { type Monster } from "@prisma/client";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useVirtualizer } from "@tanstack/react-virtual";
import { type Session } from "next-auth";
import React from "react";

export default function Table(props: {
  tableData: Monster[];
  session: Session | null;
}) {
  const { tableData } = props;

  // 以下注释内容的作用是往数据里添加一个tId字段，由于数据库中的模型都具备此字段，因此跳过
  //   const range = (len: number) => {
  //     const arr: number[] = [];
  //     for (let i = 0; i < len; i++) {
  //       arr.push(i);
  //     }
  //     return arr;
  //   };

  //   const newRow = (index: number): T & { tId: number } => {
  //     return {
  //       tId: index + 1,
  //       ...(tableData[index] as T),
  //     };
  //   };

  //   function makeData(...lens: number[]) {
  //     const makeDataLevel = (depth = 0): T[] => {
  //       const len = lens[depth]!;
  //       return range(len).map((d): T => {
  //         return {
  //           ...newRow(d),
  //         };
  //       });
  //       };
  //     return makeDataLevel();
  //   }

  const columns = React.useMemo<ColumnDef<Monster>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => "名字",
        cell: (info) => info.getValue(),
        size: 250,
      },
      //   {
      //     accessorFn: (row) => row.lastName,
      //     id: "lastName",
      //     cell: (info) => info.getValue(),
      //     header: () => <span>Last Name</span>,
      //   },
      {
        accessorKey: "baseLv",
        header: () => "基础等级",
        size: 250,
      },
      {
        accessorKey: "updatedAt",
        header: "最近一次更新于",
        cell: (info) => info.getValue<Date>().toLocaleString(),
        size: 250,
      },
    ],
    [],
  );

  //   const [data, _setData] = React.useState(() => makeData(20));
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

  return (
    <div
      ref={tableContainerRef}
      className="TableBox z-0 flex-col flex-1 overflow-auto p-4"
    >
      <table className="Table flex-1 grid">
        <thead
          style={{
            display: "grid",
            position: "sticky",
          }}
        >
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <tr
                key={headerGroup.id}
                style={{ display: "flex", width: "100%" }}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      style={{
                        display: "flex",
                        width: header.getSize(),
                      }}
                    >
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
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
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody
          style={{
            display: "grid",
            height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
            position: "relative", //needed for absolute positioning of rows
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index]!;
            return (
              <tr
                data-index={virtualRow.index} //needed for dynamic row height measurement
                ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                key={row.id}
                style={{
                  display: "flex",
                  position: "absolute",
                  transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                  width: "100%",
                }}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      style={{
                        display: "flex",
                        width: cell.column.getSize(),
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
