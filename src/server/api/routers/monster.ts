import { MonsterSchema } from "prisma/generated/zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const monsterRouter = createTRPCRouter({
  getList: protectedProcedure.query(({ ctx }) => {
    return ctx.db.monster.findMany();
  }),

  create: protectedProcedure
    .input(MonsterSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.monster.create({
        data: {
          ...input,
          updatedBy: { connect: { id: ctx.session.user.id} },
        },
      });
    })
});
