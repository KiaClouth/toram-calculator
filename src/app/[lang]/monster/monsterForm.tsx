"use client";
import React, { useEffect } from "react";

import { api } from "~/trpc/react";
import type { getDictionary } from "~/app/get-dictionary";
import Button from "../_components/button";
import { type Monster as zMonster, MonsterSchema } from "prisma/generated/zod";
import { type FieldApi, useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { ZodFirstPartyTypeKind, type z } from "zod";
import { type Monster, type $Enums } from "@prisma/client";
import { defaultMonster, useBearStore } from "~/app/store";
import { type Session } from "next-auth";

export default function MonsterForm(props: {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
  setDefaultMonsterList: (list: Monster[]) => void;
}) {
  const { dictionary, session, setDefaultMonsterList } = props;
  const newListQuery = api.monster.getUserVisbleList.useQuery();
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
    return (
      <React.Fragment>
        {field.state.meta.touchedErrors ? (
          <em>{field.state.meta.touchedErrors}</em>
        ) : null}
        {/* {field.state.meta.isValidating ? "Emmm..." : null} */}
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
  const createMonster = api.monster.create.useMutation({
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
  const updateMonster = api.monster.update.useMutation({
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
    console.log("MonsterForm render");
    // escape键监听
    const handleEscapeKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMonsterDialogState(!monsterDialogState);
      }
    };

    // enter键监听
    const handleEnterKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        monsterFormState !== "DISPLAY" && void form.handleSubmit();
      }
    };

    // 监听绑带与清除
    document.addEventListener("keydown", handleEscapeKeyPress);
    document.addEventListener("keydown", handleEnterKeyPress);

    return () => {
      console.log("MonsterForm unmount");
      document.removeEventListener("keydown", handleEscapeKeyPress);
      document.removeEventListener("keydown", handleEnterKeyPress);
    };
  }, [form, monsterDialogState, monsterFormState, setMonsterDialogState]);

  return (
    <form.Provider>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className={`CreateMonsterFrom flex w-full max-w-7xl flex-col gap-4 overflow-y-auto rounded px-3 lg:w-4/5`}
      >
        <div className="title flex items-center gap-6 pt-10">
          <div className="h-[2px] flex-1 bg-accent-color"></div>
          <span className="text-lg lg:text-2xl font-bold">{formTitle}</span>
          <div className="h-[2px] flex-1 bg-accent-color"></div>
        </div>
        <div className="inputArea flex-1 overflow-y-auto">
          <fieldset className="dataKinds flex flex-wrap flex-row">
            {Object.entries(MonsterSchema.shape).map(([key, value]) => {
              // 遍历怪物zod模型
              if (hiddenData.includes(key as keyof Monster)) return undefined;
              return (
                <form.Field
                  key={key}
                  name={key as keyof Monster}
                  validators={{
                    onChangeAsyncDebounceMs: 500,
                    onChangeAsync: MonsterSchema.shape[key as keyof zMonster],
                  }}
                >
                  {(field) => {
                    const type =
                      "options" in value
                        ? (value.options as string[])
                        : getZodType(value);
                    if (Array.isArray(type)) {
                      // 枚举类型的输入框以单选框的形式创建
                      return (
                        <fieldset
                          key={key}
                          className="flex basis-full flex-col gap-1 p-2"
                        >
                          <span>
                            {dictionary.db.models.monster[key as keyof Monster]}
                          </span>
                          <div className="inputContianer flex gap-2 flex-wrap border-1.5 border-transition-color-20 rounded">
                            {type.map((option) => {
                              return (
                                <label
                                  key={key + option}
                                  className={`flex cursor-pointer justify-between gap-2 rounded-full border-1.5 p-2 px-4 hover:border-transition-color-20 lg:flex-row-reverse lg:justify-end lg:rounded-sm ${monsterFormState === "DISPLAY" ? " pointer-events-none border-transparent bg-transparent" : " pointer-events-auto border-transition-color-8 bg-transition-color-8"}`}
                                >
                                  {
                                    dictionary.db.enums[
                                      (key.charAt(0).toLocaleUpperCase() +
                                        key.slice(1)) as keyof typeof $Enums
                                    ][
                                      option as keyof (typeof $Enums)[keyof typeof $Enums]
                                    ]
                                  }
                                  <input
                                    disabled={monsterFormState === "DISPLAY"}
                                    id={field.name + option}
                                    name={field.name}
                                    value={option}
                                    type="radio"
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                    className={` mt-1 rounded px-4 py-2`}
                                  />
                                </label>
                              );
                            })}
                          </div>
                          <FieldInfo field={field} />
                        </fieldset>
                      );
                    } else if (typeof type === "string") {
                      let inputType: React.HTMLInputTypeAttribute;
                      switch (type) {
                        case ZodFirstPartyTypeKind.ZodNumber:
                          inputType = "number";

                          break;
                        case ZodFirstPartyTypeKind.ZodBoolean:
                          inputType = "checkbox";

                          break;

                        default:
                          inputType = "text";
                          break;
                      }
                      // 普通输入框
                      return (
                        <fieldset
                          key={key}
                          className="flex basis-1/2 flex-col gap-1 p-2 lg:basis-1/4"
                        >
                          <label
                            htmlFor={field.name}
                            className="flex w-full flex-col gap-1"
                          >
                            {dictionary.db.models.monster[key as keyof Monster]}
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
                              className={`flex-1 w-full mt-1 rounded px-4 py-2 ${monsterFormState === "DISPLAY" ? " pointer-events-none outline-transition-color-20 bg-transparent" : " pointer-events-auto bg-transition-color-8"}`}
                            />
                          </label>
                          <FieldInfo field={field} />
                        </fieldset>
                      );
                    }
                  }}
                </form.Field>
              );
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
            {monsterFormState == "DISPLAY" && session?.user && (
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
                    disabled={dataUploadingState || !canSubmit}
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
    </form.Provider>
  );
}
