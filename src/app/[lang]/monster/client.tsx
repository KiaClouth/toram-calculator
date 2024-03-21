"use client";

import { type $Enums, type Monster } from "@prisma/client";
import {
  type ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { type getDictionary } from "~/app/get-dictionary";
import Table from "./monsterTable";
import { type Session } from "next-auth";
import React, { useState } from "react";
import LongSearchBox from "./monsterSearchBox";
import CreateMonster from "./create-monster";
import Button from "../_components/button";
import { IconFilter } from "../_components/iconsList";

export default function MonserPageClient(props: {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
  monsterList: Monster[];
}) {
  const { dictionary, session, monsterList } = props;
  // 怪物数据的初始值
  const defaultMonster: Monster = {
    id: "",
    updatedAt: new Date(),
    updatedById: "",
    state: "PRIVATE",
    name: "",
    monsterType: "COMMON_BOSS",
    baseLv: 0,
    experience: 0,
    address: "",
    element: "NO_ELEMENT",
    radius: 1,
    maxhp: 0,
    physicalDefense: 0,
    physicalResistance: 0,
    magicalDefense: 0,
    magicalResistance: 0,
    criticalResistance: 0,
    avoidance: 0,
    dodge: 0,
    block: 0,
    normalAttackResistanceModifier: 0,
    physicalAttackResistanceModifier: 0,
    magicalAttackResistanceModifier: 0,
    difficultyOfTank: 0,
    difficultyOfMelee: 0,
    difficultyOfRanged: 0,
    possibilityOfRunningAround: 0,
    specialBehavior: "",
    viewCount: 0,
    usageCount: 0,
    createdById: "",
  };

  const [monster, setMonster] = useState<Monster>(defaultMonster);
  const [monsterDialogState, setMonsterDialogState] = useState(false);
  const [filterState, setFilterState] = React.useState(false);

  // 定义不需要展示的列
  const hiddenData: Array<keyof Monster> = ["id", "updatedAt", "updatedById"];
  // // 实验性内容
  // 列配置
  // const clounmDefine: ColumnDef<Monster>[] = [];
  // const inputSchema = <T,>(obj: T) => {
  //   const schema: {
  //     attrName: keyof T;
  //     value: T[keyof T][] | string;
  //   }[] = [];
  //   for (const key in obj) {
  //     const value = obj[key];
  //     if (Object.keys($Enums).includes(key)) {
  //       console.log(key);
  //     }
  //     schema.push({
  //       attrName: key,
  //       value: Object.keys($Enums).includes(key)
  //         ? (Object.keys($Enums[key as keyof typeof $Enums]) as T[keyof T][])
  //         : typeof value,
  //     });
  //   }
  //   // console.log(schema)
  //   return schema;
  // };
  // inputSchema(defaultMonster);

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

  const [data, _setData] = React.useState(() => monsterList);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  })

  return (
    <main className="flex flex-1 overflow-y-auto">
      <div
        className={`Module1 relative flex-none bg-accent-color-10 ${filterState ? " pointer-events-auto visible basis-[260px] opacity-100 " : " pointer-events-none invisible basis-[0px] opacity-0 "}`}
      >
        <div className="content absolute right-0 top-0 w-[260px] p-3 pt-10 flex flex-col gap-6">
          <div className="module flex flex-col gap-3">
            <div className="title text-lg font-bold">
              {dictionary.ui.monster.close}
            </div>
            <div className="content flex flex-wrap gap-2 ">
              <div className="flex items-center rounded bg-transition-color-8 px-4 py-2">
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
                if (hiddenData.includes(column.id as keyof Monster)) {
                  // 默认隐藏的数据
                  return;
                }
                return (
                  <div
                    key={column.id}
                    className="flex items-center rounded bg-transition-color-8 px-4 py-2"
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
          </div>
          <div className="module flex flex-col gap-3">
            <div className="title text-lg font-bold">
              {dictionary.ui.monster.cancel}
            </div>
            <div className="content flex flex-wrap gap-2 ">
            </div>
          </div>
        </div>
      </div>
      <div className="Module2 flex flex-1 px-6">
        <div className="LeftArea flex-1"></div>
        <div className="ModuleContent flex basis-full flex-col-reverse lg:flex-col 2xl:basis-[1536px]">
          <div className="Title flex flex-col justify-between lg:flex-row lg:py-10">
            <h1 className="Text hidden text-center font-bold lg:block lg:bg-transparent lg:text-left lg:text-4xl lg:text-accent-color">
              {dictionary.ui.monster.pageTitle}
            </h1>
            <div className="Control flex gap-1 bg-primary-color">
              <LongSearchBox
                dictionary={dictionary}
                monsterList={monsterList}
                setMonster={setMonster}
                setMonsterDialogState={setMonsterDialogState}
              />
              <CreateMonster
                dictionary={dictionary}
                session={session}
                defaultMonster={defaultMonster}
              />
              <div className="Filter relative flex gap-1">
                <Button
                  className="switch"
                  icon={<IconFilter />}
                  onClick={() => setFilterState(!filterState)}
                ></Button>
              </div>
            </div>
          </div>
          <p className="discription hidden bg-accent-color-10 p-3 lg:block">
            {dictionary.ui.monster.discription}
          </p>
          <Table
            table={table}
            hiddenData={hiddenData}
            monsterList={monsterList}
            setMonster={setMonster}
            setMonsterDialogState={setMonsterDialogState}
          />
        </div>
        <div className="RightArea flex-1"></div>
      </div>
    </main>
  );
}
