"use client";
import React, { useState } from "react";

import { api } from "~/trpc/react";
import type { getDictionary } from "~/app/get-dictionary";

import type { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { IconCloudUpload } from "../_components/iconsList";
import Button from "../_components/button";
import { MonsterSchema, type Monster } from "prisma/generated/zod";
import { type FieldApi, useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

export default function CreateMonster(props: {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
  defaultMonster: Monster;
}) {
  const router = useRouter();
  const { dictionary, session, defaultMonster } = props;
  const [open, setOpen] = useState("invisible");
  const [bottom, setBottom] = useState("translate-y-1/2");

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
  const form = useForm({
    defaultValues: defaultMonster,
    onSubmit: async ({ value }) => {
      createMonster.mutate(value);
    },
    validatorAdapter: zodValidator,
  });

  const createMonster = api.monster.create.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const toggleState = () => {
    if (open.includes("invisible")) {
      setOpen("opacity-1");
      setBottom("translate-y-0");
    } else {
      setOpen("invisible opacity-0");
      setBottom("translate-y-1/2");
    }
  };

  // function makeSchemaOptional<T extends z.ZodTypeAny>(schema: T) {
  //   return schema.optional();
  // }
  
  return (
    <React.Fragment>
      {session?.user ? (
        <Button
          onClick={toggleState}
          content={dictionary.ui.monster.upload}
          icon={<IconCloudUpload />}
        />
      ) : undefined}
      <div
        className={`FormBoxBg fixed left-0 top-0 z-10 flex h-dvh w-dvw flex-col bg-transition-color-20 backdrop-blur ${open}`}
      >
        <div
          onClick={toggleState}
          className="FormCloseBtn h-24 cursor-pointer"
        ></div>
        <div className="FormBoxContent flex h-[91dvh] flex-1 flex-col bg-primary-color lg:items-center">
          <form.Provider>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void form.handleSubmit();
              }}
              className={`CreateMonsterFrom flex max-w-7xl flex-col gap-4 overflow-y-auto rounded p-4 lg:w-4/5 ${bottom}`}
            >
              <div className="title flex justify-between border-b-1.5 border-brand-color-1st p-3 text-lg font-semibold">
                <span>{dictionary.ui.monster.upload}</span>
              </div>
              <div className="inputArea flex-1 overflow-y-auto">
                <fieldset className="dataKinds flex flex-wrap lg:flex-row">
                  {Object.entries(MonsterSchema.shape).map(([key, value]) => { 
                    return <form.Field
                    key={key}
                    name={key as keyof Monster}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync:
                        MonsterSchema.shape[key as keyof Monster],
                    }}
                  >
                    {(field) => (
                      <fieldset
                        key={key}
                        className="flex basis-1/2 flex-col gap-1 p-2 lg:basis-1/4"
                      >
                        <label
                          htmlFor={field.name}
                          className="flex basis-1/4 flex-col gap-1 p-2"
                        >
                          {
                            dictionary.db.models.monster[
                              key as keyof typeof defaultMonster
                            ]
                          }
                          <input
                            id={field.name}
                            name={field.name}
                            value={field.state.value ?? ""}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                              field.handleChange(e.target.value)
                            }
                            className=" mt-1 rounded bg-transition-color-8 px-4 py-2"
                          />
                        </label>
                        {"options" in value ? "是枚举" : value._def.typeName}
                        <FieldInfo field={field} />
                      </fieldset>
                    )}
                  </form.Field>
                  })}
                </fieldset>
              </div>
              <div className="functionArea flex justify-end border-t-1.5 border-brand-color-1st py-3">
                <div className="btnGroup flex gap-5">
                  <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                  >
                    {([canSubmit]) => (
                      <Button
                        type="submit"
                        content={
                          createMonster.isLoading
                            ? `${dictionary.ui.monster.upload}...`
                            : `${dictionary.ui.monster.upload}`
                        }
                        disabled={createMonster.isLoading || !canSubmit}
                      />
                    )}
                  </form.Subscribe>
                </div>
              </div>
            </form>
          </form.Provider>
        </div>
      </div>
    </React.Fragment>
  );
}
