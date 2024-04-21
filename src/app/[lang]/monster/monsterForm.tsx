"use client";
import React, { useEffect } from "react";
import "@mdxeditor/editor/style.css";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  DiffSourceToggleWrapper,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  MDXEditorMethods,
  Separator,
  UndoRedo,
  diffSourcePlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  listsPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import { tApi } from "~/trpc/react";
import { type sApi } from "~/trpc/server";
import type { getDictionary } from "~/app/get-dictionary";
import Button from "../_components/button";
import { MonsterSchema } from "prisma/generated/zod";
import { type FieldApi, useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { ZodFirstPartyTypeKind, type z } from "zod";
import { type Monster, type $Enums } from "@prisma/client";
import { defaultMonster, useBearStore } from "~/app/store";
import { type Session } from "next-auth";
import {
  IconElementWater,
  IconElementFire,
  IconElementEarth,
  IconElementWind,
  IconElementLight,
  IconElementDark,
  IconElementNoElement,
} from "../_components/iconsList";
import { useTheme } from "next-themes";


export default function MonsterForm(props: {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
  setDefaultMonsterList: (
    list: Awaited<ReturnType<typeof sApi.monster.getUserVisbleList.query>>,
  ) => void;
}) {
  const { dictionary, session, setDefaultMonsterList } = props;
  const newListQuery = tApi.monster.getUserVisbleList.useQuery();
  // 状态管理参数
  const {
    monster,
    monsterDialogState,
    setMonsterList,
    setMonsterDialogState,
    monsterFormState,
    setMonsterFormState,
  } = useBearStore((state) => state.monsterPage);
  let newMonster: Monster;
  const formTitle = {
    CREATE: dictionary.ui.monster.upload,
    UPDATE: dictionary.ui.monster.modify,
    DISPLAY: monster.name,
  }[monsterFormState];
  const [dataUploadingState, setDataUploadingState] = React.useState(false);
  const theme = useTheme();
  const mdxEditorRef = React.useRef<MDXEditorMethods>(null)

  function FieldInfo({
    field,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: FieldApi<Monster, keyof Monster, any, any>;
  }) {
    return (
      <React.Fragment>
        {field.state.meta.touchedErrors ? (
          <span className=" text-brand-color-2nd">
            {` `} : {field.state.meta.touchedErrors}
          </span>
        ) : null}
        {/* {field.state.meta.isValidating ? "正在检查..." : null} */}
      </React.Fragment>
    );
  }

  // 定义不需要手动输入的值
  const hiddenData: Array<keyof Monster> = [
    "id",
    "createdAt",
    "updatedAt",
    "viewCount",
    "usageCount",
    "createdByUserId",
    "updatedByUserId",
    "viewTimestamps",
    "usageTimestamps",
  ];

  // 定义表单
  const form = useForm({
    defaultValues: {
      CREATE: defaultMonster,
      UPDATE: monster,
      DISPLAY: monster,
    }[monsterFormState],
    onSubmit: async ({ value }) => {
      setDataUploadingState(true);
      newMonster = {
        ...value,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
        viewCount: 0,
        usageTimestamps: [],
        viewTimestamps: [],
      } satisfies Monster;
      switch (monsterFormState) {
        case "CREATE":
          createMonster.mutate(newMonster);
          break;

        case "UPDATE":
          updateMonster.mutate(newMonster);
          break;

        default:
          break;
      }
      setMonsterDialogState(false);
    },
    validatorAdapter: zodValidator,
  });

  const getZodType = <T extends z.ZodTypeAny>(
    schema: T,
  ): ZodFirstPartyTypeKind => {
    if (schema === undefined || schema == null) {
      return ZodFirstPartyTypeKind.ZodUndefined;
    }
    if ("_def" in schema) {
      if ("innerType" in schema._def) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return getZodType(schema._def.innerType);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return schema._def.typeName as ZodFirstPartyTypeKind;
      }
    }
    return ZodFirstPartyTypeKind.ZodUndefined;
  };

  const createMonster = tApi.monster.create.useMutation({
    onSuccess: async () => {
      // 创建成功后重新获取数据
      const newList = await newListQuery.refetch();
      // 确保数据已成功加载
      if (newList.isSuccess) {
        setDefaultMonsterList(newList.data);
        setMonsterList(newList.data);
      }
      // 上传成功后表单转换为展示状态
      setDataUploadingState(false);
      setMonsterFormState("DISPLAY");
    },
  });

  const updateMonster = tApi.monster.update.useMutation({
    onSuccess: async () => {
      // 更新成功后重新获取数据
      const newList = await newListQuery.refetch();
      // 确保数据已成功加载后，更新本地数据
      if (newList.isSuccess) {
        setDefaultMonsterList(newList.data);
        setMonsterList(newList.data);
      }
      // 上传成功后表单转换为展示状态
      setDataUploadingState(false);
      setMonsterFormState("DISPLAY");
    },
  });

  useEffect(() => {
    console.log("---MonsterForm render");
    mdxEditorRef.current?.setMarkdown(monster.specialBehavior ?? "");
    // escape键监听
    const handleEscapeKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMonsterDialogState(!monsterDialogState);
      }
    };

    // 监听绑带与清除
    document.addEventListener("keydown", handleEscapeKeyPress);

    return () => {
      console.log("---MonsterForm unmount");
      document.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, [form, monster, monsterDialogState, monsterFormState, setMonsterDialogState]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className={`CreateMonsterFrom flex w-full flex-col gap-4 overflow-y-auto rounded px-3`}
    >
      <div className="title flex items-center gap-6 pt-4">
        <div className="h-[2px] flex-1 bg-accent-color"></div>
        <span className="text-lg font-bold lg:text-2xl">{formTitle}</span>
        <div className="h-[2px] flex-1 bg-accent-color"></div>
      </div>
      <div className="inputArea flex-1 overflow-y-auto">
        <fieldset className="dataKinds flex flex-row flex-wrap gap-y-[4px]">
          {Object.entries(monster).map(([key, _]) => {
            // 遍历怪物模型
            // 过滤掉隐藏的数据
            if (hiddenData.includes(key as keyof Monster)) return undefined;
            // 输入框的类型计算
            const zodValue = MonsterSchema.shape[key as keyof Monster];
            const valueType = getZodType(zodValue);
            const { ZodNumber, ZodString, ...Others } = ZodFirstPartyTypeKind;
            const inputType = {
              [ZodNumber]: "number",
              [ZodString]: "text",
              ...Others,
            }[valueType];
            switch (valueType) {
              case ZodFirstPartyTypeKind.ZodEnum: {
                // 枚举类型的输入框以单选框组的形式创建
                switch (key as keyof Monster) {
                  case "element":
                    return (
                      <form.Field
                        key={key}
                        name={key as keyof Monster}
                        validators={{
                          onChangeAsyncDebounceMs: 500,
                          onChangeAsync:
                            MonsterSchema.shape[key as keyof Monster],
                        }}
                      >
                        {(field) => {
                          return (
                            <fieldset
                              key={key}
                              className="flex basis-full flex-col gap-1 p-2"
                            >
                              <span>
                                {
                                  dictionary.db.models.monster[
                                    key as keyof Monster
                                  ]
                                }
                                <FieldInfo field={field} />
                              </span>
                              <div
                                className={`inputContianer mt-1 flex flex-wrap self-start rounded lg:gap-2 ${monsterFormState === "DISPLAY" ? " outline-transition-color-20" : ""}`}
                              >
                                {"options" in zodValue &&
                                  zodValue.options.map((option) => {
                                    const icon =
                                      {
                                        WATER: (
                                          <IconElementWater className="h-6 w-6" />
                                        ),
                                        FIRE: (
                                          <IconElementFire className="h-6 w-6" />
                                        ),
                                        EARTH: (
                                          <IconElementEarth className="h-6 w-6" />
                                        ),
                                        WIND: (
                                          <IconElementWind className="h-6 w-6" />
                                        ),
                                        LIGHT: (
                                          <IconElementLight className="h-6 w-6" />
                                        ),
                                        DARK: (
                                          <IconElementDark className="h-6 w-6" />
                                        ),
                                        NO_ELEMENT: (
                                          <IconElementNoElement className="h-6 w-6" />
                                        ),
                                      }[
                                        option as keyof typeof $Enums.Element
                                      ] ?? undefined;
                                    return (
                                      <label
                                        key={key + option}
                                        className={`flex basis-1/3 cursor-pointer items-center justify-between p-2 px-4 hover:border-transition-color-20 lg:basis-auto lg:flex-row-reverse lg:justify-end lg:gap-2 lg:rounded-sm lg:hover:opacity-100 ${field.getValue() === option ? "opacity-100" : "opacity-20"} ${monsterFormState === "DISPLAY" ? " pointer-events-none border-transparent bg-transparent" : " pointer-events-auto border-transition-color-8 bg-transition-color-8"}`}
                                      >
                                        {
                                          dictionary.db.enums[
                                            (key.charAt(0).toLocaleUpperCase() +
                                              key.slice(
                                                1,
                                              )) as keyof typeof $Enums
                                          ][
                                            option as keyof (typeof $Enums)[keyof typeof $Enums]
                                          ]
                                        }
                                        <input
                                          disabled={
                                            monsterFormState === "DISPLAY"
                                          }
                                          id={field.name + option}
                                          name={field.name}
                                          value={option}
                                          checked={field.getValue() === option}
                                          type="radio"
                                          onBlur={field.handleBlur}
                                          onChange={(e) =>
                                            field.handleChange(e.target.value)
                                          }
                                          className={` mt-0.5 hidden rounded px-4 py-2`}
                                        />
                                        {icon}
                                      </label>
                                    );
                                  })}
                              </div>
                            </fieldset>
                          );
                        }}
                      </form.Field>
                    );

                  default:
                    return (
                      <form.Field
                        key={key}
                        name={key as keyof Monster}
                        validators={{
                          onChangeAsyncDebounceMs: 500,
                          onChangeAsync:
                            MonsterSchema.shape[key as keyof Monster],
                        }}
                      >
                        {(field) => {
                          return (
                            <fieldset
                              key={key}
                              className="flex basis-full flex-col gap-1 p-2"
                            >
                              <span>
                                {
                                  dictionary.db.models.monster[
                                    key as keyof Monster
                                  ]
                                }
                                <FieldInfo field={field} />
                              </span>
                              <div
                                className={`inputContianer mt-1 flex flex-wrap gap-2 self-start rounded ${monsterFormState === "DISPLAY" ? " outline-transition-color-20" : ""}`}
                              >
                                {"options" in zodValue &&
                                  zodValue.options.map((option) => {
                                    return (
                                      <label
                                        key={key + option}
                                        className={`flex cursor-pointer items-center justify-between gap-2 rounded-full p-2 px-4 hover:border-transition-color-20 lg:flex-row-reverse lg:justify-end lg:rounded-sm lg:hover:opacity-100 ${field.getValue() === option ? "opacity-100" : "opacity-20"} ${monsterFormState === "DISPLAY" ? " pointer-events-none border-transparent bg-transparent" : " pointer-events-auto border-transition-color-8 bg-transition-color-8"}`}
                                      >
                                        {
                                          dictionary.db.enums[
                                            (key.charAt(0).toLocaleUpperCase() +
                                              key.slice(
                                                1,
                                              )) as keyof typeof $Enums
                                          ][
                                            option as keyof (typeof $Enums)[keyof typeof $Enums]
                                          ]
                                        }
                                        <input
                                          disabled={
                                            monsterFormState === "DISPLAY"
                                          }
                                          id={field.name + option}
                                          name={field.name}
                                          value={option}
                                          checked={field.getValue() === option}
                                          type="radio"
                                          onBlur={field.handleBlur}
                                          onChange={(e) =>
                                            field.handleChange(e.target.value)
                                          }
                                          className={` mt-0.5 rounded px-4 py-2`}
                                        />
                                      </label>
                                    );
                                  })}
                              </div>
                            </fieldset>
                          );
                        }}
                      </form.Field>
                    );
                }
              }

              default: {
                switch (key as keyof Monster) {
                  case "specialBehavior":
                    return (
                      <form.Field
                        key={key}
                        name={key as keyof Monster}
                        validators={{
                          onChangeAsyncDebounceMs: 500,
                          onChangeAsync:
                            MonsterSchema.shape[key as keyof Monster],
                        }}
                      >
                        {(field) => {
                          return (
                            <fieldset
                              key={key}
                              className="flex basis-full flex-col gap-1 p-2"
                            >
                              <label
                                htmlFor={field.name}
                                className="flex w-full flex-col gap-1"
                              >
                                <span>
                                  {
                                    dictionary.db.models.monster[
                                      key as keyof Monster
                                    ]
                                  }
                                  <FieldInfo field={field} />
                                </span>
                                <input
                                  id={field.name}
                                  name={field.name}
                                  className="hidden"
                                />
                                <MDXEditor
                                  ref={mdxEditorRef}
                                  contentEditableClassName="prose"
                                  markdown={
                                    monster.specialBehavior ?? ""
                                  }
                                  onBlur={field.handleBlur}
                                  onChange={(markdown) =>
                                    field.handleChange(markdown)
                                  }
                                  plugins={[
                                    headingsPlugin(),
                                    listsPlugin(),
                                    quotePlugin(),
                                    thematicBreakPlugin(),
                                    linkDialogPlugin(),
                                    diffSourcePlugin(),
                                    imagePlugin(),
                                    tablePlugin(),
                                  ].concat(
                                   window.innerWidth < 1024
                                      ? []
                                      : [
                                          toolbarPlugin({
                                            toolbarContents: () => (
                                              <>
                                                <DiffSourceToggleWrapper>
                                                  {" "}
                                                  <UndoRedo />
                                                  <Separator />
                                                  <BoldItalicUnderlineToggles />
                                                  <BlockTypeSelect />
                                                  <CodeToggle />
                                                  <Separator />
                                                  <ListsToggle />
                                                  {/* <Separator />
                                                  <CreateLink />
                                                  <InsertImage /> */}
                                                  <Separator />
                                                  <InsertTable />
                                                  <InsertThematicBreak />
                                                </DiffSourceToggleWrapper>
                                              </>
                                            ),
                                          }),
                                        ],
                                  )}
                                  className={`mt-1 w-full flex-1 rounded outline-transition-color-20 ${monsterFormState === "DISPLAY" ? "display pointer-events-none" : " pointer-events-auto"} ${theme.theme === "dark" && "dark-theme dark-editor"}`}
                                />
                              </label>
                            </fieldset>
                          );
                        }}
                      </form.Field>
                    );

                  default:
                    return (
                      <form.Field
                        key={key}
                        name={key as keyof Monster}
                        validators={{
                          onChangeAsyncDebounceMs: 500,
                          onChangeAsync:
                            MonsterSchema.shape[key as keyof Monster],
                        }}
                      >
                        {(field) => {
                          return (
                            <fieldset
                              key={key}
                              className="flex basis-1/2 flex-col gap-1 p-2 lg:basis-1/4"
                            >
                              <label
                                htmlFor={field.name}
                                className="flex w-full flex-col gap-1"
                              >
                                <span>
                                  {
                                    dictionary.db.models.monster[
                                      key as keyof Monster
                                    ]
                                  }
                                  <FieldInfo field={field} />
                                </span>
                                <input
                                  disabled={monsterFormState === "DISPLAY"}
                                  id={field.name}
                                  name={field.name}
                                  value={
                                    typeof field.state.value !== "object"
                                      ? field.state.value
                                      : undefined
                                  }
                                  type={inputType}
                                  onBlur={field.handleBlur}
                                  onChange={(e) =>
                                    field.handleChange(
                                      inputType === "number"
                                        ? parseFloat(e.target.value)
                                        : e.target.value,
                                    )
                                  }
                                  className={`mt-1 w-full flex-1 rounded px-4 py-2 ${monsterFormState === "DISPLAY" ? " pointer-events-none bg-transparent outline-transition-color-20" : " pointer-events-auto bg-transition-color-8"} ddd`}
                                />
                              </label>
                            </fieldset>
                          );
                        }}
                      </form.Field>
                    );
                }
              }
            }
          })}
        </fieldset>
      </div>
      <div className="functionArea flex justify-end border-t-1.5 border-brand-color-1st py-3">
        <div className="btnGroup flex gap-2">
          <Button
            onClick={() => {
              setMonsterFormState("DISPLAY");
              setMonsterDialogState(!monsterDialogState);
            }}
          >
            {dictionary.ui.monster.close} [Esc]
          </Button>
          {monsterFormState == "DISPLAY" &&
            session?.user && (
              <Button onClick={() => setMonsterFormState("UPDATE")}>
                {dictionary.ui.monster.modify} [Enter]
              </Button>
            )}
          {monsterFormState !== "DISPLAY" && (
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit]) => (
                <Button
                  type="submit"
                  level="primary"
                  disabled={!(canSubmit && !dataUploadingState)}
                >
                  {dataUploadingState
                    ? dictionary.ui.monster.upload + "..."
                    : dictionary.ui.monster.upload + " [Enter]"}
                </Button>
              )}
            </form.Subscribe>
          )}
        </div>
      </div>
    </form>
  );
}
