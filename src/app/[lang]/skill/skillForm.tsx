"use client";
import React, { useEffect } from "react";

import { tApi } from "~/trpc/react";
import type { getDictionary } from "~/app/get-dictionary";
import Button from "../_components/button";
import {
  type FieldApi,
  useForm,
  useField,
} from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { ZodFirstPartyTypeKind, type z } from "zod";
import { type $Enums } from "@prisma/client";
import { defaultSkill, defaultSkillEffect, useBearStore } from "~/app/store";
import { type Session } from "next-auth";
import { type SkillEffect, type Skill } from "~/server/api/routers/skill";
import { skillInputSchema } from "~/schema/skillSchame";

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
  const skillHiddenData: Array<keyof Skill> = [
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

  const skillEffectHiddenData: Array<keyof SkillEffect> = [
    "id",
    "belongToskillId",
  ];

  const skillEffectCostHiddenData: Array<keyof SkillEffect["skillCost"][0]> = [
    "id",
    "skillEffectId",
  ];

  const skillEffectYieldHiddenData: Array<keyof SkillEffect["skillYield"][0]> =
    ["id", "skillEffectId"];

  // 定义表单
  const form = useForm({
    defaultValues: {
      CREATE: defaultSkill,
      UPDATE: skill,
      DISPLAY: skill,
    }[skillFormState],
    // onSubmit: async ({ value }) => {
    //   console.log("onSubmit", value);
    //   setDataUploadingState(true);
    //   newSkill = {
    //     ...value,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     usageCount: 0,
    //     viewCount: 0,
    //     usageTimestamps: [],
    //     viewTimestamps: [],
    //   } satisfies Skill;
    //   switch (skillFormState) {
    //     case "CREATE":
    //       createSkill.mutate(newSkill);
    //       break;

    //     case "UPDATE":
    //       updateSkill.mutate(newSkill);
    //       break;

    //     default:
    //       break;
    //   }
    //   setSkillDialogState(false);
    // },
    validatorAdapter: zodValidator,
  });

  // 获取Zod类型
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

  // 创建技能
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

  // 更新技能
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
    console.log("---SkillForm rendered");
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
      console.log("---SkillForm unmount");
      document.removeEventListener("keydown", handleEscapeKeyPress);
      document.removeEventListener("keydown", handleEnterKeyPress);
    };
  }, [form, skillDialogState, skillFormState, setSkillDialogState]);

  const Formfragment = <T extends keyof U, U>(
    key: string,
    value: T,
    parent: Skill,
  ) => {
    const field = useField<Skill, keyof Skill>({
      name: key as keyof Skill,
      form: useForm({
        defaultValues: defaultSkill,
      }),
    });
    if (!Array.isArray(value)) {
      if (typeof value !== "object") {
        // 粗略认定为string或number类型
        if (skillHiddenData.includes(key as keyof Skill)) return undefined; // 过滤掉隐藏的数据
        // 进一步用zod判断是否为枚举类型
        const zodValue = skillInputSchema.shape[key as keyof Skill];
        const valueType = getZodType(zodValue);
        const { ZodNumber, ZodString, ZodDate, ...Others } =
          ZodFirstPartyTypeKind;
        // 输入框的类型计算
        const inputType: React.HTMLInputTypeAttribute = {
          [ZodNumber]: "number",
          [ZodString]: "text",
          [ZodDate]: "date",
          ...Others,
        }[valueType];

        // 区分枚举类型与自由类型
        switch (valueType) {
          case ZodFirstPartyTypeKind.ZodEnum:
          default:
            return (
              <fieldset className="flex basis-1/2 flex-col gap-1 p-2 lg:basis-1/4">
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
      }
    }
  };

  return (
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
          { 
            Object.entries(skill).map(([key, _]) => {
            // 遍历对象键
            // 过滤掉隐藏的数据
            if (skillHiddenData.includes(key as keyof Skill)) return undefined;
            // 输入框的类型计算
            const zodValue = skillInputSchema.shape[key as keyof Skill];
            const valueType = getZodType(zodValue);
            const { ZodNumber, ZodString, ...Others } = ZodFirstPartyTypeKind;
            const inputType = {
              [ZodNumber]: "number",
              [ZodString]: "text",
              ...Others,
            }[valueType];
            switch (valueType) {
              case ZodFirstPartyTypeKind.ZodEnum: {
                // return null;
                // 枚举类型的输入框以单选框的形式创建
                return "options" in zodValue ? (
                  <form.Field
                    key={key}
                    name={key as keyof Skill}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: skillInputSchema.shape[key as keyof Skill],
                    }}
                  >
                    {(field) => {
                      return (
                        <fieldset className="flex basis-full flex-col gap-1 p-2">
                          <span>
                            {dictionary.db.models.skill[key as keyof Skill]}
                          </span>
                          <div
                            className={`inputContianer mt-1 flex flex-wrap gap-2 self-start rounded ${skillFormState === "DISPLAY" ? " outline-transition-color-20" : ""}`}
                          >
                            {zodValue.options.map((option) => {
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
                    }}
                  </form.Field>
                ) : null;
              }

              case ZodFirstPartyTypeKind.ZodArray: {
                // return null;
                return (
                  <form.Field key={key} name={key as keyof Skill} mode="array">
                    {(field) => {
                      console.log(key)
                      return (
                        <fieldset className="flex basis-1/2 flex-col gap-1 p-2 lg:basis-1/4">
                          {/* {key +
                              new Date().toLocaleString() +
                              Array.isArray(field.state.value)} */}
                          {/* {JSON.stringify(form.state.values, null, 2)} */}
                          <label className="flex w-full flex-col gap-1">
                            {dictionary.db.models.skill.skillEffect}
                            {field.state.value &&
                              Array.isArray(field.state.value) &&
                              field.state.value.map((subObj, i) => {
                                // console.log(i,subObj)
                                return null
                                // return (Object.entries(subObj).map(([subKey, _]) => {
                                //     if (
                                //       skillEffectHiddenData.includes(
                                //         subKey as keyof SkillEffect,
                                //       )
                                //     )
                                //       return undefined;
                                //     // console.log(i,subKey)
                                //     // 输入框的类型定义
                                //     const zodValue =
                                //       skillEffectInputSchema.shape[
                                //         subKey as keyof SkillEffect
                                //       ];
                                //     const valueType = getZodType(zodValue);
                                //     const { ZodNumber, ZodString, ...Others } =
                                //       ZodFirstPartyTypeKind;
                                //     const inputType = {
                                //       [ZodNumber]: "number",
                                //       [ZodString]: "text",
                                //       ...Others,
                                //     }[valueType];
                                //     // return `skillEffect.${i}.${subKey as keyof SkillEffect}\n`
                                //     switch (valueType) {
                                //       // case ZodFirstPartyTypeKind.ZodEnum: {
                                //       //   // 枚举类型的输入框以单选框的形式创建
                                //       //   return "options" in zodValue ? (
                                //       //     <form.Field
                                //       //       key={"skillEffect" + i + subKey}
                                //       //       name={`skillEffect`}
                                //       //       validators={{
                                //       //         onChangeAsyncDebounceMs: 500,
                                //       //         onChangeAsync:
                                //       //           skillEffectInputSchema
                                //       //             .shape[
                                //       //             subKey as keyof SkillEffect
                                //       //           ],
                                //       //       }}
                                //       //     >
                                //       //       {(subField) => {
                                //       //         return (
                                //       //           <fieldset className="flex basis-full flex-col gap-1 p-2">
                                //       //             <span>
                                //       //               {
                                //       //                 dictionary.db.models
                                //       //                   .skillEffect[
                                //       //                   subKey as keyof SkillEffect
                                //       //                 ]
                                //       //               }
                                //       //             </span>
                                //       //             <div
                                //       //               className={`inputContianer mt-1 flex flex-wrap gap-2 self-start rounded ${skillFormState === "DISPLAY" ? " outline-transition-color-20" : ""}`}
                                //       //             >
                                //       //               {Array.isArray(
                                //       //                 zodValue.options,
                                //       //               ) &&
                                //       //                 zodValue.options.map(
                                //       //                   (option) => {
                                //       //                     return (
                                //       //                       <label
                                //       //                         key={
                                //       //                           "skillEffect" +
                                //       //                           i +
                                //       //                           subKey +
                                //       //                           option
                                //       //                         }
                                //       //                         className={`flex cursor-pointer items-center justify-between gap-2 rounded-full p-2 px-4 hover:border-transition-color-20 lg:flex-row-reverse lg:justify-end lg:rounded-sm ${skillFormState === "DISPLAY" ? " pointer-events-none border-transparent bg-transparent" : " pointer-events-auto border-transition-color-8 bg-transition-color-8"}`}
                                //       //                       >
                                //       //                         {
                                //       //                           dictionary
                                //       //                             .db.enums[
                                //       //                             (subKey
                                //       //                               .charAt(
                                //       //                                 0,
                                //       //                               )
                                //       //                               .toLocaleUpperCase() +
                                //       //                               subKey.slice(
                                //       //                                 1,
                                //       //                               )) as keyof typeof $Enums
                                //       //                           ][
                                //       //                             option as keyof (typeof $Enums)[keyof typeof $Enums]
                                //       //                           ]
                                //       //                         }
                                //       //                         <input
                                //       //                           disabled={
                                //       //                             skillFormState ===
                                //       //                             "DISPLAY"
                                //       //                           }
                                //       //                           id={
                                //       //                             subField.name +
                                //       //                             option
                                //       //                           }
                                //       //                           name={
                                //       //                             subField.name
                                //       //                           }
                                //       //                           value={`${option}`}
                                //       //                           type="radio"
                                //       //                           onBlur={
                                //       //                             subField.handleBlur
                                //       //                           }
                                //       //                           onChange={(
                                //       //                             e,
                                //       //                           ) =>
                                //       //                             subField.handleChange(
                                //       //                               e.target
                                //       //                                 .value,
                                //       //                             )
                                //       //                           }
                                //       //                           className={` mt-0.5 rounded px-4 py-2`}
                                //       //                         />
                                //       //                       </label>
                                //       //                     );
                                //       //                   },
                                //       //                 )}
                                //       //             </div>
                                //       //             <FieldInfo
                                //       //               field={subField}
                                //       //             />
                                //       //           </fieldset>
                                //       //         );
                                //       //       }}
                                //       //     </form.Field>
                                //       //   ) : null;
                                //       // }

                                //       // case ZodFirstPartyTypeKind.ZodArray: {
                                //       //   return null;
                                //       // }

                                //       default: {
                                //         return (
                                //           <form.Field
                                //             key={"skillEffect" + i + subKey}
                                //             name={`skillEffect[${i}].${subKey as keyof SkillEffect}`}
                                //             validators={{
                                //               onChangeAsyncDebounceMs: 500,
                                //               onChangeAsync:
                                //                 skillEffectInputSchema.shape[
                                //                   subKey as keyof SkillEffect
                                //                 ],
                                //             }}
                                //           >
                                //             {(subField) => {
                                //               return (
                                //                 <fieldset className="flex basis-1/2 flex-col gap-1 p-2 lg:basis-1/4">
                                //                   <label
                                //                     htmlFor={subField.name}
                                //                     className="flex w-full flex-col gap-1"
                                //                   >
                                //                     {dictionary.db.models
                                //                       .skillEffect[
                                //                       subKey as keyof SkillEffect
                                //                     ] + i}
                                //                     <input
                                //                       disabled={
                                //                         skillFormState ===
                                //                         "DISPLAY"
                                //                       }
                                //                       id={subField.name}
                                //                       name={subField.name}
                                //                       type={inputType}
                                //                       value={
                                //                         typeof subField.state
                                //                           .value !== "object"
                                //                           ? subField.state.value
                                //                           : undefined
                                //                       }
                                //                       onBlur={
                                //                         subField.handleBlur
                                //                       }
                                //                       onChange={(e) =>
                                //                         subField.handleChange(
                                //                           inputType === "number"
                                //                             ? parseFloat(
                                //                                 e.target.value,
                                //                               )
                                //                             : e.target.value,
                                //                         )
                                //                       }
                                //                       className={`mt-1 w-full flex-1 rounded px-4 py-2 ${skillFormState === "DISPLAY" ? " pointer-events-none bg-transparent outline-transition-color-20" : " pointer-events-auto bg-transition-color-8"}`}
                                //                     />
                                //                   </label>
                                //                   <FieldInfo field={subField} />
                                //                 </fieldset>
                                //               );
                                //             }}
                                //           </form.Field>
                                //         );
                                //       }
                                //     }
                                //   })
                                // );
                              })}
                          </label>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              // console.log(field.state.value);
                              field.pushValue(defaultSkillEffect);
                              // console.log(field.state.value);
                            }}
                          >
                            添加效果
                          </Button>
                          <FieldInfo field={field} />
                        </fieldset>
                      );
                    }}
                  </form.Field>
                );
              }

              default: {
                // return null;
                return (
                  <form.Field
                    key={key}
                    name={key as keyof Skill}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: skillInputSchema.shape[key as keyof Skill],
                    }}
                  >
                    {(field) => {
                      return (
                        <fieldset className="flex basis-1/2 flex-col gap-1 p-2 lg:basis-1/4">
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
                    }}
                  </form.Field>
                );
              }
            }
          })}
        </fieldset>
      </div>
      <div className="functionArea flex justify-end border-t-1.5 border-brand-color-1st py-3">
        <div className="btnGroup flex gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setSkillFormState("DISPLAY");
              setSkillDialogState(!skillDialogState);
            }}
          >
            {dictionary.ui.skill.close} [Esc]
          </Button>
          {skillFormState == "DISPLAY" && session?.user && (
            <Button onClick={(e) => {
              e.stopPropagation();
              setSkillFormState("UPDATE")
            }}>
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
  );
}
