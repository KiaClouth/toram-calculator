"use client";
import React from "react";
import { type FieldApi, useForm } from "@tanstack/react-form";
import { type getDictionary } from "~/app/get-dictionary";
import { type $Enums } from "@prisma/client";
import { type Session } from "next-auth";
import { type Monster, MonsterSchema } from "prisma/generated/zod";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";

export default function PetPageClient(props: {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
}) {
  // 怪物数据的初始值
  const defaultMonster: Monster = {
    id: "",
    updatedAt: new Date(),
    updatedById: "",
    state: "PRIVATE",
    name: "",
    type: "COMMON_BOSS",
    baseLv: 0,
    experience: 0,
    address: "",
    element: "NO_ELEMENT",
    radius: 1,
    maxhp: 0,
    physicalDefense: 0,
    physicalResistance: 0,
    magicalDefense: 0,
    magicalResistance: 0,
    criticalResistance: 0,
    avoidance: 0,
    dodge: 0,
    block: 0,
    normalAttackResistanceModifier: 0,
    physicalAttackResistanceModifier: 0,
    magicalAttackResistanceModifier: 0,
    difficultyOfTank: 0,
    difficultyOfMelee: 0,
    difficultyOfRanged: 0,
    possibilityOfRunningAround: 0,
    specialBehavior: "",
    createdByUserId: "",
  };

  MonsterSchema.parse(defaultMonster)
  const { dictionary, session } = props;
  function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
    return (
      <>
        {field.state.meta.touchedErrors ? (
          <em>{field.state.meta.touchedErrors}</em>
        ) : null}
        {field.state.meta.isValidating ? "Validating..." : null}
      </>
    );
  }
  const form = useForm({
    defaultValues: defaultMonster,
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value);
    },
    // Add a validator to support Zod usage in Form and Field
    validatorAdapter: zodValidator,
  });

  return (
    <div>
      <h1>Zod Form Example</h1>
      <form.Provider>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <div>
            {/* A type-safe field component*/}
            <form.Field
              name="state"
              validators={{
                onChange: MonsterSchema,
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: z.string().refine(
                  async (value) => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    return !value.includes("error");
                  },
                  {
                    message: "No 'error' allowed in first name",
                  },
                ),
              }}
            >
              {(field) => {
                // Avoid hasty abstractions. Render props are great!
                return (
                  <>
                    <label htmlFor={field.name}>First Name:</label>
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(
                          e.target.value as keyof typeof $Enums.State,
                        )
                      }
                    />
                    <FieldInfo field={field} />
                  </>
                );
              }}
            </form.Field>
          </div>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <button type="submit" disabled={!canSubmit}>
                {isSubmitting ? "..." : "Submit"}
              </button>
            )}
          </form.Subscribe>
        </form>
      </form.Provider>
    </div>
  );
}
