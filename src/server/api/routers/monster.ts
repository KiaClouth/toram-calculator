import { MonsterSchema } from "prisma/generated/zod";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const monsterRouter = createTRPCRouter({
  getList: publicProcedure.query(({ ctx }) => {
    console.log(ctx.session?.user.name + "获取了一次怪物数据");
    return ctx.db.monster.findMany();
  }),
  getUserByMonsterId: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.db.monster.findFirst({
        // orderBy: { createdAt: "desc" },
        where: { updatedById: input },
      });
    }),

  // getMonster: publicProcedure
  // .input({})
  // .mutation(async ({ ctx, input }) => {
  //   return ctx.db.monster.create({
  //   });
  // }),

  create: protectedProcedure
    .input(MonsterSchema)
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
      return ctx.db.monster.create({
        data: {
          ...input,
          // updatedById: ctx.session?.user.id ?? "",
          createdById: ctx.session?.user.id ?? "",
        },
      });
    }),
});
