"use client";
import React, { useEffect } from "react";

import { api } from "~/trpc/react";
import type { getDictionary } from "~/app/get-dictionary";

import { useRouter } from "next/navigation";
import Button from "../_components/button";
import { type Monster as zMonster, MonsterSchema } from "prisma/generated/zod";
import { type FieldApi, useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { ZodFirstPartyTypeKind, type z } from "zod";
import { type Monster, type $Enums } from "@prisma/client";
import { useBearStore } from "~/app/store";

export default function MonsterForm(props: {
  dictionary: ReturnType<typeof getDictionary>;
  defaultMonster: Monster;
  setDefaultMonsterList: (list: Monster[]) => void;
}) {
  const router = useRouter();
  const { dictionary, defaultMonster, setDefaultMonsterList } = props;
  const newListQuery = api.monster.getUserVisbleList.useQuery();
  // 状态管理参数
  const {
    monster,
    monsterDialogState,
    setMonsterList,
    setMonsterDialogState,
    monsterFormState,
  } = useBearStore((state) => state.monsterPage);
  let newMonster: Monster;
  const stateString =
    monsterFormState === "CREATE"
      ? dictionary.ui.monster.upload
      : dictionary.ui.monster.modify;

  const createMonster = api.monster.create.useMutation({
    onSuccess: async () => {
      // 创建成功后重新获取数据
      const newList = await newListQuery.refetch();
      // 确保数据已成功加载
      if (newList.isSuccess) {
        setDefaultMonsterList(newList.data);
        setMonsterList(newList.data);
      }
      setMonsterDialogState(!monsterDialogState);
      router.refresh();
    },
  });

  const updateMonster = api.monster.update.useMutation({
    onSuccess: async () => {
      // 更新成功后重新获取数据
      const newList = await newListQuery.refetch();
      // 确保数据已成功加载
      if (newList.isSuccess) {
        setDefaultMonsterList(newList.data);
        setMonsterList(newList.data);
      }
      setMonsterDialogState(!monsterDialogState);
      router.refresh();
    },
  });

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
    defaultValues: defaultMonster,
    onSubmit: async ({ value }) => {
      newMonster = {
        ...value,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
        viewCount: 0,
        usageTimestamps: [],
        viewTimestamps: [],
      } satisfies Monster;
      if (monsterFormState === "CREATE") {
        createMonster.mutate(newMonster);
      } else if (monsterFormState === "UPDATE") {
        newMonster.id = monster.id;
        updateMonster.mutate(newMonster);
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

  // 表单元素
  const formRef = React.useRef<HTMLFormElement>(null);

  useEffect(() => {
    // escape键监听
    const handleEscapeKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMonsterDialogState(!monsterDialogState);
      }
    };

    // enter键监听
    const handleEnterKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        console.log("按下了回车");
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }
    };

    // 监听绑带与清除
    const formElement = formRef.current;
    formElement?.addEventListener("keydown", handleEscapeKeyPress);
    formElement?.addEventListener("keydown", handleEnterKeyPress);

    return () => {
      if (formElement) {
        formElement.removeEventListener("keydown", handleEscapeKeyPress);
        formElement.removeEventListener("keydown", handleEnterKeyPress);
      }
    };
  }, [form, monsterDialogState, setMonsterDialogState]);

  return (
    <form.Provider>
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className={`CreateMonsterFrom flex w-full max-w-7xl flex-col gap-4 overflow-y-auto rounded px-3 lg:w-4/5`}
      >
        <div className="title flex justify-between border-b-1.5 border-brand-color-1st p-3 text-lg font-semibold">
          <span>{stateString}</span>
        </div>
        <div className="inputArea flex-1 overflow-y-auto">
          <fieldset className="dataKinds flex flex-col flex-wrap lg:flex-row">
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
                          <div className="inputContianer flex flex-col gap-2 lg:flex-row">
                            {type.map((option) => {
                              return (
                                <label
                                  key={key + option}
                                  className=" flex cursor-pointer justify-between gap-2 rounded-full border-1.5 border-transition-color-8 p-2 px-4 hover:border-transition-color-20 lg:flex-row-reverse lg:justify-end"
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
                                    id={field.name + option}
                                    name={field.name}
                                    value={option}
                                    type="radio"
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                    className=" mt-1 rounded bg-transition-color-8 px-4 py-2"
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
                            className="flex basis-1/4 flex-col gap-1 p-2"
                          >
                            {dictionary.db.models.monster[key as keyof Monster]}
                            <input
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
                              className=" mt-1 rounded bg-transition-color-8 px-4 py-2"
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
            <Button onClick={() => setMonsterDialogState(!monsterDialogState)}>
              {dictionary.ui.monster.close} [Esc]
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit]) => (
                <Button
                  type="submit"
                  level="primary"
                  disabled={createMonster.isLoading || !canSubmit}
                >
                  {createMonster.isLoading
                    ? `${stateString}...`
                    : `${stateString + " [Enter]"}`}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </div>
      </form>
    </form.Provider>
  );
}
