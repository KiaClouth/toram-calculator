import { PrismaClient, type Prisma } from "@prisma/client";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { CrystalInputSchema } from "~/schema/crystalSchema";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

export type Modifier = Prisma.ModifierGetPayload<{
  include: object;
}>;

export type ModifiersList = Prisma.ModifiersListGetPayload<{
  include: {
    modifiers: true;
  };
}>;

export type Crystal = Prisma.CrystalGetPayload<{
  include: {
    rates: true;
    modifiersList: {
      include: {
        modifiers: true;
      };
    };
  };
}>;

export const crystalRouter = createTRPCRouter({
  getUserVisbleList: publicProcedure.query(({ ctx }) => {
    console.log(
      new Date().toLocaleDateString() +
        "--" +
        new Date().toLocaleTimeString() +
        "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "请求了他可见的怪物列表",
    );
    if (ctx.session?.user.id) {
      return ctx.db.crystal.findMany({
        where: {
          OR: [{ state: "PUBLIC" }, { createdByUserId: ctx.session?.user.id }],
        },
        include: {
          modifiersList: {
            include: {
              modifiers: true,
            },
          },
          rates: true,
        },
      });
    }
    return ctx.db.crystal.findMany({
      where: { state: "PUBLIC" },
      include: {
        modifiersList: {
          include: {
            modifiers: true,
          },
        },
        rates: true,
      },
    });
  }),

  create: protectedProcedure.input(CrystalInputSchema.omit({ id: true })).mutation(async ({ ctx, input }) => {
    // 检查用户权限
    // if (ctx.session.user.role !== "ADMIN") {
    //   console.log(
    //     (ctx.session?.user.name ?? ctx.session?.user.email) +
    //       "没有权限上传怪物",
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
          "初次上传怪物，自动创建对应userCreate",
      );
      userCreate = await ctx.db.userCreate.create({
        data: {
          userId: ctx.session?.user.id ?? "",
          // 其他 UserCreate 的属性，根据实际情况填写
        },
      });
    }

    // 检查用户是否存在关联的 UserUpdate
    let userUpdate = await ctx.db.userUpdate.findUnique({
      where: { userId: ctx.session?.user.id },
    });

    // 如果不存在，创建一个新的 UserUpdate
    if (!userUpdate) {
      console.log(
        new Date().toLocaleDateString() +
          "--" +
          new Date().toLocaleTimeString() +
          "--" +
          (ctx.session?.user.name ?? ctx.session?.user.email) +
          "初次上传怪物，自动创建对应userUpdate",
      );
      userUpdate = await ctx.db.userUpdate.create({
        data: {
          userId: ctx.session?.user.id ?? "",
          // 其他 UserUpdate 的属性，根据实际情况填写
        },
      });
    }

    console.log(
      new Date().toLocaleDateString() +
        "--" +
        new Date().toLocaleTimeString() +
        "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "上传了Crystal: " +
        input.name,
    );

    // 输入内容拆分成4个表的数据
    const { rates: ratesInput, modifiersList: modifiersListInput, ...crystalInput } = input;

    return prisma.$transaction(async () => {
      const crystalId = randomUUID();
      const crystal = await ctx.db.crystal.create({
        data: {
          ...crystalInput,
          modifiersList: undefined,
          rates: undefined,
          id: crystalId,
        },
        include: {
          rates: true,
        },
      });

      const modifiersList = await ctx.db.modifiersList.create({
        data: {
          ...modifiersListInput,
          modifiers: undefined,
          usedByCrystal: { connect: { id: crystalId } },
        },
      });

      const {modifiers: modifiersInput} = modifiersListInput

      const modifiers = modifiersInput.map(async (modifier) => {
        return await ctx.db.modifier.create({
          data: {
            ...modifier,
          },
        });
      });

      const rates = ratesInput.map(async (rateInput) => {
        return await ctx.db.rate.create({
          data: {
            ...rateInput,
            userId: ctx.session?.user.id,
            crystalId: crystalId,
          },
        });
      });

      console.log(
        new Date().toLocaleDateString() +
          "--" +
          new Date().toLocaleTimeString() +
          "--" +
          (ctx.session?.user.name ?? ctx.session?.user.email) +
          "上传了Crystal: " +
          input.name,
      );

      return {
        ...crystal,
        modifiersList: {
          ...modifiersList,
          modifiers: await Promise.all(modifiers),
        },
        rates: await Promise.all(rates),
      };
    });
  }),

  update: protectedProcedure.input(CrystalInputSchema).mutation(async ({ ctx, input }) => {
    // 检查用户权限
    // if (ctx.session.user.role !== "ADMIN") {
    //   console.log(
    //     (ctx.session?.user.name ?? ctx.session?.user.email) +
    //       "没有权限上传怪物",
    //   );
    //   return;
    // }

    // 检查用户是否存在关联的 UserUpdate
    let userUpdate = await ctx.db.userUpdate.findUnique({
      where: { userId: ctx.session?.user.id },
    });

    // 如果不存在，创建一个新的 UserUpdate
    if (!userUpdate) {
      console.log(
        new Date().toLocaleDateString() +
          "--" +
          new Date().toLocaleTimeString() +
          "--" +
          (ctx.session?.user.name ?? ctx.session?.user.email) +
          "初次上传怪物，自动创建对应userUpdate",
      );
      userUpdate = await ctx.db.userUpdate.create({
        data: {
          userId: ctx.session?.user.id ?? "",
          // 其他 UserUpdate 的属性，根据实际情况填写
        },
      });
    }

    console.log(
      new Date().toLocaleDateString() +
        "--" +
        new Date().toLocaleTimeString() +
        "--" +
        (ctx.session?.user.name ?? ctx.session?.user.email) +
        "上传了Crystal: " +
        input.name,
    );

    // 输入内容拆分成4个表的数据
    const { rates: ratesInput, modifiersList: modifiersListInput, ...crystalInput } = input;

    return prisma.$transaction(async () => {
      const crystal = await ctx.db.crystal.update({
        where: { id: input.id },
        data: {
          ...crystalInput,
          modifiersList: undefined,
          rates: undefined,
        },
        include: {
          rates: true,
        },
      });

      const modifiersList = await ctx.db.modifiersList.update({
        where: { id: input.modifiersListId },
        data: {
          ...modifiersListInput,
          modifiers: undefined,
        },
      });

      const {modifiers: modifiersInput} = modifiersListInput

      const modifiers = modifiersInput.map(async (modifier) => {
        return await ctx.db.modifier.update({
          where: { id: modifier.id },
          data: {
            ...modifier,
          },
        });
      });

      const rates = ratesInput.map(async (rateInput) => {
        return await ctx.db.rate.update({
          where: { id: rateInput.id },
          data: {
            ...rateInput,
          },
        });
      });

      console.log(
        new Date().toLocaleDateString() +
          "--" +
          new Date().toLocaleTimeString() +
          "--" +
          (ctx.session?.user.name ?? ctx.session?.user.email) +
          "上传了Crystal: " +
          input.name,
      );

      return {
        ...crystal,
        modifiersList: {
          ...modifiersList,
          modifiers: await Promise.all(modifiers),
        },
        rates: await Promise.all(rates),
      };
    });
  }),
});
