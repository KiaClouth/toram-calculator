"use client";

import { type $Enums, type Monster } from "@prisma/client";
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
import { type getDictionary } from "get-dictionary";

export default function Table(props: {
  defaultMonster: Monster;
  dictionary: ReturnType<typeof getDictionary>;
  tableData: Monster[];
  session: Session | null;
  setMonsteData: (m: Monster) => void;
  setMonsterDialogState: (state: boolean) => void;
}) {
  const {
    dictionary,
    tableData,
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
        cell: (info) => dictionary.db.enums.type[info.getValue<$Enums.MonsterType>()],
        size: 180,
      },
      //   {
      //     accessorFn: (row) => row.lastName,
      //     id: "lastName",
      //     cell: (info) => info.getValue(),
      //     header: () => <span>Last Name</span>,
      //   },
      {
        accessorKey: "element",
        header: () => "元素属性",
        cell: (info) => dictionary.db.enums.element[info.getValue<$Enums.Element>()],
        size: 120,
      },
      {
        accessorKey: "baseLv",
        header: () => "基础等级",
        size: 120,
      },
      {
        accessorKey: "physicalDefense",
        header: () => "物理防御",
        size: 120,
      },
      {
        accessorKey: "physicalResistance",
        header: () => "物理抗性",
        size: 120,
      },
      {
        accessorKey: "magicalDefense",
        header: () => "魔法防御",
        size: 120,
      },
      {
        accessorKey: "magicalResistance",
        header: () => "魔法抗性",
        size: 120,
      },
      {
        accessorKey: "criticalResistance",
        header: () => "暴击抗性",
        size: 120,
      },
      {
        accessorKey: "avoidance",
        header: () => "回避值",
        size: 120,
      },
      {
        accessorKey: "dodge",
        header: () => "闪躲率",
        size: 120,
      },
      {
        accessorKey: "block",
        header: () => "格挡率",
        size: 120,
      },
      {
        accessorKey: "updatedAt",
        header: "最近一次更新于",
        cell: (info) => info.getValue<Date>().toLocaleString(),
        size: 250,
      },
    ],
    [dictionary.db.enums.element, dictionary.db.enums.type],
  );

    // const [data, _setData] = React.useState(() => makeData(20));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  return (
    <div
      ref={tableContainerRef}
      className="TableBox z-0 flex flex-1 flex-col overflow-auto bg-primary-color-30"
    >
      <div className="Filter flex py- bg-primary-color gap-1">
        <div className="px-1 flex bg-transition-color-8 items-center">
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
          return (
            <div key={column.id} className="px-1 flex bg-transition-color-8 items-center">
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
                  return (
                    <th
                      key={header.id}
                      style={{
                        width: header.getSize(),
                      }}
                      className="flex "
                    >
                      <div
                        {...{
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                        className={`flex-1 border-1 border-transition-color-8 p-2 text-left ${
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
                className=" flex transition-none hover:bg-brand-color-1st"
                onClick={() => handleTrClick(row.getValue("id"))}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                      }}
                      className="flex border-1 border-transition-color-8 p-2 hover:bg-primary-color-40"
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
