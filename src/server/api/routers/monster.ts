import { MonsterInclude, MonsterInputSchema } from "~/schema/monster";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { findOrCreateUserCreateData, findOrCreateUserUpateData } from "./untils";
import { StatisticsInclude } from "~/schema/statistics";

const prisma = new PrismaClient();

export const monsterRouter = createTRPCRouter({
  getPrivate: protectedProcedure.query(({ ctx }) => {
    console.log(
      new Date().toLocaleDateString() +
        "--" +
        new Date().toLocaleTimeString() +
        "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "请求了由他自己创建的怪物列表",
    );
    return ctx.db.monster.findMany({
      where: {
        createdByUserId: ctx.session?.user.id,
      },
      include: MonsterInclude.include,
    });
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    console.log(
      new Date().toLocaleDateString() +
        "--" +
        new Date().toLocaleTimeString() +
        "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "请求了他可见的怪物列表",
    );
    if (ctx.session?.user.id) {
      return ctx.db.monster.findMany(MonsterInclude);
    }
    return ctx.db.monster.findMany(MonsterInclude);
  }),

  create: protectedProcedure.input(MonsterInputSchema.omit({ id: true })).mutation(async ({ ctx, input }) => {
    // 检查或创建 UserCreate
    const userCreate = (await findOrCreateUserCreateData(ctx.session?.user.id, ctx));
    // 使用实务创建多层嵌套数据
    return await prisma.$transaction(async () => {
      // 拆分输入数据
      const { statistics: statisticsInput, ...OtherMonsterInput } = input;
      const monster = await ctx.db.monster.create({
        data: {
          ...OtherMonsterInput,
          createdByUserId: userCreate.userId,
        },
        include: {},
      });

      const { rates, usageTimestamps, viewTimestamps, ...OtherStatistics } = statisticsInput;
      const statistics = await ctx.db.statistics.create({
        data: {
          ...OtherStatistics,
          usageTimestamps: {
            create: usageTimestamps,
          },
          viewTimestamps: {
            create: viewTimestamps,
          },
          rates: {
            create: rates,
          },
        },
        include: StatisticsInclude.include,
      });

      return {
        ...monster,
        statistics: {
          ...statistics,
        },
      };
    });
  }),

  update: protectedProcedure.input(MonsterInputSchema).mutation(async ({ ctx, input }) => {
    // 检查或创建 UserUpdate
    await findOrCreateUserUpateData(ctx.session?.user.id, ctx);
    // 使用实务更新多层嵌套数据
    return await prisma.$transaction(async () => {
      const monster = await ctx.db.monster.update({
        where: { id: input.id },
        data: {
          ...input,
          statistics: undefined,
        },
        include: MonsterInclude.include,
      });

      return monster;
    });
  }),
});
