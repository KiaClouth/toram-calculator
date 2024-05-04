"use client";
import React, { useEffect } from "react";
import "@mdxeditor/editor/style.css";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  DiffSourceToggleWrapper,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  type MDXEditorMethods,
  Separator,
  UndoRedo,
  diffSourcePlugin,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  tablePlugin,
  toolbarPlugin,
  thematicBreakPlugin,
} from "@mdxeditor/editor";
import { tApi } from "~/trpc/react";
import { type sApi } from "~/trpc/server";
import type { getDictionary } from "~/app/get-dictionary";
import Button from "../_components/button";
import { SkillEffectInputSchema, SkillInputSchema } from "~/schema/skillSchema";
import { type FieldApi, useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { ZodFirstPartyTypeKind, type z } from "zod";
import { type SkillCost, type SkillYield, type $Enums } from "@prisma/client";
import {
  defaultSkill,
  defaultSkillEffect,
  defaultSkillEffectCost,
  defaultSkillEffectYield,
  useStore,
} from "~/app/store";
import { type Session } from "next-auth";
import type { Skill, SkillEffect } from "~/server/api/routers/skill";
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
import { SkillCostSchema, SkillYieldSchema } from "prisma/generated/zod";

export default function SkillForm(props: {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
  defaultSkillList: Skill[];
  setDefaultSkillList: (list: Awaited<ReturnType<typeof sApi.skill.getUserVisbleList.query>>) => void;
}) {
  const { dictionary, session, defaultSkillList, setDefaultSkillList } = props;
  // 状态管理参数
  const { skill, skillDialogState, setSkillList, setSkillDialogState, skillFormState, setSkillFormState } = useStore(
    (state) => state.skillPage,
  );
  let newSkill: Skill;
  const formTitle = {
    CREATE: dictionary.ui.skill.upload,
    UPDATE: dictionary.ui.skill.modify,
    DISPLAY: skill.name,
  }[skillFormState];
  const [dataUploadingState, setDataUploadingState] = React.useState(false);
  const theme = useTheme();
  const mdxEditorRef = React.useRef<MDXEditorMethods>(null);

  function FieldInfo({
    field,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: FieldApi<any, any, any, any>;
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
  type tSkill = Omit<Skill, keyof typeof skillHiddenData>;

  const skillEffectHiddenData: Array<keyof SkillEffect> = ["id", "belongToskillId"];
  type tSkillEffect = Omit<SkillEffect, keyof typeof skillEffectHiddenData>;

  const skillEffectCostHiddenData: Array<keyof SkillCost> = ["id", "skillEffectId"];
  type tSkillEffectCost = Omit<SkillCost, keyof typeof skillEffectCostHiddenData>;

  const skillEffectYiledHiddenData: Array<keyof SkillYield> = ["id", "skillEffectId"];
  type tSkillEffectYiled = Omit<SkillYield, keyof typeof skillEffectYiledHiddenData>;

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
          {
            createSkill.mutate(newSkill);
            console.log("create skill", createSkill);
          }
          break;

        case "UPDATE":
          updateSkill.mutate(newSkill);
          break;

        default:
          break;
      }
      setSkillDialogState(false);
    },
    validatorAdapter: zodValidator,
  });

  const getZodType = <T extends z.ZodTypeAny>(schema: T): ZodFirstPartyTypeKind => {
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
    onSuccess(data) {
      const newList = [...defaultSkillList, data];
      // 创建成功后更新数据
      setDefaultSkillList(newList);
      setSkillList(newList);
      // 上传成功后表单转换为展示状态
      setDataUploadingState(false);
      setSkillFormState("DISPLAY");
    },
  });

  const updateSkill = tApi.skill.update.useMutation({
    onSuccess(data) {
      const newList = defaultSkillList.map((skill) => {
        if (skill.id === data.id) {
          return data;
        }
        return skill;
      });
      // 更新成功后更新数据
      setDefaultSkillList(newList);
      setSkillList(newList);
      // 上传成功后表单转换为展示状态
      setDataUploadingState(false);
      setSkillFormState("DISPLAY");
    },
  });

  useEffect(() => {
    console.log("---SkillForm render");
    mdxEditorRef.current?.setMarkdown(skill.skillDescription ?? "");
    // escape键监听
    const handleEscapeKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSkillDialogState(!skillDialogState);
      }
    };

    // 监听绑带与清除
    document.addEventListener("keydown", handleEscapeKeyPress);

    return () => {
      console.log("---SkillForm unmount");
      document.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, [form, skill, skillDialogState, skillFormState, setSkillDialogState]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className={`CreateSkillFrom flex w-full flex-col gap-4 overflow-y-auto rounded px-3`}
    >
      <div className="title flex items-center gap-6 pt-4">
        <div className="h-[2px] flex-1 bg-accent-color"></div>
        <span className="text-lg font-bold lg:text-2xl">{formTitle}</span>
        <div className="h-[2px] flex-1 bg-accent-color"></div>
      </div>
      <div className="inputArea flex-1 overflow-y-auto">
        <fieldset className="dataKinds flex flex-row flex-wrap gap-y-[4px]">
          {Object.entries(skill).map(([key, _]) => {
            // 遍历技能模型
            // 过滤掉隐藏的数据
            if (skillHiddenData.includes(key as keyof Skill)) return undefined;
            // 输入框的类型计算
            const zodValue = SkillInputSchema.shape[key as keyof tSkill];
            const valueType = getZodType(zodValue);
            const { ZodNumber, ZodString, ...Others } = ZodFirstPartyTypeKind;
            const inputType = {
              [ZodNumber]: "number",
              [ZodString]: "text",
              ...Others,
            }[valueType];
            switch (valueType) {
              case ZodFirstPartyTypeKind.ZodEnum: {
                return (
                  <form.Field
                    key={key}
                    name={key as keyof tSkill}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: SkillInputSchema.shape[key as keyof tSkill],
                    }}
                  >
                    {(field) => (
                      <fieldset key={key} className="flex basis-full flex-col gap-1 p-2">
                        <span>
                          {dictionary.db.models.skill[key as keyof tSkill]}
                          <FieldInfo field={field} />
                        </span>
                        <div
                          className={`inputContianer mt-1 flex flex-wrap self-start rounded lg:gap-2 ${skillFormState === "DISPLAY" ? " outline-transition-color-20" : ""}`}
                        >
                          {"options" in zodValue &&
                            zodValue.options.map((option) => {
                              const defaultInputClass = "mt-0.5 rounded px-4 py-2";
                              const defaultLabelSizeClass = "";
                              let inputClass = "";
                              let labelSizeClass = "";
                              let icon: React.ReactNode = null;
                              switch (option) {
                                // case "PRIVATE":
                                // case "PUBLIC":
                                // case "COMMON_MOBS":
                                // case "COMMON_MINI_BOSS":
                                // case "EVENT_MOBS":
                                // case "EVENT_MINI_BOSS":
                                // case "EVENT_BOSS":
                                case "NO_ELEMENT":
                                  {
                                    icon = <IconElementNoElement className="h-6 w-6" />;
                                    inputClass = "mt-0.5 hidden rounded px-4 py-2";
                                    labelSizeClass = "no-element basis-1/3";
                                  }
                                  break;
                                case "LIGHT":
                                  {
                                    icon = <IconElementLight className="h-6 w-6" />;
                                    inputClass = "mt-0.5 hidden rounded px-4 py-2";
                                    labelSizeClass = "light basis-1/3";
                                  }
                                  break;
                                case "DARK":
                                  {
                                    (icon = <IconElementDark className="h-6 w-6" />),
                                      (inputClass = "mt-0.5 hidden rounded px-4 py-2");
                                    labelSizeClass = "dark basis-1/3";
                                  }
                                  break;
                                case "WATER":
                                  {
                                    icon = <IconElementWater className="h-6 w-6" />;
                                    inputClass = "mt-0.5 hidden rounded px-4 py-2";
                                    labelSizeClass = "water basis-1/3";
                                  }
                                  break;
                                case "FIRE":
                                  {
                                    icon = <IconElementFire className="h-6 w-6" />;
                                    inputClass = "mt-0.5 hidden rounded px-4 py-2";
                                    labelSizeClass = "fire basis-1/3";
                                  }
                                  break;
                                case "EARTH":
                                  {
                                    icon = <IconElementEarth className="h-6 w-6" />;
                                    inputClass = "mt-0.5 hidden rounded px-4 py-2";
                                    labelSizeClass = "earth basis-1/3";
                                  }
                                  break;
                                case "WIND":
                                  {
                                    icon = <IconElementWind className="h-6 w-6" />;
                                    inputClass = "mt-0.5 hidden rounded px-4 py-2";
                                    labelSizeClass = "wind basis-1/3";
                                  }
                                  break;
                                default:
                                  {
                                    icon = null;
                                    inputClass = defaultInputClass;
                                    labelSizeClass = defaultLabelSizeClass;
                                  }
                                  break;
                              }
                              return (
                                <label
                                  key={key + option}
                                  className={`flex ${labelSizeClass} cursor-pointer items-center justify-between gap-1 rounded-full p-2 px-4 hover:border-transition-color-20 lg:basis-auto lg:flex-row-reverse lg:justify-end lg:gap-2 lg:rounded-sm lg:hover:opacity-100 ${field.getValue() === option ? "opacity-100" : "opacity-20"} ${skillFormState === "DISPLAY" ? " pointer-events-none border-transparent bg-transparent" : " pointer-events-auto border-transition-color-8 bg-transition-color-8"}`}
                                >
                                  {
                                    dictionary.db.enums[
                                      (key.charAt(0).toLocaleUpperCase() + key.slice(1)) as keyof typeof $Enums
                                    ][option as keyof (typeof $Enums)[keyof typeof $Enums]]
                                  }
                                  <input
                                    disabled={skillFormState === "DISPLAY"}
                                    id={field.name + option}
                                    name={field.name}
                                    value={option}
                                    checked={field.getValue() === option}
                                    type="radio"
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className={inputClass}
                                  />
                                  {icon}
                                </label>
                              );
                            })}
                        </div>
                      </fieldset>
                    )}
                  </form.Field>
                );
              }

              case ZodFirstPartyTypeKind.ZodArray: {
                return (
                  <form.Field
                    key={key}
                    name={key as keyof tSkill}
                    mode="array"
                    // validators={{
                    //   onChangeAsyncDebounceMs: 500,
                    //   onChangeAsync: SkillInputSchema.shape[key as keyof tSkill],
                    // }}
                  >
                    {(field) => (
                      <fieldset key={key} className={`${key} flex basis-full flex-col gap-1 p-2`}>
                        <div className="title flex items-end gap-6 pt-4">
                          <div className="h-[1px] flex-1 bg-accent-color"></div>
                          <span className="text-lg">
                            {dictionary.db.models.skill[key as keyof tSkill]}
                            {/* <FieldInfo field={field} /> */}
                          </span>
                          <div className="h-[1px] flex-1 bg-accent-color"></div>
                        </div>
                        <div className="Content flex flex-wrap gap-y-3 rounded-sm border-1.5 border-transition-color-20">
                          {Array.isArray(field.state.value) &&
                            field.state.value.map((subObj, i) => {
                              switch (key as keyof tSkill) {
                                case "skillEffect":
                                  return key === "skillEffect" ? (
                                    <fieldset
                                      key={key + i}
                                      className={`${key + i} DataKinds flex flex-none basis-full flex-col overflow-hidden rounded-sm`}
                                    >
                                      <div className="Title flex w-full items-center justify-between border-b-1.5 border-transition-color-20 p-2">
                                        <span className="">
                                          {dictionary.db.models.skill[key as keyof tSkill] + " " + (i + 1)}
                                        </span>
                                        <Button level="tertiary" size="sm" onClick={() => field.removeValue(i)}>
                                          -
                                        </Button>
                                      </div>
                                      <div
                                        className={`InputContianer flex w-full basis-full flex-wrap gap-y-3 self-start pt-4 ${skillFormState === "DISPLAY" ? " outline-transition-color-20" : ""}`}
                                      >
                                        {Object.entries(subObj).map(([subKey, _]) => {
                                          // 遍历技能效果模型
                                          // 过滤掉隐藏的数据
                                          if (skillEffectHiddenData.includes(subKey as keyof SkillEffect))
                                            return undefined;
                                          // 输入框的类型计算
                                          const zodValue = SkillEffectInputSchema.shape[subKey as keyof tSkillEffect];
                                          const valueType = getZodType(zodValue);
                                          const { ZodNumber, ZodString, ...Others } = ZodFirstPartyTypeKind;
                                          const inputType = {
                                            [ZodNumber]: "number",
                                            [ZodString]: "text",
                                            ...Others,
                                          }[valueType];
                                          switch (valueType) {
                                            case ZodFirstPartyTypeKind.ZodEnum: {
                                              return (
                                                <form.Field
                                                  key={`${key}[${i}].${subKey}`}
                                                  name={`${key}[${i}].${subKey as keyof tSkillEffect}`}
                                                  validators={{
                                                    onChangeAsyncDebounceMs: 500,
                                                    onChangeAsync:
                                                      SkillEffectInputSchema.shape[subKey as keyof tSkillEffect],
                                                  }}
                                                >
                                                  {(subField) => (
                                                    <fieldset
                                                      key={key + i + subKey}
                                                      className={`${key + i + subKey} flex basis-full flex-col gap-1 p-2`}
                                                    >
                                                      <span>
                                                        {dictionary.db.models.skillEffect[subKey as keyof tSkillEffect]}
                                                        <FieldInfo field={subField} />
                                                      </span>
                                                      <div
                                                        className={`inputContianer mt-1 flex flex-wrap self-start rounded lg:gap-2 ${skillFormState === "DISPLAY" ? " outline-transition-color-20" : ""}`}
                                                      >
                                                        {"options" in zodValue &&
                                                          Array.isArray(zodValue.options) &&
                                                          zodValue.options.map((option) => {
                                                            const defaultInputClass = "mt-0.5 rounded px-4 py-2";
                                                            const defaultLabelSizeClass = "";
                                                            let inputClass = "";
                                                            let labelSizeClass = "";
                                                            let icon: React.ReactNode = null;
                                                            switch (option) {
                                                              case "NO_ELEMENT":
                                                                {
                                                                  icon = <IconElementNoElement className="h-6 w-6" />;
                                                                  inputClass = "mt-0.5 hidden rounded px-4 py-2";
                                                                  labelSizeClass = "no-element basis-1/3";
                                                                }
                                                                break;
                                                              case "LIGHT":
                                                                {
                                                                  icon = <IconElementLight className="h-6 w-6" />;
                                                                  inputClass = "mt-0.5 hidden rounded px-4 py-2";
                                                                  labelSizeClass = "light basis-1/3";
                                                                }
                                                                break;
                                                              case "DARK":
                                                                {
                                                                  (icon = <IconElementDark className="h-6 w-6" />),
                                                                    (inputClass = "mt-0.5 hidden rounded px-4 py-2");
                                                                  labelSizeClass = "dark basis-1/3";
                                                                }
                                                                break;
                                                              case "WATER":
                                                                {
                                                                  icon = <IconElementWater className="h-6 w-6" />;
                                                                  inputClass = "mt-0.5 hidden rounded px-4 py-2";
                                                                  labelSizeClass = "water basis-1/3";
                                                                }
                                                                break;
                                                              case "FIRE":
                                                                {
                                                                  icon = <IconElementFire className="h-6 w-6" />;
                                                                  inputClass = "mt-0.5 hidden rounded px-4 py-2";
                                                                  labelSizeClass = "fire basis-1/3";
                                                                }
                                                                break;
                                                              case "EARTH":
                                                                {
                                                                  icon = <IconElementEarth className="h-6 w-6" />;
                                                                  inputClass = "mt-0.5 hidden rounded px-4 py-2";
                                                                  labelSizeClass = "earth basis-1/3";
                                                                }
                                                                break;
                                                              case "WIND":
                                                                {
                                                                  icon = <IconElementWind className="h-6 w-6" />;
                                                                  inputClass = "mt-0.5 hidden rounded px-4 py-2";
                                                                  labelSizeClass = "wind basis-1/3";
                                                                }
                                                                break;
                                                              default:
                                                                {
                                                                  icon = null;
                                                                  inputClass = defaultInputClass;
                                                                  labelSizeClass = defaultLabelSizeClass;
                                                                }
                                                                break;
                                                            }
                                                            return (
                                                              <label
                                                                key={`${key}[${i}].${subKey}` + option}
                                                                className={`flex ${labelSizeClass} cursor-pointer items-center justify-between gap-1 rounded-full p-2 px-4 hover:border-transition-color-20 lg:basis-auto lg:flex-row-reverse lg:justify-end lg:gap-2 lg:rounded-sm lg:hover:opacity-100 ${field.getValue() === option ? "opacity-100" : "opacity-20"} ${skillFormState === "DISPLAY" ? " pointer-events-none border-transparent bg-transparent" : " pointer-events-auto border-transition-color-8 bg-transition-color-8"}`}
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
                                                                  id={subField.name + option}
                                                                  name={subField.name}
                                                                  value={typeof option === "string" ? option : ""}
                                                                  checked={subField.getValue() === option}
                                                                  type="radio"
                                                                  onBlur={subField.handleBlur}
                                                                  onChange={(e) =>
                                                                    subField.handleChange(e.target.value)
                                                                  }
                                                                  className={inputClass}
                                                                />
                                                                {icon}
                                                              </label>
                                                            );
                                                          })}
                                                      </div>
                                                    </fieldset>
                                                  )}
                                                </form.Field>
                                              );
                                            }
                                            case ZodFirstPartyTypeKind.ZodArray: {
                                              return (
                                                <form.Field
                                                  key={`${key}[${i}].${subKey}`}
                                                  name={`${key}[${i}].${subKey as keyof tSkillEffect}`}
                                                  mode="array"
                                                  // validators={{
                                                  //   onChangeAsyncDebounceMs: 500,
                                                  //   onChangeAsync:
                                                  //     SkillEffectInputSchema.shape[subKey as keyof tSkillEffect],
                                                  // }}
                                                >
                                                  {(subField) => (
                                                    <fieldset
                                                      key={key + i + subKey}
                                                      className={`${key + i + subKey} flex basis-full flex-col overflow-hidden rounded-sm`}
                                                    >
                                                      <div className="title flex items-end gap-6 pt-4">
                                                        <div className="h-[1px] flex-1 bg-transition-color-20"></div>
                                                        <span className="text-lg text-transition-color-20">
                                                          {
                                                            dictionary.db.models.skillEffect[
                                                              subKey as keyof tSkillEffect
                                                            ]
                                                          }
                                                          {/* <FieldInfo field={subField} /> */}
                                                        </span>
                                                        <div className="h-[1px] flex-1 bg-transition-color-20"></div>
                                                      </div>
                                                      <div className="Content flex flex-wrap gap-x-1 gap-y-3 p-1">
                                                        {Array.isArray(subField.state.value) &&
                                                          subField.state.value.map((subsubObj, j) => {
                                                            switch (subKey as keyof tSkillEffect) {
                                                              case "skillCost":
                                                                return subKey === "skillCost" ? (
                                                                  <fieldset
                                                                    key={subKey + j}
                                                                    className={`${subKey + j} DataKinds flex flex-none basis-full flex-col gap-y-[4px] overflow-hidden p-1 outline-transition-color-20 lg:basis-[calc(25%-0.25rem)]`}
                                                                  >
                                                                    <div className="Title flex w-full items-center justify-between border-b-1.5 border-transition-color-20 p-2">
                                                                      <span className="">
                                                                        {dictionary.db.models.skillEffect[
                                                                          subKey as keyof tSkillEffect
                                                                        ] +
                                                                          " " +
                                                                          (j + 1)}
                                                                      </span>
                                                                      <Button
                                                                        level="tertiary"
                                                                        size="sm"
                                                                        onClick={() => subField.removeValue(j)}
                                                                        className={`${skillFormState === "DISPLAY" ? "hidden" : ""}`}
                                                                      >
                                                                        -
                                                                      </Button>
                                                                    </div>

                                                                    <div
                                                                      className={`InputContianer mt-1 flex w-full basis-full flex-wrap gap-y-3 self-start rounded ${skillFormState === "DISPLAY" ? "bg-transition-color-8" : ""}`}
                                                                    >
                                                                      {subsubObj &&
                                                                        Object.entries(subsubObj).map(
                                                                          ([subsubKey, _]) => {
                                                                            // 遍历技能消耗模型
                                                                            // 过滤掉隐藏的数据
                                                                            if (
                                                                              skillEffectCostHiddenData.includes(
                                                                                subsubKey as keyof SkillCost,
                                                                              )
                                                                            )
                                                                              return undefined;
                                                                            // 输入框的类型计算
                                                                            const zodValue =
                                                                              SkillCostSchema.shape[
                                                                                subsubKey as keyof tSkillEffectCost
                                                                              ];
                                                                            const valueType = getZodType(zodValue);
                                                                            const { ZodNumber, ZodString, ...Others } =
                                                                              ZodFirstPartyTypeKind;
                                                                            const inputType = {
                                                                              [ZodNumber]: "number",
                                                                              [ZodString]: "text",
                                                                              ...Others,
                                                                            }[valueType];
                                                                            switch (valueType) {
                                                                              case ZodFirstPartyTypeKind.ZodEnum: {
                                                                                return (
                                                                                  <form.Field
                                                                                    key={`${key}[${i}].${subKey}[${j}].${subsubKey}`}
                                                                                    name={`${key}[${i}].${subKey}[${j}].${subsubKey as keyof tSkillEffectCost}`}
                                                                                    validators={{
                                                                                      onChangeAsyncDebounceMs: 500,
                                                                                      onChangeAsync:
                                                                                        SkillCostSchema.shape[
                                                                                          subsubKey as keyof tSkillEffectCost
                                                                                        ],
                                                                                    }}
                                                                                  >
                                                                                    {(subsubField) => (
                                                                                      <fieldset
                                                                                        key={subKey + i + subsubKey}
                                                                                        className="flex basis-full flex-col gap-1 p-2"
                                                                                      >
                                                                                        <span>
                                                                                          {
                                                                                            dictionary.db.models
                                                                                              .skillCost[
                                                                                              subsubKey as keyof tSkillEffectCost
                                                                                            ]
                                                                                          }
                                                                                          <FieldInfo
                                                                                            field={subsubField}
                                                                                          />
                                                                                        </span>
                                                                                        <div
                                                                                          className={`inputContianer mt-1 flex flex-wrap self-start rounded lg:gap-2 ${skillFormState === "DISPLAY" ? " outline-transition-color-20" : ""}`}
                                                                                        >
                                                                                          {"options" in zodValue &&
                                                                                            Array.isArray(
                                                                                              zodValue.options,
                                                                                            ) &&
                                                                                            zodValue.options.map(
                                                                                              (option) => {
                                                                                                const defaultInputClass =
                                                                                                  "mt-0.5 rounded px-4 py-2";
                                                                                                const defaultLabelSizeClass =
                                                                                                  "";
                                                                                                let inputClass = "";
                                                                                                let labelSizeClass = "";
                                                                                                let icon: React.ReactNode =
                                                                                                  null;
                                                                                                switch (option) {
                                                                                                  default:
                                                                                                    {
                                                                                                      icon = null;
                                                                                                      inputClass =
                                                                                                        defaultInputClass;
                                                                                                      labelSizeClass =
                                                                                                        defaultLabelSizeClass;
                                                                                                    }
                                                                                                    break;
                                                                                                }
                                                                                                return (
                                                                                                  <label
                                                                                                    key={
                                                                                                      `${key}[${i}].${subKey}[${j}].${subsubKey as keyof tSkillEffectCost}` +
                                                                                                      option
                                                                                                    }
                                                                                                    className={`flex ${labelSizeClass} cursor-pointer items-center justify-between gap-1 rounded-full p-2 px-4 hover:border-transition-color-20 lg:basis-auto lg:flex-row-reverse lg:justify-end lg:gap-2 lg:rounded-sm lg:hover:opacity-100 ${subsubField.getValue() === option ? "opacity-100" : "opacity-20"} ${skillFormState === "DISPLAY" ? " pointer-events-none border-transparent bg-transparent" : " pointer-events-auto border-transition-color-8 bg-transition-color-8"}`}
                                                                                                  >
                                                                                                    {
                                                                                                      dictionary.db
                                                                                                        .enums[
                                                                                                        (subsubKey
                                                                                                          .charAt(0)
                                                                                                          .toLocaleUpperCase() +
                                                                                                          subsubKey.slice(
                                                                                                            1,
                                                                                                          )) as keyof typeof $Enums
                                                                                                      ][
                                                                                                        option as keyof (typeof $Enums)[keyof typeof $Enums]
                                                                                                      ]
                                                                                                    }
                                                                                                    <input
                                                                                                      disabled={
                                                                                                        skillFormState ===
                                                                                                        "DISPLAY"
                                                                                                      }
                                                                                                      id={
                                                                                                        subsubField.name +
                                                                                                        option
                                                                                                      }
                                                                                                      name={
                                                                                                        subsubField.name
                                                                                                      }
                                                                                                      value={
                                                                                                        typeof option ===
                                                                                                        "string"
                                                                                                          ? option
                                                                                                          : ""
                                                                                                      }
                                                                                                      checked={
                                                                                                        subsubField.getValue() ===
                                                                                                        option
                                                                                                      }
                                                                                                      type="radio"
                                                                                                      onBlur={
                                                                                                        subsubField.handleBlur
                                                                                                      }
                                                                                                      onChange={(e) =>
                                                                                                        subsubField.handleChange(
                                                                                                          e.target
                                                                                                            .value,
                                                                                                        )
                                                                                                      }
                                                                                                      className={
                                                                                                        inputClass
                                                                                                      }
                                                                                                    />
                                                                                                    {icon}
                                                                                                  </label>
                                                                                                );
                                                                                              },
                                                                                            )}
                                                                                        </div>
                                                                                      </fieldset>
                                                                                    )}
                                                                                  </form.Field>
                                                                                );
                                                                              }
                                                                              case ZodFirstPartyTypeKind.ZodArray: {
                                                                                return (
                                                                                  <div
                                                                                    key={`${subKey}[${i}].${subsubKey}`}
                                                                                  >
                                                                                    Cost内数组
                                                                                  </div>
                                                                                );
                                                                              }
                                                                              default: {
                                                                                return (
                                                                                  <form.Field
                                                                                    key={`${key}[${i}].${subKey}[${j}].${subsubKey}`}
                                                                                    name={`${key}[${i}].${subKey}[${j}].${subsubKey as keyof tSkillEffectCost}`}
                                                                                    validators={{
                                                                                      onChangeAsyncDebounceMs: 500,
                                                                                      onChangeAsync:
                                                                                        SkillCostSchema.shape[
                                                                                          subsubKey as keyof tSkillEffectCost
                                                                                        ],
                                                                                    }}
                                                                                  >
                                                                                    {(subsubField) => {
                                                                                      return (
                                                                                        <label
                                                                                          htmlFor={`${key}[${i}].${subKey}[${j}].${subsubKey}`}
                                                                                          key={`${key}[${i}].${subKey}[${j}].${subsubKey}`}
                                                                                          className="flex w-full flex-col gap-1 p-2"
                                                                                        >
                                                                                          <span>
                                                                                            {
                                                                                              dictionary.db.models
                                                                                                .skillCost[
                                                                                                subsubKey as keyof tSkillEffectCost
                                                                                              ]
                                                                                            }
                                                                                            <FieldInfo
                                                                                              field={subsubField}
                                                                                            />
                                                                                          </span>
                                                                                          <input
                                                                                            autoComplete="off"
                                                                                            disabled={
                                                                                              skillFormState ===
                                                                                              "DISPLAY"
                                                                                            }
                                                                                            id={subsubField.name}
                                                                                            name={subsubField.name}
                                                                                            value={
                                                                                              subsubField.state.value ??
                                                                                              "未知数据"
                                                                                            }
                                                                                            type={inputType}
                                                                                            onBlur={
                                                                                              subsubField.handleBlur
                                                                                            }
                                                                                            onChange={(e) =>
                                                                                              subsubField.handleChange(
                                                                                                e.target.value ??
                                                                                                  "未知数据",
                                                                                              )
                                                                                            }
                                                                                            className={`mt-1 w-full flex-1 rounded px-4 py-2 ${skillFormState === "DISPLAY" ? " pointer-events-none bg-transparent outline-transition-color-20" : " pointer-events-auto bg-transition-color-8"}`}
                                                                                          />
                                                                                        </label>
                                                                                      );
                                                                                    }}
                                                                                  </form.Field>
                                                                                );
                                                                              }
                                                                            }
                                                                          },
                                                                        )}
                                                                    </div>
                                                                  </fieldset>
                                                                ) : null;

                                                              case "skillYield":
                                                                return subKey === "skillYield" ? (
                                                                  <fieldset
                                                                    key={subKey + j}
                                                                    className={`${subKey + j} DataKinds flex flex-none basis-full flex-col gap-y-[4px] overflow-hidden rounded p-1 outline-transition-color-20 lg:basis-[calc(50%-0.25rem)]`}
                                                                  >
                                                                    <div className="Title flex w-full items-center justify-between border-b-1.5 border-transition-color-20 p-2">
                                                                      <span className="">
                                                                        {dictionary.db.models.skillEffect[
                                                                          subKey as keyof tSkillEffect
                                                                        ] +
                                                                          " " +
                                                                          (j + 1)}
                                                                      </span>
                                                                      <Button
                                                                        level="tertiary"
                                                                        size="sm"
                                                                        onClick={() => subField.removeValue(j)}
                                                                        className={`${skillFormState === "DISPLAY" ? "hidden" : ""}`}
                                                                      >
                                                                        -
                                                                      </Button>
                                                                    </div>

                                                                    <div
                                                                      className={`InputContianer mt-1 flex w-full basis-full flex-wrap gap-y-3 self-start rounded ${skillFormState === "DISPLAY" ? "bg-transition-color-8" : ""}`}
                                                                    >
                                                                      {subsubObj &&
                                                                        Object.entries(subsubObj).map(
                                                                          ([subsubKey, _]) => {
                                                                            // 遍历技能消耗模型
                                                                            // 过滤掉隐藏的数据
                                                                            if (
                                                                              skillEffectCostHiddenData.includes(
                                                                                subsubKey as keyof SkillCost,
                                                                              )
                                                                            )
                                                                              return undefined;
                                                                            // 输入框的类型计算
                                                                            const zodValue =
                                                                              SkillYieldSchema.shape[
                                                                                subsubKey as keyof tSkillEffectYiled
                                                                              ];
                                                                            const valueType = getZodType(zodValue);
                                                                            const { ZodNumber, ZodString, ...Others } =
                                                                              ZodFirstPartyTypeKind;
                                                                            const inputType = {
                                                                              [ZodNumber]: "number",
                                                                              [ZodString]: "text",
                                                                              ...Others,
                                                                            }[valueType];
                                                                            switch (valueType) {
                                                                              case ZodFirstPartyTypeKind.ZodEnum: {
                                                                                return (
                                                                                  <form.Field
                                                                                    key={`${key}[${i}].${subKey}[${j}].${subsubKey}`}
                                                                                    name={`${key}[${i}].${subKey}[${j}].${subsubKey as keyof tSkillEffectYiled}`}
                                                                                    validators={{
                                                                                      onChangeAsyncDebounceMs: 500,
                                                                                      onChangeAsync:
                                                                                        SkillYieldSchema.shape[
                                                                                          subsubKey as keyof tSkillEffectYiled
                                                                                        ],
                                                                                    }}
                                                                                  >
                                                                                    {(subsubField) => (
                                                                                      <fieldset
                                                                                        key={subKey + i + subsubKey}
                                                                                        className="flex basis-full flex-col gap-1 p-2"
                                                                                      >
                                                                                        <span>
                                                                                          {
                                                                                            dictionary.db.models
                                                                                              .skillYield[
                                                                                              subsubKey as keyof tSkillEffectYiled
                                                                                            ]
                                                                                          }
                                                                                          <FieldInfo
                                                                                            field={subsubField}
                                                                                          />
                                                                                        </span>
                                                                                        <div
                                                                                          className={`inputContianer mt-1 flex flex-wrap self-start rounded lg:gap-2 ${skillFormState === "DISPLAY" ? " outline-transition-color-20" : ""}`}
                                                                                        >
                                                                                          {"options" in zodValue &&
                                                                                            Array.isArray(
                                                                                              zodValue.options,
                                                                                            ) &&
                                                                                            zodValue.options.map(
                                                                                              (option) => {
                                                                                                const defaultInputClass =
                                                                                                  "mt-0.5 rounded px-4 py-2";
                                                                                                const defaultLabelSizeClass =
                                                                                                  "";
                                                                                                let inputClass = "";
                                                                                                let labelSizeClass = "";
                                                                                                let icon: React.ReactNode =
                                                                                                  null;
                                                                                                switch (option) {
                                                                                                  default:
                                                                                                    {
                                                                                                      icon = null;
                                                                                                      inputClass =
                                                                                                        defaultInputClass;
                                                                                                      labelSizeClass =
                                                                                                        defaultLabelSizeClass;
                                                                                                    }
                                                                                                    break;
                                                                                                }
                                                                                                return (
                                                                                                  <label
                                                                                                    key={
                                                                                                      `${key}[${i}].${subKey}[${j}].${subsubKey as keyof tSkillEffectYiled}` +
                                                                                                      option
                                                                                                    }
                                                                                                    className={`flex ${labelSizeClass} cursor-pointer items-center justify-between gap-1 rounded-full p-2 px-4 hover:border-transition-color-20 lg:basis-auto lg:flex-row-reverse lg:justify-end lg:gap-2 lg:rounded-sm lg:hover:opacity-100 ${subsubField.getValue() === option ? "opacity-100" : "opacity-20"} ${skillFormState === "DISPLAY" ? " pointer-events-none border-transparent bg-transparent" : " pointer-events-auto border-transition-color-8 bg-transition-color-8"}`}
                                                                                                  >
                                                                                                    {
                                                                                                      dictionary.db
                                                                                                        .enums[
                                                                                                        (subsubKey
                                                                                                          .charAt(0)
                                                                                                          .toLocaleUpperCase() +
                                                                                                          subsubKey.slice(
                                                                                                            1,
                                                                                                          )) as keyof typeof $Enums
                                                                                                      ][
                                                                                                        option as keyof (typeof $Enums)[keyof typeof $Enums]
                                                                                                      ]
                                                                                                    }
                                                                                                    <input
                                                                                                      disabled={
                                                                                                        skillFormState ===
                                                                                                        "DISPLAY"
                                                                                                      }
                                                                                                      id={
                                                                                                        subsubField.name +
                                                                                                        option
                                                                                                      }
                                                                                                      name={
                                                                                                        subsubField.name
                                                                                                      }
                                                                                                      value={
                                                                                                        typeof option ===
                                                                                                        "string"
                                                                                                          ? option
                                                                                                          : ""
                                                                                                      }
                                                                                                      checked={
                                                                                                        subsubField.getValue() ===
                                                                                                        option
                                                                                                      }
                                                                                                      type="radio"
                                                                                                      onBlur={
                                                                                                        subsubField.handleBlur
                                                                                                      }
                                                                                                      onChange={(e) =>
                                                                                                        subsubField.handleChange(
                                                                                                          e.target
                                                                                                            .value,
                                                                                                        )
                                                                                                      }
                                                                                                      className={
                                                                                                        inputClass
                                                                                                      }
                                                                                                    />
                                                                                                    {icon}
                                                                                                  </label>
                                                                                                );
                                                                                              },
                                                                                            )}
                                                                                        </div>
                                                                                      </fieldset>
                                                                                    )}
                                                                                  </form.Field>
                                                                                );
                                                                              }
                                                                              case ZodFirstPartyTypeKind.ZodArray: {
                                                                                return (
                                                                                  <div
                                                                                    key={`${subKey}[${i}].${subsubKey}`}
                                                                                  >
                                                                                    Yield内数组
                                                                                  </div>
                                                                                );
                                                                              }
                                                                              default: {
                                                                                return (
                                                                                  <form.Field
                                                                                    key={`${key}[${i}].${subKey}[${j}].${subsubKey}`}
                                                                                    name={`${key}[${i}].${subKey}[${j}].${subsubKey as keyof tSkillEffectYiled}`}
                                                                                    validators={{
                                                                                      onChangeAsyncDebounceMs: 500,
                                                                                      onChangeAsync:
                                                                                        SkillYieldSchema.shape[
                                                                                          subsubKey as keyof tSkillEffectYiled
                                                                                        ],
                                                                                    }}
                                                                                  >
                                                                                    {(subsubField) => {
                                                                                      return (
                                                                                        <label
                                                                                          htmlFor={`${key}[${i}].${subKey}[${j}].${subsubKey}`}
                                                                                          key={`${key}[${i}].${subKey}[${j}].${subsubKey}`}
                                                                                          className="flex w-full flex-col gap-1 p-2 lg:max-w-[50%]"
                                                                                        >
                                                                                          <span>
                                                                                            {
                                                                                              dictionary.db.models
                                                                                                .skillYield[
                                                                                                subsubKey as keyof tSkillEffectYiled
                                                                                              ]
                                                                                            }
                                                                                            <FieldInfo
                                                                                              field={subsubField}
                                                                                            />
                                                                                          </span>
                                                                                          <input
                                                                                            autoComplete="off"
                                                                                            disabled={
                                                                                              skillFormState ===
                                                                                              "DISPLAY"
                                                                                            }
                                                                                            id={subsubField.name}
                                                                                            name={subsubField.name}
                                                                                            value={
                                                                                              subsubField.state.value ??
                                                                                              ""
                                                                                            }
                                                                                            type={inputType}
                                                                                            onBlur={
                                                                                              subsubField.handleBlur
                                                                                            }
                                                                                            onChange={(e) =>
                                                                                              subsubField.handleChange(
                                                                                                e.target.value,
                                                                                              )
                                                                                            }
                                                                                            className={`mt-1 w-full flex-1 rounded px-4 py-2 ${skillFormState === "DISPLAY" ? " pointer-events-none bg-transparent outline-transition-color-20" : " pointer-events-auto bg-transition-color-8"}`}
                                                                                          />
                                                                                        </label>
                                                                                      );
                                                                                    }}
                                                                                  </form.Field>
                                                                                );
                                                                              }
                                                                            }
                                                                          },
                                                                        )}
                                                                    </div>
                                                                  </fieldset>
                                                                ) : null;

                                                              default:
                                                                break;
                                                            }
                                                          })}

                                                        <Button
                                                          type="button"
                                                          level="tertiary"
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            console.log(subField.state.value);
                                                            subField.pushValue(
                                                              subKey === "skillCost"
                                                                ? defaultSkillEffectCost
                                                                : defaultSkillEffectYield,
                                                            );
                                                            console.log(subField.state.value);
                                                          }}
                                                          className={`${skillFormState === "DISPLAY" && "hidden"}  ${subKey === "skillCost" ? " lg:basis-[calc(25%-0.25rem)]" : "lg:basis-[calc(50%-0.25rem)]"} flex flex-none basis-full flex-col overflow-hidden p-1 outline-transition-color-20`}
                                                        >
                                                          Add [{" "}
                                                          {
                                                            dictionary.db.models.skillEffect[
                                                              subKey as keyof tSkillEffect
                                                            ]
                                                          }{" "}
                                                          ]
                                                        </Button>
                                                      </div>
                                                    </fieldset>
                                                  )}
                                                </form.Field>
                                              );
                                            }
                                            default: {
                                              return (
                                                <form.Field
                                                  key={`${key}[${i}].${subKey}`}
                                                  name={`${key}[${i}].${subKey as keyof SkillEffect}`}
                                                  validators={{
                                                    onChangeAsyncDebounceMs: 500,
                                                    onChangeAsync:
                                                      SkillEffectInputSchema.shape[subKey as keyof SkillEffect],
                                                  }}
                                                >
                                                  {(subField) => {
                                                    return (
                                                      <label
                                                        htmlFor={`${key}[${i}].${subKey}`}
                                                        key={`${key}[${i}].${subKey}`}
                                                        className="flex w-full flex-col gap-1 p-2 lg:max-w-[25%]"
                                                      >
                                                        <span>
                                                          {
                                                            dictionary.db.models.skillEffect[
                                                              subKey as keyof SkillEffect
                                                            ]
                                                          }
                                                          <FieldInfo field={subField} />
                                                        </span>
                                                        <input
                                                          autoComplete="off"
                                                          disabled={skillFormState === "DISPLAY"}
                                                          id={subField.name}
                                                          name={subField.name}
                                                          value={(subField.state.value as string) ?? ""}
                                                          type={inputType}
                                                          onBlur={subField.handleBlur}
                                                          onChange={(e) => subField.handleChange(e.target.value)}
                                                          className={`mt-1 w-full flex-1 rounded px-4 py-2 ${skillFormState === "DISPLAY" ? " pointer-events-none bg-transparent outline-transition-color-20" : " pointer-events-auto bg-transition-color-8"}`}
                                                        />
                                                      </label>
                                                    );
                                                  }}
                                                </form.Field>
                                              );
                                            }
                                          }
                                        })}
                                      </div>
                                    </fieldset>
                                  ) : null;

                                default:
                                  break;
                              }
                            })}
                        </div>
                        <Button
                          type="button"
                          level="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log(field.state.value);
                            field.pushValue(defaultSkillEffect);
                            console.log(field.state.value);
                          }}
                          className={`${skillFormState === "DISPLAY" && "hidden"}`}
                        >
                          Add [ {dictionary.db.models.skill[key as keyof Skill]} ]
                        </Button>
                      </fieldset>
                    )}
                  </form.Field>
                );
              }

              default: {
                return (
                  <form.Field
                    key={key}
                    name={key as keyof Skill}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: SkillInputSchema.shape[key as keyof Skill],
                    }}
                  >
                    {(field) => {
                      const defaultFieldsetClass = "flex basis-1/2 flex-col gap-1 p-2 lg:basis-1/4";
                      const defaultInputBox = (
                        <input
                          autoComplete="off"
                          disabled={skillFormState === "DISPLAY"}
                          id={field.name}
                          name={field.name}
                          value={typeof field.state.value !== "object" ? field.state.value : undefined}
                          type={inputType}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(inputType === "number" ? parseFloat(e.target.value) : e.target.value)
                          }
                          className={`mt-1 w-full flex-1 rounded px-4 py-2 ${skillFormState === "DISPLAY" ? " pointer-events-none bg-transparent outline-transition-color-20" : " pointer-events-auto bg-transition-color-8"}`}
                        />
                      );
                      let fieldsetClass: string = defaultFieldsetClass;
                      let inputBox: React.ReactNode = defaultInputBox;
                      switch (key as keyof Skill) {
                        // case "skillEffect":
                        // case "id":
                        // case "state":
                        // case "skillTreeName":
                        case "name":
                          {
                            fieldsetClass = "flex basis-full flex-col gap-1 p-2 lg:basis-1/4";
                          }
                          break;
                        // case "level":
                        // case "weaponElementDependencyType":
                        // case "element":
                        // case "skillType":
                        // case "createdByUserId":
                        // case "updatedByUserId":
                        // case "viewCount":
                        // case "usageCount":
                        // case "createdAt":
                        // case "updatedAt":
                        // case "usageTimestamps":
                        // case "viewTimestamps":

                        case "skillDescription":
                          {
                            inputBox = (
                              <>
                                <input id={field.name} name={field.name} className="hidden" />
                                <MDXEditor
                                  ref={mdxEditorRef}
                                  contentEditableClassName="prose"
                                  markdown={skill.skillDescription ?? ""}
                                  onBlur={field.handleBlur}
                                  onChange={(markdown) => field.handleChange(markdown)}
                                  plugins={[
                                    headingsPlugin(),
                                    listsPlugin(),
                                    quotePlugin(),
                                    thematicBreakPlugin(),
                                    // linkDialogPlugin(),
                                    diffSourcePlugin(),
                                    // imagePlugin(),
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
                                  className={`mt-1 w-full flex-1 rounded outline-transition-color-20 ${skillFormState === "DISPLAY" ? "display pointer-events-none" : " pointer-events-auto"} ${theme.theme === "dark" && "dark-theme dark-editor"}`}
                                />
                              </>
                            );
                            fieldsetClass = "flex basis-full flex-col gap-1 p-2";
                          }
                          break;

                        default:
                          break;
                      }
                      return (
                        <fieldset key={key} className={fieldsetClass}>
                          <label htmlFor={field.name} className="flex w-full flex-col gap-1">
                            <span>
                              {dictionary.db.models.skill[key as keyof Skill]}
                              <FieldInfo field={field} />
                            </span>
                            {inputBox}
                          </label>
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
            onClick={() => {
              setSkillFormState("DISPLAY");
              setSkillDialogState(!skillDialogState);
            }}
          >
            {dictionary.ui.skill.close} [Esc]
          </Button>
          {skillFormState == "DISPLAY" && session?.user && (
            <Button onClick={() => setSkillFormState("UPDATE")}>{dictionary.ui.skill.modify} [Enter]</Button>
          )}
          {skillFormState !== "DISPLAY" && (
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit]) => (
                <Button
                  type="submit"
                  level="primary"
                  disabled={!(canSubmit && !dataUploadingState)}
                  onClick={() => {
                    console.log(form.state.values);
                  }}
                >
                  {dataUploadingState ? dictionary.ui.skill.upload + "..." : dictionary.ui.skill.upload + " [Enter]"}
                </Button>
              )}
            </form.Subscribe>
          )}
        </div>
      </div>
    </form>
  );
}
