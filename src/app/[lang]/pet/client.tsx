"use client";
import React from "react";
import { useForm } from "@tanstack/react-form";
import { type getDictionary } from "~/app/get-dictionary";
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
      age: 0,
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
            <form.Field
              name="age"
              validators={{
                onBlur: ({ value }) =>
                  value < 13 ? "You must be 13 to make an account" : undefined,
              }}
            >
              {(field) => (
                <>
                  <label htmlFor={field.name}>Age:</label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    type="number"
                    // Listen to the onBlur event on the field
                    onBlur={field.handleBlur}
                    // We always need to implement onChange, so that TanStack Form receives the changes
                    onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                  />
                  {field.state.meta.errors ? (
                    <em role="alert">{field.state.meta.errors.join(", ")}</em>
                  ) : null}
                </>
              )}
            </form.Field>
          </div>
          <button type="submit">Submit</button>
        </form>
      </form.Provider>
    </React.Fragment>
  );
}
