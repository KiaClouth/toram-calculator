"use client";

import type { $Enums } from "@prisma/client";
import type { Character } from "~/server/api/routers/character";
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
import CharacterForm from "./characterForm";
import Button from "../../_components/button";
import { IconCloudUpload, IconFilter } from "../../_components/iconsList";
import Dialog from "../../_components/dialog";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useStore } from "~/app/store";
import { defaultCharacter } from "~/app/store";

interface Props {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
  characterList: Character[];
}

export default function MonserPageClient(props: Props) {
  const { dictionary, session } = props;
  const [defaultCharacterList, setDefaultCharacterList] = useState(props.characterList);

  // 状态管理参数
  const {
    characterList,
    setCharacterList,
    characterDialogState,
    setCharacterDialogState,
    setCharacterFormState,
    filterState,
    setFilterState,
  } = useStore((state) => state.characterPage);
  const { character, setCharacter } = useStore((state) => state);

  // 搜索框行为函数
  const handleSearchFilterChange = (value: string) => {
    const currentList = defaultCharacterList;
    if (value === "" || value === null) {
      setCharacterList(currentList);
    }
    // 搜索时需要忽略的数据
    const characterHiddenData: Array<keyof Character> = ["id", "state", "updatedAt", "createdAt", "createdByUserId"];
    const newCharacterList: Character[] = [];
    currentList.forEach((character) => {
      let filter = false;
      for (const attr in character) {
        if (!characterHiddenData.includes(attr as keyof Character)) {
          const characterAttr = character[attr as keyof Character]?.toString();
          if (characterAttr?.match(value)?.input !== undefined) {
            filter = true;
          }
        }
      }
      filter ? newCharacterList.push(character) : null;
    });
    setCharacterList(newCharacterList);
  };

  // 弹出层同名怪物列表
  const [sameNameCharacterList, setSameNameCharacterList] = useState<Character[]>([]);
  const compusteSameNameCharacterList = (character: Character, characterList: Character[]) => {
    const list: Character[] = [];
    characterList.forEach((c) => {
      c.name === character.name && list.push(c);
    });
    return list.sort((characterA, characterB) => {
      const dateA = new Date(characterA.updatedAt);
      const dateB = new Date(characterB.updatedAt);
      return dateA.getTime() - dateB.getTime();
    });
  };

  // 定义不需要展示的列
  const characterHiddenData: Array<keyof Character> = ["id"];

  // 列定义
  const columns = React.useMemo<ColumnDef<Character>[]>(
    () => [
      {
        accessorKey: "id",
        header: () => dictionary.db.models.character.id,
        cell: (info) => info.getValue(),
        size: 200,
      },
      {
        accessorKey: "name",
        header: () => dictionary.db.models.character.name,
        cell: (info) => info.getValue(),
        size: 220,
      },
      {
        accessorKey: "characterType",
        header: () => dictionary.db.models.character.characterType,
        cell: (info) => dictionary.db.enums.CharacterType[info.getValue<$Enums.CharacterType>()],
        size: 120,
      },
      {
        accessorKey: "updatedAt",
        header: dictionary.db.models.character.updatedAt,
        cell: (info) => info.getValue<Date>().toLocaleDateString(),
        size: 100,
      },
      {
        accessorKey: "usageCount",
        header: () => dictionary.db.models.character.usageCount,
        size: 140,
      },
    ],
    [
      dictionary.db.enums.CharacterType,
      dictionary.db.models.character.id,
      dictionary.db.models.character.characterType,
      dictionary.db.models.character.name,
      dictionary.db.models.character.updatedAt,
      dictionary.db.models.character.usageCount,
    ],
  );

  // 创建表格
  const table = useReactTable({
    data: characterList,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    initialState: {
      sorting: [
        {
          id: "experience",
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
    estimateSize: () => 112, // estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    // measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" && navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  // 表头固定
  const getCommonPinningStyles = (column: Column<Character>): CSSProperties => {
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
      styles.borderWidth = isLastLeft ? "0px 2px 0px 0px" : isFirstRight ? "0px 0px 0px 2px" : undefined;
    }
    return styles;
  };

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const startX = e.pageX;
    const startY = e.pageY;
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      offsetX = e.pageX - startX;
      offsetY = e.pageY - startY;
      if (!isDragging) {
        // 判断是否开始拖动
        isDragging = Math.abs(offsetX) > 3 || Math.abs(offsetY) > 3;
      }
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        if (tableContainerRef.current?.parentElement) {
          tableContainerRef.current.style.transition = "none";
          tableContainerRef.current.parentElement.style.transition = "none";
          // tableContainerRef.current.scrollTop -= offsetY / 100;
          tableContainerRef.current.scrollLeft += offsetX / 100;
        }
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      if (!isDragging) {
        console.log(id);
        const targetCharacter = characterList.find((character) => character.id === id);
        if (targetCharacter) {
          setCharacter(targetCharacter);
          setSameNameCharacterList(compusteSameNameCharacterList(targetCharacter, characterList));
          setCharacterDialogState(true);
          setCharacterFormState("DISPLAY");
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // 表格行点击事件
  // const handleTrClick = (id: string) => {
  //   console.log(id);
  //   const targetCharacter = characterList.find((character) => character.id === id);
  //   if (targetCharacter) {
  //     setCharacter(targetCharacter);
  //     setSameNameCharacterList(compusteSameNameCharacterList(targetCharacter, characterList));
  //     setCharacterDialogState(true);
  //     setCharacterFormState("DISPLAY");
  //   }
  // };

  useEffect(() => {
    console.log("--Character Client Render");
    setCharacterList(defaultCharacterList);
    // u键监听
    const handleUKeyPress = (e: KeyboardEvent) => {
      if (e.key === "u") {
        setCharacter(defaultCharacter);
        setSameNameCharacterList([]);
        setCharacterDialogState(true);
        setCharacterFormState("CREATE");
      }
    };
    document.addEventListener("keydown", handleUKeyPress);
    return () => {
      console.log("--Character Client Unmount");
      document.removeEventListener("keydown", handleUKeyPress);
    };
  }, [defaultCharacterList, setCharacter, setCharacterDialogState, setCharacterFormState, setCharacterList]);

  return (
    <main className="flex flex-col lg:w-[calc(100dvw-96px)] lg:flex-row">
      <div
        className={`Module1 fixed left-0 top-0 z-50 lg:z-0 ${filterState ? " translate-x-0 " : " -translate-x-full "} flex-none border-transition-color-8 bg-primary-color backdrop-blur-xl lg:sticky lg:translate-x-0 lg:border-x-1.5 lg:bg-transition-color-8 ${filterState ? " pointer-events-auto visible basis-[260px] opacity-100 " : " pointer-events-none invisible basis-[0px] opacity-0 "}`}
      >
        <div
          className={`Content flex h-dvh w-dvw flex-col gap-4 overflow-y-auto px-6 pt-8 lg:absolute lg:left-0 lg:top-0 lg:w-[260px]`}
        >
          <div className="Title flex items-center justify-between">
            <h1 className="text-lg">{dictionary.ui.filter}</h1>
            <Button level="tertiary" onClick={() => setFilterState(!filterState)}>
              X
            </Button>
          </div>
          <div className="module flex flex-col gap-3">
            <div className="title">{dictionary.ui.columnsHidden}</div>
            <div className="content flex flex-wrap gap-2 ">
              <Button
                size="sm"
                level={table.getIsAllColumnsVisible() ? "tertiary" : "primary"}
                onClick={table.getToggleAllColumnsVisibilityHandler()}
              >
                ALL
              </Button>
              {table.getAllLeafColumns().map((column) => {
                if (characterHiddenData.includes(column.id as keyof Character)) {
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
                    {typeof dictionary.db.models.character[column.id as keyof Character]}
                  </Button>
                );
              })}
            </div>
          </div>
          <div className="module flex flex-col gap-3"></div>
        </div>
      </div>
      <div className="Module2 flex w-full flex-1 overflow-hidden px-3 backdrop-blur-xl">
        <div className="LeftArea sticky top-0 z-10 flex-1"></div>
        <div
          ref={tableContainerRef}
          className={`ModuleContent h-[calc(100dvh-67px)] w-full flex-col overflow-auto lg:h-dvh lg:max-w-[1536px]`}
        >
          <div className="Title sticky left-0 mt-3 flex flex-col gap-9 py-5 lg:pt-20">
            <div className="Row flex flex-col items-center justify-between gap-10 lg:flex-row lg:justify-start lg:gap-4">
              <h1 className="Text text-left text-3xl lg:bg-transparent lg:text-4xl">
                {dictionary.ui.character.pageTitle}
              </h1>
              <div className="Control flex flex-1 gap-2">
                <input
                  id="CharacterSearchBox"
                  type="search"
                  placeholder={dictionary.ui.searchPlaceholder}
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
                        setCharacter(defaultCharacter);
                        setSameNameCharacterList([]);
                        setCharacterDialogState(true);
                        setCharacterFormState("CREATE");
                      }}
                    ></Button>
                    <Button // 仅PC端显示
                      level="primary"
                      icon={<IconCloudUpload />}
                      className="hidden lg:flex"
                      onClick={() => {
                        setCharacter(defaultCharacter);
                        setSameNameCharacterList([]);
                        setCharacterDialogState(true);
                        setCharacterFormState("CREATE");
                      }}
                    >
                      {dictionary.ui.upload} [u]
                    </Button>
                  </React.Fragment>
                )}
              </div>
            </div>
            <div className="Discription my-3 hidden rounded-sm bg-transition-color-8 p-3 lg:block">
              {dictionary.ui.character.discription}
            </div>
          </div>
          <table className="Table bg-transition-color-8 px-2 lg:bg-transparent">
            <thead className="TableHead sticky top-0 z-10 flex bg-primary-color">
              {table.getHeaderGroups().map((headerGroup) => {
                return (
                  <tr key={headerGroup.id} className=" flex min-w-full gap-0 border-b-2">
                    {headerGroup.headers.map((header) => {
                      const { column } = header;
                      if (characterHiddenData.includes(column.id as keyof Character)) {
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
                            className={`border-1 flex-1 border-transition-color-8 px-3 py-4 text-left hover:bg-transition-color-8 lg:py-6 ${
                              header.column.getCanSort() ? "cursor-pointer select-none" : ""
                            }`}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: " ↓",
                              desc: " ↑",
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                          {/* {!header.isPlaceholder &&
                            header.column.getCanPin() && ( // 固定列
                              <div className="flex">
                                {header.column.getIsPinned() !== "left" ? (
                                  <button
                                    className="flex-1 rounded bg-transition-color-8 px-1"
                                    onClick={() => {
                                      header.column.pin("left");
                                    }}
                                  >
                                    {"←"}
                                  </button>
                                ) : null}
                                {header.column.getIsPinned() ? (
                                  <button
                                    className="flex-1 rounded bg-transition-color-8 px-1"
                                    onClick={() => {
                                      header.column.pin(false);
                                    }}
                                  >
                                    {"x"}
                                  </button>
                                ) : null}
                                {header.column.getIsPinned() !== "right" ? (
                                  <button
                                    className="flex-1 rounded bg-transition-color-8 px-1"
                                    onClick={() => {
                                      header.column.pin("right");
                                    }}
                                  >
                                    {"→"}
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
                    className={`group flex cursor-pointer border-y-[1px] border-transition-color-8 transition-none hover:rounded hover:border-transparent hover:bg-transition-color-8 hover:font-bold lg:border-y-1.5`}
                    // onClick={() => handleTrClick(row.getValue("id"))}
                    onMouseDown={(e) => handleMouseDown(row.getValue("id"), e)}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const { column } = cell;
                      if (characterHiddenData.includes(column.id as keyof Character)) {
                        // 默认隐藏的数据
                        return;
                      }

                      switch (cell.column.id as Exclude<keyof Character, keyof typeof characterHiddenData>) {
                        case "name":
                          return (
                            <td
                              key={cell.id}
                              style={{
                                ...getCommonPinningStyles(column),
                              }}
                              className="flex flex-col justify-center px-3 py-6 lg:py-8"
                            >
                              <span className=" text-lg font-bold">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </span>
                              <span className="text-sm font-normal text-accent-color-70">
                                {(row.getValue("address") === ("" ?? undefined ?? null) && "不知名的地方") ||
                                  row.getValue("address")}
                              </span>
                            </td>
                          );

                        default:
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
                                      (cell.column.id.charAt(0).toLocaleUpperCase() +
                                        cell.column.id.slice(1)) as keyof typeof $Enums
                                    ][cell.getValue() as keyof (typeof $Enums)[keyof typeof $Enums]];
                                  return content;
                                } catch (error) {
                                  return flexRender(cell.column.columnDef.cell, cell.getContext());
                                }
                              })(cell)}
                            </td>
                          );
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
      <Dialog state={characterDialogState} setState={setCharacterDialogState}>
        {characterDialogState && (
          <div className="Content flex w-full flex-col overflow-y-auto lg:flex-row 2xl:w-[1536px]">
            {sameNameCharacterList.length > 1 && (
              <div className="SameNameCharacterList flow-row flex flex-none basis-[8%] gap-1 overflow-x-auto overflow-y-hidden border-r-1.5 border-brand-color-1st p-3 lg:w-60 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden">
                {sameNameCharacterList.map((currentCharacter) => {
                  const order = sameNameCharacterList.indexOf(currentCharacter) + 1;
                  return (
                    <Button
                      key={"SameNameCharacterId" + currentCharacter.id}
                      level="tertiary"
                      onClick={() => {
                        setCharacter(currentCharacter);
                      }}
                      active={currentCharacter.id === character.id}
                      className="SameNameCharacter flex h-full basis-1/4 flex-col rounded-sm lg:h-auto lg:w-full lg:basis-auto"
                    >
                      <span className="w-full text-nowrap px-2 text-left text-lg lg:font-bold">{order}</span>
                      <span className="hidden text-left text-sm lg:block">
                        {currentCharacter.updatedAt.toLocaleString()}
                      </span>
                    </Button>
                  );
                })}
              </div>
            )}
            {/* <div className="tab flex w-32 flex-col justify-center gap-1 border-r-1.5 border-brand-color-1st p-3"></div> */}
            <CharacterForm
              dictionary={dictionary}
              session={session}
              defaultCharacterList={defaultCharacterList}
              setDefaultCharacterList={setDefaultCharacterList}
            />
          </div>
        )}
      </Dialog>
    </main>
  );
}
