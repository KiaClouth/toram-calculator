import type { Prisma } from "@prisma/client";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { PetSchema } from "prisma/generated/zod";
import { findOrCreateUserCreateData, findOrCreateUserUpateData } from "./untils";

export const petRouter = createTRPCRouter({
  getPrivate: protectedProcedure.query(({ ctx }) => {
    console.log(
      new Date().toLocaleDateString() +
        "--" +
        new Date().toLocaleTimeString() +
        "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "请求了由他自己创建的怪物列表",
    );
    return ctx.db.pet.findMany({
      where: {
        createdByUserId: ctx.session?.user.id,
      },
      include: {
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
        "请求了他可见的怪物列表",
    );
    if (ctx.session?.user.id) {
      return ctx.db.pet.findMany({
        include: {
        },
      });
    }
    return ctx.db.pet.findMany({
      include: {
      },
    });
  }),

  create: protectedProcedure.input(PetSchema.omit({ id: true })).mutation(async ({ ctx, input }) => {
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
    // 创建怪物并关联创建者和统计信息
    return ctx.db.pet.create({
      data: {
        ...input,
        createdByUserId: userCreate.userId,
        updatedByUserId: userCreate.userId,
      },
      include: {
      },
    });
  }),

  update: protectedProcedure.input(PetSchema).mutation(async ({ ctx, input }) => {
    // 检查用户权限
    // if (ctx.session.user.role !== "ADMIN") {
    //   console.log(
    //     (ctx.session?.user.name ?? ctx.session?.user.email) +
    //       "没有权限更新怪物",
    //   );
    //   return;
    // }

    // 检查用户是否存在关联的 UserUpdate
    await findOrCreateUserUpateData(ctx.session?.user.id, ctx);
    return ctx.db.pet.update({
      where: { id: input.id },
      data: { ...input },
      include: {
      },
    });
  }),
});