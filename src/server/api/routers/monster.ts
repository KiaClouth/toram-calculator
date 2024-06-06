import { UserCreate, UserUpdate, type Prisma } from "@prisma/client";
import { MonsterInputSchema } from "~/schema/monster";
import { defaultStatistics } from "~/schema/statistics";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { findOrCreateUserEntry } from "./untils";

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
      include: {},
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
      return ctx.db.monster.findMany({
        include: {},
      });
    }
    return ctx.db.monster.findMany({
      include: {},
    });
  }),

  create: protectedProcedure.input(MonsterInputSchema.omit({ id: true })).mutation(async ({ ctx, input }) => {
    // 检查或创建 UserCreate
    const userCreate = (await findOrCreateUserEntry("userCreate", ctx.session?.user.id, ctx)) as UserCreate;
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

      const { rates, ...OtherStatistics } = defaultStatistics;
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
        ...monster,
        statistics: {
          ...statistics,
        },
      };
    });
  }),

  update: protectedProcedure.input(MonsterInputSchema).mutation(async ({ ctx, input }) => {
    // 检查或创建 UserUpdate
    const userUpdate = (await findOrCreateUserEntry("userUpdate", ctx.session?.user.id, ctx)) as UserUpdate;
    // 使用实务更新多层嵌套数据
    return await prisma.$transaction(async () => {
    // 拆分输入数据
      const { statistics: statisticsInput, ...OtherMonsterInput } = input;
      const monster = await ctx.db.monster.update({
        where: { id: input.id },
        data: { ...OtherMonsterInput },
        include: {},
      });

      const { rates, ...OtherStatistics } = defaultStatistics;
      const statistics = await ctx.db.statistics.update({
        where: { id: statisticsInput?.id },
        data: { ...OtherStatistics },
        include: {
          rates: true,
        },
      });

      return {
        ...monster,
        statistics: {
          ...statistics,
        },
      };
    });
  }),
});
