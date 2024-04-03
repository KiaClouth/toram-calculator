import { MonsterSchema } from "prisma/generated/zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const monsterRouter = createTRPCRouter({
  getall: publicProcedure.query(({ ctx }) => {
    console.log(
      ctx.session?.user.name ?? ctx.session?.user.email + "请求了完整的列表",
    );
    return ctx.db.monster.findMany();
  }),

  getPublicList: publicProcedure.query(({ ctx }) => {
    console.log(
      ctx.session?.user.name ?? ctx.session?.user.email + "请求了公用的列表",
    );
    return ctx.db.monster.findMany({
      where: { state: "PUBLIC" },
    });
  }),

  getPrivateList: protectedProcedure.query(({ ctx }) => {
    console.log(
      ctx.session?.user.name ??
        ctx.session?.user.email + "请求了由他自己创建的怪物的列表",
    );
    return ctx.db.monster.findMany({
      where: {
        createdById: ctx.session?.user.id,
        state: "PRIVATE",
      },
    });
  }),

  getUserVisbleList: publicProcedure.query(({ ctx }) => {
    console.log(
      ctx.session?.user.name ?? ctx.session?.user.email + "请求了他可见的列表",
    );
    if (ctx.session?.user.id) {
      return ctx.db.monster.findMany({
        where: {
          OR: [{ state: "PUBLIC" }, { createdById: ctx.session?.user.id }],
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
      console.log(
        "上传者：" + ctx.session.user.name + ",用户ID:" + ctx.session.user.id,
      );

      // 检查用户是否存在关联的 UserCreate
      let userCreate = await ctx.db.userCreate.findUnique({
        where: { userId: ctx.session?.user.id },
      });

      // 如果不存在，创建一个新的 UserCreate
      if (!userCreate) {
        console.log("初次上传，自动创建对应userCreate");
        userCreate = await ctx.db.userCreate.create({
          data: {
            userId: ctx.session?.user.id ?? "",
            // 其他 UserCreate 的属性，根据实际情况填写
          },
        });
      }

      // 创建怪物并关联创建者和统计信息
      return ctx.db.monster.create({
        data: {
          ...input,
          createdById: userCreate.userId,
        },
      });
    }),

  update: protectedProcedure
    .input(MonsterSchema)
    .mutation(async ({ ctx, input }) => {
      console.log(
        "更新者：" + ctx.session.user.name + ",用户ID:" + ctx.session.user.id,
      );
      return ctx.db.monster.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),
});
