"use client";
import React, { useEffect } from "react";
import "@mdxeditor/editor/style.css";
import { tApi } from "~/trpc/react";
import type { getDictionary } from "~/app/get-dictionary";
import Button from "../../_components/button";
import { type FieldApi, useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { ZodFirstPartyTypeKind, type z } from "zod";
import { type $Enums } from "@prisma/client";
import { useStore } from "~/app/store";
import { type Session } from "next-auth";
import LineWrappingInput from "../../_components/autoLineWrappingInput";
import { Crystal, CrystalInputSchema, defaultCrystal } from "~/schema/crystal";
import { defaultStatistics } from "~/schema/statistics";

export default function CrystalForm(props: {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
  defaultCrystalList: Crystal[];
  setDefaultCrystalList: (list: Crystal[]) => void;
}) {
  const { dictionary, session, defaultCrystalList, setDefaultCrystalList } = props;
  // 状态管理参数
  const { crystalDialogState, setCrystalList, setCrystalDialogState, crystalFormState, setCrystalFormState } = useStore(
    (state) => state.crystalPage,
  );
  const { crystal } = useStore((state) => state);
  let newCrystal: Crystal;
  const formTitle = {
    CREATE: dictionary.ui.upload,
    UPDATE: dictionary.ui.modify,
    DISPLAY: crystal.name,
  }[crystalFormState];
  const [dataUploadingState, setDataUploadingState] = React.useState(false);

  function FieldInfo({
    field,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: FieldApi<Crystal, keyof Crystal, any, any>;
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
  const crystalHiddenData: Array<keyof Crystal> = [
    "id",
    "createdAt",
    "updatedAt",
    "createdByUserId",
    "updatedByUserId",
  ];
  // 定义表单
  const form = useForm({
    defaultValues: {
      CREATE: defaultCrystal,
      UPDATE: crystal,
      DISPLAY: crystal,
    }[crystalFormState],
    onSubmit: async ({ value }) => {
      setDataUploadingState(true);
      newCrystal = {
        ...defaultCrystal,
        ...value,
        statistics: defaultStatistics
      } satisfies Crystal;
      switch (crystalFormState) {
        case "CREATE":
          createCrystal.mutate(newCrystal);
          break;

        case "UPDATE":
          updateCrystal.mutate(newCrystal);
          break;

        default:
          break;
      }
      setCrystalDialogState(false);
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
  // modifiersList, fashion, cuisine, baseAbi
  const createCrystal = tApi.crystal.create.useMutation({
    onSuccess(data) {
      const newList = [...defaultCrystalList, data];
      // 创建成功后更新数据
      setDefaultCrystalList(newList);
      setCrystalList(newList);
      // 上传成功后表单转换为展示状态
      setDataUploadingState(false);
      setCrystalFormState("DISPLAY");
    },
  });

  const updateCrystal = tApi.crystal.update.useMutation({
    onSuccess(data) {
      const newList = defaultCrystalList.map((crystal) => {
        if (crystal.id === data.id) {
          return data;
        }
        return crystal;
      });
      // 更新成功后更新数据
      setDefaultCrystalList(newList);
      setCrystalList(newList);
      // 上传成功后表单转换为展示状态
      setDataUploadingState(false);
      setCrystalFormState("DISPLAY");
    },
  });

  useEffect(() => {
    console.log("---CrystalForm render");
    console.log(crystal);
    // escape键监听
    const handleEscapeKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCrystalDialogState(!crystalDialogState);
      }
    };

    // 监听绑带与清除
    document.addEventListener("keydown", handleEscapeKeyPress);

    return () => {
      console.log("---CrystalForm unmount");
      document.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, [form, crystal, crystalDialogState, crystalFormState, setCrystalDialogState]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className={`CreateCrystalFrom flex w-full flex-col gap-4 overflow-y-auto rounded px-3`}
    >
      <div className="title flex items-center gap-6 pt-4">
        <div className="h-[2px] flex-1 bg-accent-color"></div>
        <span className="text-lg font-bold lg:text-2xl">{formTitle}</span>
        <div className="h-[2px] flex-1 bg-accent-color"></div>
      </div>
      <div className="inputArea flex-1 overflow-y-auto">
        {crystalFormState !== "DISPLAY" && (
          <div className="mb-4 rounded-sm bg-transition-color-8 p-4">{typeof dictionary.ui.crystal.discription}</div>
        )}
        <fieldset className="dataKinds flex flex-row flex-wrap gap-y-[4px]">
          {/* <FormFragment
            form={form}
            data={defaultCrystal}
            dictionary={dictionary}
            dictionaryFragment={dictionary.db.models.crystal}
            hiddenDataList={crystalHiddenData}
            formFragmentState={crystalFormState === "DISPLAY"}
            schema={CrystalInputSchema}
          /> */}
          {Object.entries(crystal).map(([key, _value]) => {
            // 遍历角色模型
            // 过滤掉隐藏的数据
            if (crystalHiddenData.includes(key as keyof Crystal)) return undefined;
            // 输入框的类型计算
            const zodValue = CrystalInputSchema.shape[key as keyof Crystal];
            const valueType = getZodType(zodValue);
            const { ZodNumber, ZodString, ...Others } = ZodFirstPartyTypeKind;
            const inputType = {
              [ZodNumber]: "number",
              [ZodString]: "text",
              ...Others,
            }[valueType];
            // 由于数组类型的值与常规变量值存在结构差异，因此在此进行区分
            switch (valueType) {
              case ZodFirstPartyTypeKind.ZodEnum: {
                return (
                  <form.Field
                    key={key}
                    name={key as keyof Crystal}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: CrystalInputSchema.shape[key as keyof Crystal],
                    }}
                  >
                    {(field) => {
                      const defaultFieldsetClass = "flex basis-full flex-col gap-1 p-2";
                      let fieldsetClass: string = defaultFieldsetClass;
                      switch (key as keyof Crystal) {
                        // case "rates":
                        // case "id":
                        case "crystalType":
                        default:
                          break;
                      }
                      return (
                        <fieldset key={key} className={fieldsetClass}>
                          <span>
                            {dictionary.db.models.crystal[key as keyof Crystal] as string}
                            <FieldInfo field={field} />
                          </span>
                          <div
                            className={`inputContianer mt-1 flex flex-wrap self-start rounded lg:gap-2 ${crystalFormState === "DISPLAY" ? " outline-transition-color-20" : ""}`}
                          >
                            {"options" in zodValue &&
                              zodValue.options.map((option) => {
                                const defaultInputClass = "mt-0.5 rounded px-4 py-2";
                                const defaultLabelSizeClass = "";
                                let inputClass = defaultInputClass;
                                let labelSizeClass = defaultLabelSizeClass;
                                let icon: React.ReactNode = null;
                                switch (option) {
                                  default:
                                    inputClass = defaultInputClass;
                                    labelSizeClass = defaultLabelSizeClass;
                                    icon = null;
                                    break;
                                }
                                return (
                                  <label
                                    key={key + option}
                                    className={`flex ${labelSizeClass} cursor-pointer items-center justify-between gap-1 rounded-full p-2 px-4 hover:border-transition-color-20 lg:basis-auto lg:flex-row-reverse lg:justify-end lg:gap-2 lg:rounded-sm lg:hover:opacity-100 ${field.getValue() === option ? "opacity-100" : "opacity-20"} ${crystalFormState === "DISPLAY" ? " pointer-events-none border-transparent bg-transparent" : " pointer-events-auto border-transition-color-8 bg-transition-color-8"}`}
                                  >
                                    {
                                      dictionary.db.enums[
                                        (key.charAt(0).toLocaleUpperCase() + key.slice(1)) as keyof typeof $Enums
                                      ][option as keyof (typeof $Enums)[keyof typeof $Enums]]
                                    }
                                    <input
                                      disabled={crystalFormState === "DISPLAY"}
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
                      );
                    }}
                  </form.Field>
                );
              }

              case ZodFirstPartyTypeKind.ZodArray: {
                return null;
                // <fieldset>
                //   {_value && Array.isArray(_value) && _value.map((subObj, index) => {
                //     return JSON.stringify(subObj, null, 2) + index;
                //   })}
                // </fieldset>
              }
              case ZodFirstPartyTypeKind.ZodObject: {
                return null;
                // <fieldset>
                //   {Object.entries(_value as object).map(([subkey, subvalue]) => {
                //     return null;
                //   })}
                // </fieldset>
              }

              default: {
                return (
                  <form.Field
                    key={key}
                    name={key as keyof Crystal}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: CrystalInputSchema.shape[key as keyof Crystal],
                    }}
                  >
                    {(field) => {
                      const defaultFieldsetClass = "flex basis-1/2 flex-col gap-1 p-2 lg:basis-1/4";
                      const defaultInputBox = (
                        <input
                          autoComplete="off"
                          disabled={crystalFormState === "DISPLAY"}
                          id={field.name}
                          name={field.name}
                          value={typeof field.state.value !== "object" ? field.state.value : undefined}
                          type={inputType}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(inputType === "number" ? parseFloat(e.target.value) : e.target.value)
                          }
                          className={`mt-1 w-full flex-1 rounded px-4 py-2 ${crystalFormState === "DISPLAY" ? " pointer-events-none bg-transparent outline-transition-color-20" : " pointer-events-auto bg-transition-color-8"}`}
                        />
                      );
                      let fieldsetClass: string = defaultFieldsetClass;
                      let inputBox: React.ReactNode = defaultInputBox;
                      switch (key as keyof Crystal) {
                        // case "id":
                        // case "state":
                        case "name":
                          {
                            fieldsetClass = "flex basis-full flex-col gap-1 p-2 lg:basis-1/4";
                          }
                          break;
                        default:
                          fieldsetClass = defaultFieldsetClass;
                          inputBox = defaultInputBox;
                          break;
                      }
                      return (
                        <fieldset className={fieldsetClass}>
                          <label htmlFor={field.name} className="flex w-full flex-col gap-1">
                            <span>
                              {dictionary.db.models.crystal[key as keyof Crystal] as string}
                              <FieldInfo field={field} />
                            </span>
                            {inputType === "number" ? (
                              inputBox
                            ) : (
                              <LineWrappingInput
                                value={field.state.value as string}
                                id={field.name}
                                name={field.name}
                                type={inputType}
                                onBlur={field.handleBlur}
                                readOnly={crystalFormState === "DISPLAY"}
                                onChange={(e) => {
                                  const target = e.target as HTMLTextAreaElement;
                                  field.handleChange(inputType === "number" ? parseFloat(target.value) : target.value);
                                }}
                                className=""
                              />
                            )}
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
              setCrystalFormState("DISPLAY");
              setCrystalDialogState(!crystalDialogState);
            }}
          >
            {dictionary.ui.close} [Esc]
          </Button>
          {crystalFormState == "DISPLAY" && session?.user.id === crystal.createdByUserId && (
            <Button
              onClick={() => {
                setCrystalFormState("UPDATE");
              }}
            >
              {dictionary.ui.modify} [Enter]
            </Button>
          )}
          {crystalFormState !== "DISPLAY" && (
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit]) => (
                <Button type="submit" level="primary" disabled={!(canSubmit && !dataUploadingState)}>
                  {dataUploadingState ? dictionary.ui.upload + "..." : dictionary.ui.upload + " [Enter]"}
                </Button>
              )}
            </form.Subscribe>
          )}
        </div>
      </div>
      {JSON.stringify(form.state.values, null, 2)}
    </form>
  );
}
