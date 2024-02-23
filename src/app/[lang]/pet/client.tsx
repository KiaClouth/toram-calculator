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
    <React.Fragment>
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
    </React.Fragment>
  );
}
