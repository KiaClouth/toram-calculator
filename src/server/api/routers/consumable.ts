import type { Prisma } from "@prisma/client";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { ConsumableSchema } from "prisma/generated/zod";

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
      return ctx.db.consumable.findMany({
      });
    }
    return ctx.db.consumable.findMany({
    });
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
          "初次上传消耗品，自动创建对应userCreate",
      );
      userCreate = await ctx.db.userCreate.create({
        data: {
          userId: ctx.session?.user.id ?? "",
          // 其他 UserCreate 的属性，根据实际情况填写
        },
      });
    }

    // 检查用户是否存在关联的 UserUpdate
    let userUpdate = await ctx.db.userUpdate.findUnique({
      where: { userId: ctx.session?.user.id },
    });

    // 如果不存在，创建一个新的 UserUpdate
    if (!userUpdate) {
      console.log(
        new Date().toLocaleDateString() +
          "--" +
          new Date().toLocaleTimeString() +
          "--" +
          (ctx.session?.user.name ?? ctx.session?.user.email) +
          "初次上传消耗品，自动创建对应userUpdate",
      );
      userUpdate = await ctx.db.userUpdate.create({
        data: {
          userId: ctx.session?.user.id ?? "",
          // 其他 UserUpdate 的属性，根据实际情况填写
        },
      });
    }

    console.log(
      new Date().toLocaleDateString() +
        "--" +
        new Date().toLocaleTimeString() +
        "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "上传了Consumable: " +
        input.name,
    );
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

    // 检查用户是否存在关联的 UserUpdate
    let userUpdate = await ctx.db.userUpdate.findUnique({
      where: { userId: ctx.session?.user.id },
    });

    // 如果不存在，创建一个新的 UserUpdate
    if (!userUpdate) {
      console.log(
        new Date().toLocaleDateString() +
          "--" +
          new Date().toLocaleTimeString() +
          "--" +
          (ctx.session?.user.name ?? ctx.session?.user.email) +
          "初次上传消耗品，自动创建对应userUpdate",
      );
      userUpdate = await ctx.db.userUpdate.create({
        data: {
          userId: ctx.session?.user.id ?? "",
          // 其他 UserUpdate 的属性，根据实际情况填写
        },
      });
    }

    console.log(
      new Date().toLocaleDateString() +
        "--" +
        new Date().toLocaleTimeString() +
        "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "更新了Consumable: " +
        input.name,
    );
    return ctx.db.consumable.update({
      where: { id: input.id },
      data: { ...input },
    });
  }),
})