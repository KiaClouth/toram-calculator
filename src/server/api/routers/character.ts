import { CharacterSchema } from "prisma/generated/zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const characterRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.character.findMany();
  }),
  create: protectedProcedure
    .input(CharacterSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.character.create({
        data: {
          name: input.name,
          createdByUserId: ctx.session.user.id,
        },
      });
    }),
});
