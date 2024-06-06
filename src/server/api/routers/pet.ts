import type { Prisma } from "@prisma/client";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { PetSchema } from "prisma/generated/zod";

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
          "初次上传怪物，自动创建对应userCreate",
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
          "初次上传怪物，自动创建对应userUpdate",
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
        "上传了Pet: " +
        input.name,
    );
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
          "初次上传怪物，自动创建对应userUpdate",
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
        "更新了Pet: " +
        input.name,
    );
    return ctx.db.pet.update({
      where: { id: input.id },
      data: { ...input },
      include: {
      },
    });
  }),
});