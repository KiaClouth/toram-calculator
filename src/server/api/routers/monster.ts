import { MonsterSchema } from "prisma/generated/zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const monsterRouter = createTRPCRouter({
  getall: publicProcedure.query(({ ctx }) => {
    console.log(
      new Date().toLocaleDateString() + "--" + new Date().toLocaleTimeString() + "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "请求了完整的怪物列表",
    );
    return ctx.db.monster.findMany();
  }),

  getPublicList: publicProcedure.query(({ ctx }) => {
    console.log(
      new Date().toLocaleDateString() + "--" + new Date().toLocaleTimeString() + "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "请求了公用的怪物列表",
    );
    return ctx.db.monster.findMany({
      where: { state: "PUBLIC" },
    });
  }),

  getPrivateList: protectedProcedure.query(({ ctx }) => {
    console.log(
      new Date().toLocaleDateString() + "--" + new Date().toLocaleTimeString() + "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "请求了由他自己创建的怪物列表",
    );
    return ctx.db.monster.findMany({
      where: {
        createdByUserId: ctx.session?.user.id,
        state: "PRIVATE",
      },
    });
  }),

  getUserVisbleList: publicProcedure.query(({ ctx }) => {
    console.log(
      new Date().toLocaleDateString() + "--" + new Date().toLocaleTimeString() + "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "请求了他可见的怪物列表",
    );
    if (ctx.session?.user.id) {
      return ctx.db.monster.findMany({
        where: {
          OR: [{ state: "PUBLIC" }, { createdByUserId: ctx.session?.user.id }],
        },
      });
    }
    return ctx.db.monster.findMany({
      where: { state: "PUBLIC" },
    });
  }),

  create: protectedProcedure
    .input(MonsterSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
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
          new Date().toLocaleDateString() + "--" + new Date().toLocaleTimeString() + "--" +
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
      console.log(
        new Date().toLocaleDateString() + "--" + new Date().toLocaleTimeString() + "--" +
          (ctx.session?.user.name ?? ctx.session?.user.email) +
          "上传了Monster: " +
          input.name,
      );
      // 创建怪物并关联创建者和统计信息
      return ctx.db.monster.create({
        data: {
          ...input,
          createdByUserId: userCreate.userId,
        },
      });
    }),

  update: protectedProcedure
    .input(MonsterSchema)
    .mutation(async ({ ctx, input }) => {
      // 检查用户权限
      // if (ctx.session.user.role !== "ADMIN") {
      //   console.log(
      //     (ctx.session?.user.name ?? ctx.session?.user.email) +
      //       "没有权限更新怪物",
      //   );
      //   return;
      // }
      console.log(
        new Date().toLocaleDateString() + "--" + new Date().toLocaleTimeString() + "--" +
          (ctx.session?.user.name ?? ctx.session?.user.email) +
          "更新了Monster: " +
          input.name,
      );
      return ctx.db.monster.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),
});
