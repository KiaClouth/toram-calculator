import type { Prisma } from "@prisma/client";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { ConsumableSchema } from "prisma/generated/zod";
import { findOrCreateUserCreateData, findOrCreateUserUpateData } from "./untils";

export const consumableRouter = createTRPCRouter({
  getPrivate: protectedProcedure.query(({ ctx }) => {
    console.log(
      new Date().toLocaleDateString() +
        "--" +
        new Date().toLocaleTimeString() +
        "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "请求了由他自己创建的消耗品列表",
    );
    return ctx.db.consumable.findMany({
      where: {
        createdByUserId: ctx.session?.user.id,
      },
    });
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    console.log(
      new Date().toLocaleDateString() +
        "--" +
        new Date().toLocaleTimeString() +
        "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "请求了他可见的消耗品列表",
    );
    if (ctx.session?.user.id) {
      return ctx.db.consumable.findMany({});
    }
    return ctx.db.consumable.findMany({});
  }),

  create: protectedProcedure.input(ConsumableSchema.omit({ id: true })).mutation(async ({ ctx, input }) => {
    // 检查用户权限
    // if (ctx.session.user.role !== "ADMIN") {
    //   console.log(
    //     (ctx.session?.user.name ?? ctx.session?.user.email) +
    //       "没有权限上传消耗品",
    //   );
    //   return;
    // }
    // 检查或创建 UserCreate
    const userCreate = await findOrCreateUserCreateData(ctx.session?.user.id, ctx);
    // 创建消耗品并关联创建者和统计信息
    return ctx.db.consumable.create({
      data: {
        ...input,
        createdByUserId: userCreate.userId,
        updatedByUserId: userCreate.userId,
      },
    });
  }),

  update: protectedProcedure.input(ConsumableSchema).mutation(async ({ ctx, input }) => {
    // 检查用户权限
    // if (ctx.session.user.role !== "ADMIN") {
    //   console.log(
    //     (ctx.session?.user.name ?? ctx.session?.user.email) +
    //       "没有权限更新消耗品",
    //   );
    //   return;
    // }
    // 检查UserUpdate是否存在
    await findOrCreateUserUpateData(ctx.session?.user.id, ctx);
    // 更新消耗品
    return ctx.db.consumable.update({
      where: { id: input.id },
      data: { ...input },
    });
  }),
});
