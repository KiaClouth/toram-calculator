import { PrismaClient } from "@prisma/client";
import { SkillInclude, SkillInputSchema } from "~/schema/skill";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { findOrCreateUserCreateData, findOrCreateUserUpateData } from "./untils";
import { defaultStatistics } from "~/schema/statistics";

const prisma = new PrismaClient();

export const skillRouter = createTRPCRouter({
  getPrivate: protectedProcedure.query(({ ctx }) => {
    console.log(
      new Date().toLocaleDateString() +
        "--" +
        new Date().toLocaleTimeString() +
        "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "请求了由他自己创建的技能列表",
    );
    return ctx.db.skill.findMany({
      where: {
        createdByUserId: ctx.session?.user.id,
      },
      relationLoadStrategy: "join", // or 'query'
      include: SkillInclude.include,
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
      return ctx.db.skill.findMany({
        relationLoadStrategy: "join", // or 'query'
        include: SkillInclude.include,
      });
    }
    return ctx.db.skill.findMany({
      relationLoadStrategy: "join", // or 'query'
      include: SkillInclude.include,
    });
  }),

  create: protectedProcedure.input(SkillInputSchema).mutation(async ({ ctx, input }) => {
    // 检查或创建 UserCreate
    const userCreate = (await findOrCreateUserCreateData(ctx.session?.user.id, ctx));
    // 使用实务创建多层嵌套数据
    return await prisma.$transaction(async () => {
      // 拆分输入数据
      const { statistics: statisticsInput, skillEffect: skillEffectInputArray, ...OtherSkillInput } = input;
      const skill = await ctx.db.skill.create({
        data: {
          ...OtherSkillInput,
          skillEffect: undefined,
          statistics: undefined,
          createdByUserId: userCreate.userId,
        },
      });

      const skillEffect = skillEffectInputArray.map(async (skillEffectInput) => {
        return await ctx.db.skillEffect.create({
          data: {
            ...skillEffectInput,
            belongToskillId: skill.id,
            skillCost: {
              createMany: {
                data: skillEffectInput.skillCost,
              },
            },
            skillYield: {
              createMany: {
                data: skillEffectInput.skillYield,
              },
            },
          },
          include: {
            skillCost: true,
            skillYield: true,
          },
        });
      });

      const { rates, ...OtherStatistics } = statisticsInput?.rates ? statisticsInput : defaultStatistics;
      const statistics = await ctx.db.statistics.create({
        data: {
          ...OtherStatistics,
          rates: {
            create: rates,
          },
        },
        include: {
          rates: true,
        },
      });

      return {
        ...skill,
        skillEffect: await Promise.all(skillEffect),
        statistics: statistics,
      };
    });
  }),

  update: protectedProcedure.input(SkillInputSchema).mutation(async ({ ctx, input }) => {
    // 检查或创建 UserUpdate
    await findOrCreateUserUpateData(ctx.session?.user.id, ctx);
    // 使用实务创建多层嵌套数据
    return await prisma.$transaction(async () => {
      // 拆分输入数据
    const { statistics: statisticsInput, skillEffect: skillEffectInputArray, ...OtherSkillInput } = input;

    return prisma.$transaction(async () => {
      const skill = await ctx.db.skill.update({
        where: { id: input.id },
        data: {
          ...OtherSkillInput,
        },
      });

      const skillEffect = skillEffectInputArray.map(async (effect) => {
        const { skillCost: skillCostInputArray, skillYield: skillYieldInputArray, ...skillEffectInput } = effect;
        const skillEffect = await ctx.db.skillEffect.update({
          where: { id: skillEffectInput.id },
          data: {
            ...skillEffectInput,
          },
          include: {
            skillCost: true,
            skillYield: true,
          },
        });
        const skillCost = skillCostInputArray.map(async (skillCostInput) => {
          return await ctx.db.skillCost.update({
            where: { id: skillCostInput.id },
            data: {
              ...skillCostInput,
            },
          });
        });
        const skillYield = skillYieldInputArray.map(async (skillYieldInput) => {
          return await ctx.db.skillYield.update({
            where: { id: skillYieldInput.id },
            data: {
              ...skillYieldInput,
            },
          });
        });
        return { ...skillEffect, skillCost: await Promise.all(skillCost), skillYield: await Promise.all(skillYield) };
      });

      const { rates, ...OtherStatistics } = statisticsInput?.rates ? statisticsInput : defaultStatistics;
      const statistics = await ctx.db.statistics.update({
        where: { id: statisticsInput?.id },
        data: { ...OtherStatistics },
        include: {
          rates: true,
        },
      });

      return {
        ...skill,
        skillEffect: await Promise.all(skillEffect),
        statistics: statistics,
      };
    });
    })
  }),
});
