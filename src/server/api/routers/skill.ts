import type { Prisma } from "@prisma/client";
import { SkillSchema } from "prisma/generated/zod";
import { SkillInputSchema } from "~/schema/skillSchema";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export type SkillCost = Prisma.SkillCostGetPayload<{
  include: object;
}>;

export type SkillYield = Prisma.SkillYieldGetPayload<{
  include: object;
}>;

export type SkillEffect = Prisma.SkillEffectGetPayload<{
  include: {
    skillCost: true;
    skillYield: true;
  };
}>;

export type Skill = Prisma.SkillGetPayload<{
  include: {
    skillEffect: {
      include: {
        skillCost: true;
        skillYield: true;
      };
    };
  };
}>;

export const skillRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    console.log(
      new Date().toLocaleDateString() +
        "--" +
        new Date().toLocaleTimeString() +
        "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "请求了完整的技能列表",
    );
    return ctx.db.skill.findMany({
      relationLoadStrategy: "join", // or 'query'
      include: {
        skillEffect: {
          include: {
            skillCost: true,
            skillYield: true,
          },
        },
      },
    });
  }),

  getPublicList: publicProcedure.query(({ ctx }) => {
    console.log(
      new Date().toLocaleDateString() +
        "--" +
        new Date().toLocaleTimeString() +
        "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "请求了公用的技能列表",
    );
    return ctx.db.skill.findMany({
      where: { state: "PUBLIC" },
      relationLoadStrategy: "join", // or 'query'
      include: {
        skillEffect: {
          include: {
            skillCost: true,
            skillYield: true,
          },
        },
      },
    });
  }),

  getPrivateList: protectedProcedure.query(({ ctx }) => {
    console.log(
      new Date().toLocaleDateString() +
        "--" +
        new Date().toLocaleTimeString() +
        "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "请求了由他自己创建的技能列表",
    );
    return ctx.db.skill.findMany({
      where: {
        createdByUserId: ctx.session?.user.id,
        state: "PRIVATE",
      },
      relationLoadStrategy: "join", // or 'query'
      include: {
        skillEffect: {
          include: {
            skillCost: true,
            skillYield: true,
          },
        },
      },
    });
  }),

  getUserVisbleList: publicProcedure.query(({ ctx }) => {
    console.log(
      new Date().toLocaleDateString() +
        "--" +
        new Date().toLocaleTimeString() +
        "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "请求了他可见的技能列表",
    );
    if (ctx.session?.user.id) {
      return ctx.db.skill.findMany({
        where: {
          OR: [{ state: "PUBLIC" }, { createdByUserId: ctx.session?.user.id }],
        },
        relationLoadStrategy: "join", // or 'query'
        include: {
          skillEffect: {
            include: {
              skillCost: true,
              skillYield: true,
            },
          },
        },
      });
    }
    return ctx.db.skill.findMany({
      where: { state: "PUBLIC" },
      relationLoadStrategy: "join", // or 'query'
      include: {
        skillEffect: {
          include: {
            skillCost: true,
            skillYield: true,
          },
        },
      },
    });
  }),

  create: protectedProcedure.input(SkillInputSchema.omit({ id: true })).mutation(async ({ ctx, input }) => {
    // 检查用户权限
    // if (ctx.session.user.role !== "ADMIN") {
    //   console.log(
    //     (ctx.session?.user.name ?? ctx.session?.user.email) +
    //       "没有权限上传技能",
    //   );
    //   return;
    // }

    // 检查用户是否存在关联的 UserCreate
    let userCreate = await ctx.db.userCreate.findUnique({
      where: { userId: ctx.session?.user.id },
    });

    // 如果不存在，创建一个新的 UserCreate
    if (!userCreate) {
      console.log(
        new Date().toLocaleDateString() +
          "--" +
          new Date().toLocaleTimeString() +
          "--" +
          (ctx.session?.user.name ?? ctx.session?.user.email) +
          "初次上传技能，自动创建对应userCreate",
      );
      userCreate = await ctx.db.userCreate.create({
        data: {
          userId: ctx.session?.user.id ?? "",
          // 其他 UserCreate 的属性，根据实际情况填写
        },
      });
    }

    console.log(
      new Date().toLocaleDateString() +
        "--" +
        new Date().toLocaleTimeString() +
        "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "上传了Skill: " +
        input.name,
    );

    // 输入内容拆分成4个表的数据
    const { skillEffect: skillEffectInputArray, ...skillInput } = input;
    // 创建技能并关联创建者和统计信息
    const skill = ctx.db.skill.create({
      data: {
        ...skillInput,
        skillEffect: {
          createMany: {
            data: skillEffectInputArray.map((skillEffectInput) => {
              return {
                ...skillEffectInput,
                skillCost: undefined,
                skillYield: undefined,
              };
            })
          }
        },
        createdByUserId: userCreate.userId,
      },
    });
    // const skillId = (await skill).id;
    // // 上传skillEffect
    // const skillEffect = ctx.db.skillEffect.createMany({
    //   data: skillEffectInputArray.map((skillEffectInput) => {
    //     return {
    //       ...skillEffectInput,
    //       skillCost: undefined,
    //       skillYield: undefined,
    //       belongToskillId: skillId
    //     }
    //   }),
    // });
    // const skillEffectCount = (await skillEffect);
    // console.log(skillEffectCount);
    // // 拆分skillEffect
    // skillEffectInputArray.map((skillEffectInput) => {
    //   const { skillCost: skillCostInput, skillYield: skillYieldInput } = skillEffectInput;
    //   // 上传skillCost
    //   const skillCost = ctx.db.skillCost.createMany({
    //     data: skillCostInput,
    //   });
    //   // 上传skillYield
    //   const skillYield = ctx.db.skillYield.createMany({
    //     data: skillYieldInput,
    //   });
    //   return { skillYield, skillCost };
    // });
    // return { skill, skillEffect };
    return skill
  }),

  update: protectedProcedure.input(SkillSchema).mutation(async ({ ctx, input }) => {
    // 检查用户权限
    // if (ctx.session.user.role !== "ADMIN") {
    //   console.log(
    //     (ctx.session?.user.name ?? ctx.session?.user.email) +
    //       "没有权限更新技能",
    //   );
    //   return;
    // }
    console.log(
      new Date().toLocaleDateString() +
        "--" +
        new Date().toLocaleTimeString() +
        "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "更新了Skill: " +
        input.name,
    );
    return ctx.db.skill.update({
      where: { id: input.id },
      data: { ...input },
    });
  }),
});
