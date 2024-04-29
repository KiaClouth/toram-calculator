import { type Prisma, PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { SkillSchema } from "prisma/generated/zod";
import { SkillInputSchema } from "~/schema/skillSchema";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

const prisma = new PrismaClient();

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

    // 输入内容拆分成4个表的数据
    const { skillEffect: skillEffectInputArray, ...skillInput } = input;

    return prisma.$transaction(async () => {
      const skillId = randomUUID();
      const skill = await ctx.db.skill.create({
        data: {
          ...skillInput,
          id: skillId,
          skillEffect: undefined,
          createdByUserId: userCreate.userId,
        },
        include: {
          skillEffect: {
            include: {
              skillCost: true,
              skillYield: true,
            },
          },
        },
      });

      const skillEffect = skillEffectInputArray.map(async (skillEffectInput) => {
        return await ctx.db.skillEffect.create({
          data: {
            ...skillEffectInput,
            belongToskillId: skillId,
            skillCost: {
              createMany: {
                data: skillEffectInput.skillCost,
              },
            },
            skillYield: {
              createMany: {
                data: skillEffectInput.skillYield,
              },
            },
          },
          include: {
            skillCost: true,
            skillYield: true,
          },
        });
      });

      console.log(
        new Date().toLocaleDateString() +
          "--" +
          new Date().toLocaleTimeString() +
          "--" +
          (ctx.session?.user.name ?? ctx.session?.user.email) +
          "上传了Skill: " +
          input.name,
      );

      return {
        ...skill,
        skillEffect: await Promise.all(skillEffect),
      };
    });
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
});
