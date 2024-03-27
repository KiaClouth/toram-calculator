import { AnalyzerSchema } from "prisma/generated/zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const analyzerRouter = createTRPCRouter({
  getList: publicProcedure.query(({ ctx }) => {
    console.log(ctx.session?.user.name + "获取了一次分析器数据");
    return ctx.db.analyzer.findMany();
  }),

  create: protectedProcedure
    .input(AnalyzerSchema)
    .mutation(async ({ ctx, input }) => {
      console.log(
        "上传者：" + ctx.session.user.name + "上传了分析器"
      );
      // 检查用户是否存在关联的 UserCreate
      let userCreate = await ctx.db.userCreate.findUnique({
        where: { userId: ctx.session.user.id },
      });
      // 如果不存在，创建一个新的 UserCreate
      if (!userCreate) {
        console.log("初次上传，自动创建对应userCreate");
        userCreate = await ctx.db.userCreate.create({
          data: {
            userId: ctx.session.user.id,
            // 其他 UserCreate 的属性，根据实际情况填写
          },
        });
      }
      return ctx.db.analyzer.create({
        data: {
          ...input,
          createdByUserId: ctx.session.user.id,
        },
      });
    }),
});
