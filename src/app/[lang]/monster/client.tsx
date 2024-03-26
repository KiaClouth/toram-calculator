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
import MonsterForm from "./monsterForm";
import Button from "../_components/button";
import { IconCloudUpload, IconFilter } from "../_components/iconsList";
import Dialog from "../_components/dialog";

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
        size: 250,
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

  const [data] = React.useState(monsterList);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <main className="flex flex-1 overflow-y-auto">
      <div
        className={`Module1 fixed left-0 top-0 z-50 lg:z-0 ${filterState ? " translate-x-0 " : " -translate-x-full "} flex-none bg-primary-color backdrop-blur-xl lg:sticky lg:translate-x-0 lg:border-l-1.5 border-brand-color-1st lg:bg-transition-color-8 ${filterState ? " pointer-events-auto visible basis-[260px] opacity-100 " : " pointer-events-none invisible basis-[0px] opacity-0 "}`}
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
      <div className="Module2 flex flex-1 px-2 backdrop-blur-xl lg:px-6">
        <div className="LeftArea flex-1"></div>
        <div className="ModuleContent flex flex-1 basis-full flex-col 2xl:basis-[1536px]">
          <div className="Title flex flex-col justify-between lg:flex-row lg:pb-[4dvh] lg:pt-8">
            <h1 className="Text hidden text-center font-bold lg:block lg:bg-transparent lg:text-left lg:text-4xl lg:text-accent-color">
              {dictionary.ui.monster.pageTitle}
            </h1>
            <div className="Control absolute bottom-2 right-2 z-10 flex flex-col gap-1 lg:static lg:flex-row">
              <LongSearchBox
                dictionary={dictionary}
                monsterList={monsterList}
                setMonster={setMonster}
                setMonsterDialogState={setMonsterDialogState}
              />
              {session?.user ? (
                <React.Fragment>
                  <Button
                    onClick={() => setMonsterDialogState(true)}
                    level="primary"
                    icon={<IconCloudUpload />}
                    className="hidden lg:flex"
                  >
                    {dictionary.ui.monster.upload}
                  </Button>
                  <Button
                    onClick={() => setMonsterDialogState(true)}
                    icon={<IconCloudUpload />}
                    className="flex lg:hidden rounded-full px-3 py-3"
                  ></Button>
                </React.Fragment>
              ) : undefined}
              <div className="Filter relative flex gap-1">
                <Button
                  className="switch rounded-full px-3 py-3 lg:rounded"
                  icon={<IconFilter />}
                  onClick={() => setFilterState(!filterState)}
                ></Button>
              </div>
            </div>
          </div>
          {/* <p className="discription hidden rounded-sm bg-transition-color-8 p-3 lg:block">
            {dictionary.ui.monster.discription}
          </p> */}
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
