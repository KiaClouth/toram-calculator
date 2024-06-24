import { PrismaClient, type Prisma } from "@prisma/client";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { randomUUID } from "crypto";
import { CrystalInclude, CrystalInputSchema } from "~/schema/crystal";
import { findOrCreateUserCreateData, findOrCreateUserUpateData } from "./untils";

const prisma = new PrismaClient();

export const crystalRouter = createTRPCRouter({
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
      return ctx.db.crystal.findMany(CrystalInclude);
    }
    return ctx.db.crystal.findMany(CrystalInclude);
  }),

  create: protectedProcedure.input(CrystalInputSchema.omit({ id: true })).mutation(async ({ ctx, input }) => {
    // 检查用户权限
    // if (ctx.session.user.role !== "ADMIN") {
    //   console.log(
    //     (ctx.session?.user.name ?? ctx.session?.user.email) +
    //       "没有权限上传怪物",
    //   );
    //   return;
    // }
    // 检查或创建 UserCreate
    const userCreate = (await findOrCreateUserCreateData(ctx.session?.user.id, ctx));

    // 输入内容拆分成4个表的数据
    const { modifiersList: modifiersListInput, statistics: statisticsInput, ...crystalInput } = input;

    return prisma.$transaction(async () => {
      const crystalId = randomUUID();
      const crystal = await ctx.db.crystal.create({
        data: {
          ...crystalInput,
          modifiersList: undefined,
          id: crystalId,
          createdByUserId: userCreate.userId,
        },
      });

      const modifiersList = await ctx.db.modifiersList.create({
        data: {
          ...modifiersListInput,
          modifiers: undefined,
          usedByCrystal: { connect: { id: crystalId } },
        },
      });

      const {modifiers: modifiersInput} = modifiersListInput

      const modifiers = modifiersInput.map(async (modifier) => {
        return await ctx.db.modifier.create({
          data: {
            ...modifier,
          },
        });
      });

      const statistics = await ctx.db.statistics.create({
        data: {
          ...statisticsInput,
          rates: {
            create: statisticsInput?.rates,
          },
        },
        include: {
          rates: true,
        },
      });

      return {
        ...crystal,
        modifiersList: {
          ...modifiersList,
          modifiers: await Promise.all(modifiers),
        },
        statistics: statistics,
      };
    });
  }),

  update: protectedProcedure.input(CrystalInputSchema).mutation(async ({ ctx, input }) => {
    // 检查用户权限
    // if (ctx.session.user.role !== "ADMIN") {
    //   console.log(
    //     (ctx.session?.user.name ?? ctx.session?.user.email) +
    //       "没有权限上传怪物",
    //   );
    //   return;
    // }

    // 检查用户是否存在关联的 UserUpdate
    await findOrCreateUserUpateData(ctx.session?.user.id, ctx);

    // 输入内容拆分成4个表的数据
    const { statistics: statisticsInput, modifiersList: modifiersListInput, ...crystalInput } = input;

    return prisma.$transaction(async () => {
      const crystal = await ctx.db.crystal.update({
        where: { id: input.id },
        data: {
          ...crystalInput,
          modifiersList: undefined,
        },
      });

      const modifiersList = await ctx.db.modifiersList.update({
        where: { id: input.modifiersListId },
        data: {
          ...modifiersListInput,
          modifiers: undefined,
        },
      });

      const {modifiers: modifiersInput} = modifiersListInput

      const modifiers = modifiersInput.map(async (modifier) => {
        return await ctx.db.modifier.update({
          where: { id: modifier.id },
          data: {
            ...modifier,
          },
        });
      });

      const statistics = statisticsInput && await ctx.db.statistics.update({
        where: { id: statisticsInput.id },
        data: {
          ...statisticsInput,
          rates: {
            create: statisticsInput?.rates,
          },
        },
        include: {
          rates: true,
        },
      });

      console.log(
        new Date().toLocaleDateString() +
          "--" +
          new Date().toLocaleTimeString() +
          "--" +
          (ctx.session?.user.name ?? ctx.session?.user.email) +
          "上传了Crystal: " +
          input.name,
      );

      return {
        ...crystal,
        modifiersList: {
          ...modifiersList,
          modifiers: await Promise.all(modifiers),
        },
        statistics: statistics,
      };
    });
  }),
});
