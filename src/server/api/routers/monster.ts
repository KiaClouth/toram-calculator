import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const monsterRouter = createTRPCRouter({
    getMonsterList: protectedProcedure.query(({ ctx }) => {
        return ctx.db.monster.findMany();
    }),

    create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.monster.create({
        data: {
          name: input.name,
          updatedById: ctx.session.user.id,
        },
      });
    })
});
