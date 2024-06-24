import { AnalyzerSchema } from "prisma/generated/zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { findOrCreateUserCreateData } from "./untils";

export const analyzerRouter = createTRPCRouter({
  getList: publicProcedure.query(({ ctx }) => {
    console.log(ctx.session?.user.name + "获取了一次分析器数据");
    return ctx.db.analyzer.findMany();
  }),

  create: protectedProcedure
    .input(AnalyzerSchema)
    .mutation(async ({ ctx, input }) => {
      // 检查或创建 UserCreate
      const userCreate = (await findOrCreateUserCreateData(ctx.session?.user.id, ctx));
      return ctx.db.analyzer.create({
        data: {
          ...input,
          createdByUserId: userCreate.userId,
        },
      });
    }),
});
