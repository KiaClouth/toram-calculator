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
import { defaultCharacter, useStore } from "~/app/store";
import { type Session } from "next-auth";
import { type Character } from "~/server/api/routers/character";
import { CharacterInputSchema } from "~/schema/characterSchema";

export default function CharacterForm(props: {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
  defaultCharacterList: Character[];
  setDefaultCharacterList: (list: Character[]) => void;
}) {
  const { dictionary, session, defaultCharacterList, setDefaultCharacterList } = props;
  // 状态管理参数
  const {
    characterDialogState,
    setCharacterList,
    setCharacterDialogState,
    characterFormState,
    setCharacterFormState,
  } = useStore((state) => state.characterPage);
  const { character } = useStore((state) => state);
  let newCharacter: Character;
  const formTitle = {
    CREATE: dictionary.ui.upload,
    UPDATE: dictionary.ui.modify,
    DISPLAY: character.name,
  }[characterFormState];
  const [dataUploadingState, setDataUploadingState] = React.useState(false);

  function FieldInfo({
    field,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: FieldApi<Character, keyof Character, any, any>;
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
  const characterHiddenData: Array<keyof Character> = [
    "id",
    "createdAt",
    "updatedAt",
    "viewCount",
    "usageCount",
    "createdByUserId",
    "viewTimestamps",
    "usageTimestamps",
  ];
  // 定义表单
  const form = useForm({
    defaultValues: {
      CREATE: defaultCharacter,
      UPDATE: character,
      DISPLAY: character,
    }[characterFormState],
    onSubmit: async ({ value }) => {
      setDataUploadingState(true);
      newCharacter = {
        ...defaultCharacter,
        ...value,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
        viewCount: 0,
        usageTimestamps: [],
        viewTimestamps: [],
      } satisfies Character;
      switch (characterFormState) {
        case "CREATE":
          createCharacter.mutate(newCharacter);
          break;

        case "UPDATE":
          updateCharacter.mutate(newCharacter);
          break;

        default:
          break;
      }
      setCharacterDialogState(false);
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
  const createCharacter = tApi.character.create.useMutation({
    onSuccess(data) {
      const newList = [...defaultCharacterList, data];
      // 创建成功后更新数据
      setDefaultCharacterList(newList);
      setCharacterList(newList);
      // 上传成功后表单转换为展示状态
      setDataUploadingState(false);
      setCharacterFormState("DISPLAY");
    },
  });

  const updateCharacter = tApi.character.update.useMutation({
    onSuccess(data) {
      const newList = defaultCharacterList.map((character) => {
        if (character.id === data.id) {
          return data;
        }
        return character;
      });
      // 更新成功后更新数据
      setDefaultCharacterList(newList);
      setCharacterList(newList);
      // 上传成功后表单转换为展示状态
      setDataUploadingState(false);
      setCharacterFormState("DISPLAY");
    },
  });

  useEffect(() => {
    console.log("---CharacterForm render");
    console.log(character);
    // escape键监听
    const handleEscapeKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCharacterDialogState(!characterDialogState);
      }
    };

    // 监听绑带与清除
    document.addEventListener("keydown", handleEscapeKeyPress);

    return () => {
      console.log("---CharacterForm unmount");
      document.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, [form, character, characterDialogState, characterFormState, setCharacterDialogState]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className={`CreateCharacterFrom flex w-full flex-col gap-4 overflow-y-auto rounded px-3`}
    >
      <div className="title flex items-center gap-6 pt-4">
        <div className="h-[2px] flex-1 bg-accent-color"></div>
        <span className="text-lg font-bold lg:text-2xl">{formTitle}</span>
        <div className="h-[2px] flex-1 bg-accent-color"></div>
      </div>
      <div className="inputArea flex-1 overflow-y-auto">
        {characterFormState !== "DISPLAY" && (
          <div className="mb-4 rounded-sm bg-transition-color-8 p-4">
            {typeof dictionary.ui.character.discription}
          </div>
        )}
        <fieldset className="dataKinds flex flex-row flex-wrap gap-y-[4px]">
          {Object.entries(character).map(([key, _]) => {
            // 遍历角色模型
            // 过滤掉隐藏的数据
            if (characterHiddenData.includes(key as keyof Character)) return undefined;
            // 输入框的类型计算
            const zodValue = CharacterInputSchema.shape[key as keyof Character];
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
                    name={key as keyof Character}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: CharacterInputSchema.shape[key as keyof Character],
                    }}
                  >
                    {(field) => {
                      const defaultFieldsetClass = "flex basis-full flex-col gap-1 p-2";
                      let fieldsetClass: string = defaultFieldsetClass;
                      switch (key as keyof Character) {
                        // case "rates":
                        // case "id":
                        case "state": {
                          fieldsetClass = characterFormState === "DISPLAY" ? "hidden" : defaultFieldsetClass;
                        }
                        case "characterType":
                        default:
                          break;
                      }
                      return (
                        <fieldset key={key} className={fieldsetClass}>
                          <span>
                            {JSON.stringify(dictionary.db.models.character[key as keyof Character])}
                            <FieldInfo field={field} />
                          </span>
                          <div
                            className={`inputContianer mt-1 flex flex-wrap self-start rounded lg:gap-2 ${characterFormState === "DISPLAY" ? " outline-transition-color-20" : ""}`}
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
                                    className={`flex ${labelSizeClass} cursor-pointer items-center justify-between gap-1 rounded-full p-2 px-4 hover:border-transition-color-20 lg:basis-auto lg:flex-row-reverse lg:justify-end lg:gap-2 lg:rounded-sm lg:hover:opacity-100 ${field.getValue() === option ? "opacity-100" : "opacity-20"} ${characterFormState === "DISPLAY" ? " pointer-events-none border-transparent bg-transparent" : " pointer-events-auto border-transition-color-8 bg-transition-color-8"}`}
                                  >
                                    {
                                      dictionary.db.enums[
                                        (key.charAt(0).toLocaleUpperCase() + key.slice(1)) as keyof typeof $Enums
                                      ][option as keyof (typeof $Enums)[keyof typeof $Enums]]
                                    }
                                    <input
                                      disabled={characterFormState === "DISPLAY"}
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
                
                case ZodFirstPartyTypeKind.ZodObject: {
                return <div key={key}>{JSON.stringify(character[key as keyof Character])}</div>;
                }

              default: {
                return (
                  <form.Field
                    key={key}
                    name={key as keyof Character}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: CharacterInputSchema.shape[key as keyof Character],
                    }}
                  >
                    {(field) => {
                      const defaultFieldsetClass = "flex basis-1/2 flex-col gap-1 p-2 lg:basis-1/4";
                      const defaultInputBox = (
                        <input
                          autoComplete="off"
                          disabled={characterFormState === "DISPLAY"}
                          id={field.name}
                          name={field.name}
                          value={typeof field.state.value !== "object" ? field.state.value : undefined}
                          type={inputType}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(inputType === "number" ? parseFloat(e.target.value) : e.target.value)
                          }
                          className={`mt-1 w-full flex-1 rounded px-4 py-2 ${characterFormState === "DISPLAY" ? " pointer-events-none bg-transparent outline-transition-color-20" : " pointer-events-auto bg-transition-color-8"}`}
                        />
                      );
                      let fieldsetClass: string = defaultFieldsetClass;
                      let inputBox: React.ReactNode = defaultInputBox;
                      switch (key as keyof Character) {
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
                        <fieldset key={key} className={fieldsetClass}>
                          <label htmlFor={field.name} className="flex w-full flex-col gap-1">
                            <span>
                              {typeof dictionary.db.models.character[key as keyof Character]}
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
              setCharacterFormState("DISPLAY");
              setCharacterDialogState(!characterDialogState);
            }}
          >
            {dictionary.ui.close} [Esc]
          </Button>
          {characterFormState == "DISPLAY" && session?.user.id === character.createdByUserId && (
            <Button
              onClick={() => {
                setCharacterFormState("UPDATE");
              }}
            >
              {dictionary.ui.modify} [Enter]
            </Button>
          )}
          {characterFormState !== "DISPLAY" && (
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
    </form>
  );
}
