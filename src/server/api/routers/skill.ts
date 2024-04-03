import { SkillSchema } from "prisma/generated/zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const skillRouter = createTRPCRouter({
  getall: publicProcedure.query(({ ctx }) => {
    console.log(
      ctx.session?.user.name ??
        ctx.session?.user.email + "请求了完整的技能列表",
    );
    return ctx.db.skill.findMany();
  }),

  getPublicList: publicProcedure.query(({ ctx }) => {
    console.log(
      ctx.session?.user.name ??
        ctx.session?.user.email + "请求了公用的技能列表",
    );
    return ctx.db.skill.findMany({
      where: { state: "PUBLIC" },
    });
  }),

  getPrivateList: protectedProcedure.query(({ ctx }) => {
    console.log(
      ctx.session?.user.name ??
        ctx.session?.user.email + "请求了由他自己创建的技能列表",
    );
    return ctx.db.skill.findMany({
      where: {
        createdByUserId: ctx.session?.user.id,
        state: "PRIVATE",
      },
    });
  }),

  getUserVisbleList: publicProcedure.query(({ ctx }) => {
    console.log(
      ctx.session?.user.name ??
        ctx.session?.user.email + "请求了他可见的技能列表",
    );
    if (ctx.session?.user.id) {
      return ctx.db.skill.findMany({
        where: {
          OR: [{ state: "PUBLIC" }, { createdByUserId: ctx.session?.user.id }],
        },
      });
    }
    return ctx.db.skill.findMany({
      where: { state: "PUBLIC" },
    });
  }),

  create: protectedProcedure
    .input(SkillSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      // 检查用户是否存在关联的 UserCreate
      let userCreate = await ctx.db.userCreate.findUnique({
        where: { userId: ctx.session?.user.id },
      });

      // 如果不存在，创建一个新的 UserCreate
      if (!userCreate) {
        console.log(
          ctx.session.user.name ??
            ctx.session.user.email + "初次上传技能，自动创建对应userCreate",
        );
        userCreate = await ctx.db.userCreate.create({
          data: {
            userId: ctx.session?.user.id ?? "",
            // 其他 UserCreate 的属性，根据实际情况填写
          },
        });
      }
      console.log(
        ctx.session.user.name ??
          ctx.session.user.email + "上传了技能: " + input.name,
      );
      // 创建怪物并关联创建者和统计信息
      return ctx.db.skill.create({
        data: {
          ...input,
          createdByUserId: userCreate.userId,
        },
      });
    }),

  update: protectedProcedure
    .input(SkillSchema)
    .mutation(async ({ ctx, input }) => {
      console.log(
        ctx.session.user.name ??
          ctx.session.user.email + "修改了技能: " + input.name,
      );
      return ctx.db.skill.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),
});
