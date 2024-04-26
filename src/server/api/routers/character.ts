import type { Prisma } from "@prisma/client";
import { CharacterSchema } from "prisma/generated/zod";
import { CharacterInputSchema } from "~/schema/characterSchema";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export type Fashion = Prisma.FashionGetPayload<{
  include: object
}>

export type Cuisine = Prisma.CuisineGetPayload<{
  include: object;  
}>

export type Character = Prisma.CharacterGetPayload<{
  include: {
    baseAbi: true;
    specialAbi: true;
    equipmentList: {
      include: {
        mainWeapon: {
          include: {
            crystal: true;
          };
        };
        subWeapon: true;
        bodyArmor: {
          include: {
            crystal: true;
          };
        };
        additionalEquipment: {
          include: {
            crystal: true;
          };
        };
        specialEquipment: {
          include: {
            crystal: true;
          };
        };
      };
    };
    fashion: true;
    cuisine: true;
    consumableList: {
      include: {
        consumables: true;
      };
    };
    skillList: {
      include: {
        skills: true;
      };
    };
    combos: true;
    pet: true;
    modifiersList: true;
  };
}>;



export const characterRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    console.log(
      new Date().toLocaleDateString() +
        "--" +
        new Date().toLocaleTimeString() +
        "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "请求了完整的技能列表",
    );
    return ctx.db.character.findMany({
      relationLoadStrategy: "join", // or 'query'
      include: {
        baseAbi: true,
        specialAbi: true,
        equipmentList: true,
        fashion: true,
        cuisine: true,
        consumableList: true,
        skillList: true,
        combos: true,
        pet: true,
        modifiersList: true,
        belongToAnalyzers: true,
      },
    });
  }),

  getPublicList: publicProcedure.query(({ ctx }) => {
    console.log(
      new Date().toLocaleDateString() +
        "--" +
        new Date().toLocaleTimeString() +
        "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "请求了公用的技能列表",
    );
    return ctx.db.character.findMany({
      where: { state: "PUBLIC" },
      relationLoadStrategy: "join", // or 'query'

      include: {
        baseAbi: true,
        specialAbi: true,
        equipmentList: true,
        fashion: true,
        cuisine: true,
        consumableList: true,
        skillList: true,
        combos: true,
        pet: true,
        modifiersList: true,
        belongToAnalyzers: true,
      },
    });
  }),

  getPrivateList: protectedProcedure.query(({ ctx }) => {
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
        state: "PRIVATE",
      },
      relationLoadStrategy: "join", // or 'query'
      include: {
        baseAbi: true,
        specialAbi: true,
        equipmentList: true,
        fashion: true,
        cuisine: true,
        consumableList: true,
        skillList: true,
        combos: true,
        pet: true,
        modifiersList: true,
        belongToAnalyzers: true,
      },
    });
  }),

  getUserVisbleList: publicProcedure.query(({ ctx }) => {
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
        where: {
          OR: [{ state: "PUBLIC" }, { createdByUserId: ctx.session?.user.id }],
        },
        relationLoadStrategy: "join", // or 'query'
        include: {
          baseAbi: true,
          specialAbi: true,
          equipmentList: true,
          fashion: true,
          cuisine: true,
          consumableList: true,
          skillList: true,
          combos: true,
          pet: true,
          modifiersList: true,
          belongToAnalyzers: true,
        },
      });
    }
    return ctx.db.character.findMany({
      where: { state: "PUBLIC" },
      relationLoadStrategy: "join", // or 'query'
      include: {
        baseAbi: true,
        specialAbi: true,
        equipmentList: true,
        fashion: true,
        cuisine: true,
        consumableList: true,
        skillList: true,
        combos: true,
        pet: true,
        modifiersList: true,
        belongToAnalyzers: true,
      },
    });
  }),

  // create: protectedProcedure.input(characterInputSchema.omit({ id: true })).mutation(async ({ ctx, input }) => {
  //   // 检查用户权限
  //   // if (ctx.session.user.role !== "ADMIN") {
  //   //   console.log(
  //   //     (ctx.session?.user.name ?? ctx.session?.user.email) +
  //   //       "没有权限上传技能",
  //   //   );
  //   //   return;
  //   // }

  //   // 检查用户是否存在关联的 UserCreate
  //   let userCreate = await ctx.db.userCreate.findUnique({
  //     where: { userId: ctx.session?.user.id },
  //   });

  //   // 如果不存在，创建一个新的 UserCreate
  //   if (!userCreate) {
  //     console.log(
  //       new Date().toLocaleDateString() +
  //         "--" +
  //         new Date().toLocaleTimeString() +
  //         "--" +
  //         (ctx.session?.user.name ?? ctx.session?.user.email) +
  //         "初次上传技能，自动创建对应userCreate",
  //     );
  //     userCreate = await ctx.db.userCreate.create({
  //       data: {
  //         userId: ctx.session?.user.id ?? "",
  //         // 其他 UserCreate 的属性，根据实际情况填写
  //       },
  //     });
  //   }

  //   console.log(
  //     new Date().toLocaleDateString() +
  //       "--" +
  //       new Date().toLocaleTimeString() +
  //       "--" +
  //       (ctx.session?.user.name ?? ctx.session?.user.email) +
  //       "上传了Character: " +
  //       input.name,
  //   );

  //   // 输入内容拆分成4个表的数据
  //   const { characterEffect: characterEffectInputArray, ...characterInput } = input;
  //   // 拆分characterEffect
  //   const costAndYiled = characterEffectInputArray.map((characterEffectInput) => {
  //     const { characterCost: characterCostInput, characterYield: characterYieldInput } = characterEffectInput;
  //     // 上传characterCost
  //     const characterCost = ctx.db.characterCost.createMany({
  //       data: characterCostInput,
  //     });
  //     // 上传characterYield
  //     const characterYield = ctx.db.characterYield.createMany({
  //       data: characterYieldInput,
  //     });
  //     return { characterYield, characterCost };
  //   });
  //   // 上传characterEffect
  //   const characterEffect = ctx.db.characterEffect.createMany({
  //     data: characterEffectInputArray,
  //   });
  //   // 创建技能并关联创建者和统计信息
  //   const character = ctx.db.character.create({
  //     data: {
  //       ...characterInput,
  //       createdByUserId: userCreate.userId,
  //     },
  //   });
  //   return { character, costAndYiled, characterEffect };
  // }),

  update: protectedProcedure.input(CharacterSchema).mutation(async ({ ctx, input }) => {
    // 检查用户权限
    // if (ctx.session.user.role !== "ADMIN") {
    //   console.log(
    //     (ctx.session?.user.name ?? ctx.session?.user.email) +
    //       "没有权限更新技能",
    //   );
    //   return;
    // }
    console.log(
      new Date().toLocaleDateString() +
        "--" +
        new Date().toLocaleTimeString() +
        "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "更新了Character: " +
        input.name,
    );
    return ctx.db.character.update({
      where: { id: input.id },
      data: { ...input },
    });
  }),
});
