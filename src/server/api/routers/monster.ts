import {
  MonsterSchema,
} from "prisma/generated/zod";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const monsterRouter = createTRPCRouter({
  getList: publicProcedure.query(({ ctx }) => {
    console.log(ctx.session?.user.name + '获取了一次怪物数据')
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
      return ctx.db.monster.create({
        data: {
          ...input,
          createdByUserId: ctx.session?.user ? ctx.session.user.id : ""
        },
      });
    }),
});
