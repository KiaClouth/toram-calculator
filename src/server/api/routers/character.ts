import { PrismaClient, type Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { z } from "zod";
import { CharacterInclude, CharacterInputSchema } from "~/schema/characterSchema";
import { ComboInputSchema } from "~/schema/combo";
import { ModifiersListInputSchema } from "~/schema/modifiersList";
import { PetInputSchema } from "~/schema/pet";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

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
      // 检查用户权限
      // if (ctx.session.user.role !== "ADMIN") {
      //   console.log(
      //     (ctx.session?.user.name ?? ctx.session?.user.email) +
      //       "没有权限上传技能",
      //   );
      //   return;
      // }

      // 检查用户是否存在关联的 UserCreate
      let userCreate = await ctx.db.userCreate.findUnique({
        where: { userId: ctx.session?.user.id },
      });

      // 如果不存在，创建一个新的 UserCreate
      if (!userCreate) {
        console.log(
          new Date().toLocaleDateString() +
            "--" +
            new Date().toLocaleTimeString() +
            "--" +
            (ctx.session?.user.name ?? ctx.session?.user.email) +
            "初次上传技能，自动创建对应userCreate",
        );
        userCreate = await ctx.db.userCreate.create({
          data: {
            userId: ctx.session?.user.id ?? "",
            // 其他 UserCreate 的属性，根据实际情况填写
          },
        });
      }

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
            include: {
              comboStep: true,
            },
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

    // 检查用户是否存在关联的 userUpdate
    let userUpdate = await ctx.db.userUpdate.findUnique({
      where: { userId: ctx.session?.user.id },
    });

    // 如果不存在，创建一个新的 userUpdate
    if (!userUpdate) {
      console.log(
        new Date().toLocaleDateString() +
          "--" +
          new Date().toLocaleTimeString() +
          "--" +
          (ctx.session?.user.name ?? ctx.session?.user.email) +
          "初次更新技能，自动创建对应userUpdate",
      );
      userUpdate = await ctx.db.userUpdate.create({
        data: {
          userId: ctx.session?.user.id ?? "",
          // 其他 userUpdate 的属性，根据实际情况填写
        },
      });
    }

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
          include: {
            comboStep: true,
          },
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
