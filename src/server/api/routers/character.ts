import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { z } from "zod";
import { CharacterInclude, CharacterInputSchema } from "~/schema/character";
import { ComboInclude, ComboInputSchema } from "~/schema/combo";
import { ModifiersListInputSchema } from "~/schema/modifiersList";
import { PetInputSchema } from "~/schema/pet";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { findOrCreateUserCreateData, findOrCreateUserUpateData } from "./untils";

const prisma = new PrismaClient();
export const characterRouter = createTRPCRouter({
  getPrivate: protectedProcedure.query(({ ctx }) => {
    console.log(
      new Date().toLocaleDateString() +
        "--" +
        new Date().toLocaleTimeString() +
        "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "请求了由他自己创建的技能列表",
    );
    return ctx.db.character.findMany({
      where: {
        createdByUserId: ctx.session?.user.id,
      },
      relationLoadStrategy: "join", // or 'query'
      include: CharacterInclude.include,
    });
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    console.log(
      new Date().toLocaleDateString() +
        "--" +
        new Date().toLocaleTimeString() +
        "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "请求了他可见的技能列表",
    );
    if (ctx.session?.user.id) {
      return ctx.db.character.findMany({
        relationLoadStrategy: "join", // or 'query'
        include: CharacterInclude.include,
      });
    }
    return ctx.db.character.findMany({
      relationLoadStrategy: "join", // or 'query'
      include: CharacterInclude.include,
    });
  }),

  create: protectedProcedure
    .input(
      CharacterInputSchema.omit({ id: true }).extend({
        combos: z.array(ComboInputSchema.omit({ id: true })),
        pet: PetInputSchema.omit({ id: true }),
        modifiersList: ModifiersListInputSchema.omit({ id: true }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 检查或创建 UserCreate
      const userCreate = (await findOrCreateUserCreateData(ctx.session?.user.id, ctx));

      // 输入内容拆分成4个表的数据
      const { combos: combosInputArray, statistics: statisticsInput, ...characterInput } = input;

      return prisma.$transaction(async () => {
        const characterId = randomUUID();
        const character = await ctx.db.character.create({
          data: {
            ...characterInput,
            id: characterId,
            mainWeapon: undefined,
            subWeapon: undefined,
            bodyArmor: undefined,
            additionalEquipment: undefined,
            specialEquipment: undefined,
            fashion: undefined,
            cuisine: undefined,
            consumableList: undefined,
            skillList: undefined,
            pet: undefined,
            modifiersList: undefined,
            combos: undefined,
            createdByUserId: userCreate.userId,
          },
          include: CharacterInclude.include,
        });

        const combos = combosInputArray.map(async (combosInput) => {
          return await ctx.db.combo.create({
            data: {
              ...combosInput,
              comboStep: {
                createMany: {
                  data: combosInput.comboStep,
                },
              },
            },
            include: ComboInclude.include,
          });
        });

        console.log(
          new Date().toLocaleDateString() +
            "--" +
            new Date().toLocaleTimeString() +
            "--" +
            (ctx.session?.user.name ?? ctx.session?.user.email) +
            "上传了Character: " +
            input.name,
        );

        return {
          ...character,
          combos: await Promise.all(combos),
        };
      });
    }),

  update: protectedProcedure.input(CharacterInputSchema).mutation(async ({ ctx, input }) => {
    // 检查用户权限
    // if (ctx.session.user.role !== "ADMIN") {
    //   console.log(
    //     (ctx.session?.user.name ?? ctx.session?.user.email) +
    //       "没有权限更新技能",
    //   );
    //   return;
    // }

    // 检查或创建 UserUpdate
    await findOrCreateUserUpateData(ctx.session?.user.id, ctx);

    // 输入内容拆分成4个表的数据
    const { combos: combosInputArray, statistics: statisticsInput, ...characterInput } = input;

    return prisma.$transaction(async () => {
      const character = await ctx.db.character.update({
        where: { id: input.id },
        data: {
          ...characterInput,
          mainWeapon: undefined,
          subWeapon: undefined,
          bodyArmor: undefined,
          additionalEquipment: undefined,
          specialEquipment: undefined,
          fashion: undefined,
          cuisine: undefined,
          consumableList: undefined,
          skillList: undefined,
          pet: undefined,
          modifiersList: undefined,
          combos: undefined,
        },
        include: CharacterInclude.include,
      });

      const combo = combosInputArray.map(async (effect) => {
        const { comboStep: comboStepInputArray, ...comboInput } = effect;
        const combo = await ctx.db.combo.update({
          where: { id: comboInput.id },
          data: {
            ...comboInput,
          },
          include: ComboInclude.include,
        });
        const comboStep = comboStepInputArray.map(async (comboStepInput) => {
          return await ctx.db.comboStep.update({
            where: { id: comboStepInput.id },
            data: {
              ...comboStepInput,
            },
          });
        });
        return { ...combo, comboStep: await Promise.all(comboStep) };
      });

      console.log(
        new Date().toLocaleDateString() +
          "--" +
          new Date().toLocaleTimeString() +
          "--" +
          (ctx.session?.user.name ?? ctx.session?.user.email) +
          "更新了Character: " +
          input.name,
      );

      return {
        ...character,
        combo: await Promise.all(combo),
      };
    });
  }),
});
