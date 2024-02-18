import { PostSchema } from "prisma/generated/zod";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getExpires: publicProcedure.query(({ ctx }) => {
    return ctx.session?.expires
  }),
});
