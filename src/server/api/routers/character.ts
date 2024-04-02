import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const characterRouter = createTRPCRouter({
  getList: protectedProcedure.query(({ ctx }) => {
    return ctx.db.character.findMany();
  }),
  createCharacter: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.character.create({
        data: {
          name: input.name,
          createdById: ctx.session.user.id
        }
      })
    }),
});
