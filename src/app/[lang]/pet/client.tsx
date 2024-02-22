"use client";
import React from "react";
import { useForm } from "@tanstack/react-form";
import { type getDictionary } from "get-dictionary";
import { type Monster } from "@prisma/client";
import { type Session } from "next-auth";
import { useState } from "react";

export default function PetPageClient(props: {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
}) {
  // 怪物数据的初始值
  const { dictionary, session } = props;
  const form = useForm({
    defaultValues: {
      fullName: "",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value);
    },
  });
  return (
    <main className="Main flex flex-1">
      {/* <div className="Module1 hidden max-w-60 flex-shrink flex-col bg-bg-grey-20 "></div> */}
      <div className="Module2 flex flex-1">
        <div className="LeftArea flex-1"></div>
        <div className="ModuleContent flex h-dvh max-w-[100dvw] flex-1 basis-full flex-col-reverse lg:flex-col 2xl:max-w-[1536px] 2xl:basis-[1536px]">
          <form.Provider>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void form.handleSubmit();
              }}
            >
              <div>
                <form.Field name="fullName">
                  {(field) => (
                    <input
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                </form.Field>
              </div>
              <button type="submit">Submit</button>
            </form>
          </form.Provider>
        </div>
        <div className="RightArea flex-1"></div>
      </div>
    </main>
  );
}
