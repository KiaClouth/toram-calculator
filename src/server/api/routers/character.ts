import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const characterRouter = createTRPCRouter({
  createCharacter: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.character.create({
        data: {
          name: input.name,
          createdByUserId: ctx.session.user.id
        }
      })
    }),
});
