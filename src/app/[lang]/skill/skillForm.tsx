"use client";
import React, { useEffect } from "react";

import { tApi } from "~/trpc/react";
import type { getDictionary } from "~/app/get-dictionary";
import Button from "../_components/button";
import { type Skill as zSkill, SkillSchema } from "prisma/generated/zod";
import { type FieldApi, useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { ZodFirstPartyTypeKind, type z } from "zod";
import { type Skill, type $Enums } from "@prisma/client";
import { defaultSkill, useBearStore } from "~/app/store";
import { type Session } from "next-auth";

export default function SkillForm(props: {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
  setDefaultSkillList: (list: Skill[]) => void;
}) {
  const { dictionary, session, setDefaultSkillList } = props;
  const newListQuery = tApi.skill.getUserVisbleList.useQuery();
  // 状态管理参数
  const {
    skill,
    skillDialogState,
    setSkillList,
    setSkillDialogState,
    skillFormState,
    setSkillFormState,
  } = useBearStore((state) => state.skillPage);
  let newSkill: Skill;
  const formTitle = {
    CREATE: dictionary.ui.skill.upload,
    UPDATE: dictionary.ui.skill.modify,
    DISPLAY: skill.name,
  }[skillFormState];
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
  const hiddenData: Array<keyof Skill> = [
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
      CREATE: defaultSkill,
      UPDATE: skill,
      DISPLAY: skill,
    }[skillFormState],
    onSubmit: async ({ value }) => {
      setDataUploadingState(true);
      newSkill = {
        ...value,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
        viewCount: 0,
        usageTimestamps: [],
        viewTimestamps: [],
      } satisfies Skill;
      switch (skillFormState) {
        case "CREATE":
          createSkill.mutate(newSkill);
          break;

        case "UPDATE":
          updateSkill.mutate(newSkill);
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
  const createSkill = tApi.skill.create.useMutation({
    onSuccess: async () => {
      // 创建成功后重新获取数据
      const newList = await newListQuery.refetch();
      // 确保数据已成功加载
      if (newList.isSuccess) {
        setDefaultSkillList(newList.data);
        setSkillList(newList.data);
      }
      // 上传成功后表单转换为展示状态
      setDataUploadingState(false);
      setSkillFormState("DISPLAY");
    },
  });
  const updateSkill = tApi.skill.update.useMutation({
    onSuccess: async () => {
      // 更新成功后重新获取数据
      const newList = await newListQuery.refetch();
      // 确保数据已成功加载后，更新本地数据
      if (newList.isSuccess) {
        setDefaultSkillList(newList.data);
        setSkillList(newList.data);
      }
      // 上传成功后表单转换为展示状态
      setDataUploadingState(false);
      setSkillFormState("DISPLAY");
    },
  });

  useEffect(() => {
    console.log("SkillForm render");
    // escape键监听
    const handleEscapeKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSkillDialogState(!skillDialogState);
      }
    };

    // enter键监听
    const handleEnterKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        skillFormState !== "DISPLAY" && void form.handleSubmit();
      }
    };

    // 监听绑带与清除
    document.addEventListener("keydown", handleEscapeKeyPress);
    document.addEventListener("keydown", handleEnterKeyPress);

    return () => {
      console.log("SkillForm unmount");
      document.removeEventListener("keydown", handleEscapeKeyPress);
      document.removeEventListener("keydown", handleEnterKeyPress);
    };
  }, [form, skillDialogState, skillFormState, setSkillDialogState]);

  return (
    <form.Provider>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className={`CreateSkillFrom flex w-full max-w-7xl flex-col gap-4 overflow-y-auto rounded px-3 lg:w-4/5`}
      >
        <div className="title flex items-center gap-6 pt-10">
          <div className="h-[2px] flex-1 bg-accent-color"></div>
          <span className="text-lg font-bold lg:text-2xl">{formTitle}</span>
          <div className="h-[2px] flex-1 bg-accent-color"></div>
        </div>
        <div className="inputArea flex-1 overflow-y-auto">
          <fieldset className="dataKinds flex flex-row flex-wrap gap-y-[4px]">
            {Object.entries(SkillSchema.shape).map(([key, value]) => {
              // 遍历怪物zod模型
              if (hiddenData.includes(key as keyof Skill)) return undefined;
              return (
                <form.Field
                  key={key}
                  name={key as keyof Skill}
                  validators={{
                    onChangeAsyncDebounceMs: 500,
                    onChangeAsync: SkillSchema.shape[key as keyof zSkill],
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
                            {dictionary.db.models.skill[key as keyof Skill]}
                          </span>
                          <div
                            className={`inputContianer mt-1 flex flex-wrap gap-2 self-start rounded ${skillFormState === "DISPLAY" ? " outline-transition-color-20" : ""}`}
                          >
                            {type.map((option) => {
                              return (
                                <label
                                  key={key + option}
                                  className={`flex cursor-pointer items-center justify-between gap-2 rounded-full p-2 px-4 hover:border-transition-color-20 lg:flex-row-reverse lg:justify-end lg:rounded-sm ${skillFormState === "DISPLAY" ? " pointer-events-none border-transparent bg-transparent" : " pointer-events-auto border-transition-color-8 bg-transition-color-8"}`}
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
                                    disabled={skillFormState === "DISPLAY"}
                                    id={field.name + option}
                                    name={field.name}
                                    value={option}
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
                            {dictionary.db.models.skill[key as keyof Skill]}
                            <input
                              disabled={skillFormState === "DISPLAY"}
                              id={field.name}
                              name={field.name}
                              type={inputType}
                              value={
                                typeof field.state.value !== "object"
                                  ? field.state.value
                                  : undefined
                              }
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(
                                  inputType === "number"
                                    ? parseFloat(e.target.value)
                                    : e.target.value,
                                )
                              }
                              className={`mt-1 w-full flex-1 rounded px-4 py-2 ${skillFormState === "DISPLAY" ? " pointer-events-none bg-transparent outline-transition-color-20" : " pointer-events-auto bg-transition-color-8"}`}
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
                setSkillFormState("DISPLAY");
                setSkillDialogState(!skillDialogState);
              }}
            >
              {dictionary.ui.skill.close} [Esc]
            </Button>
            {skillFormState == "DISPLAY" && session?.user && (
              <Button onClick={() => setSkillFormState("UPDATE")}>
                {dictionary.ui.skill.modify} [Enter]
              </Button>
            )}
            {skillFormState !== "DISPLAY" && (
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
                      ? dictionary.ui.skill.upload + "..."
                      : dictionary.ui.skill.upload + " [Enter]"}
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
