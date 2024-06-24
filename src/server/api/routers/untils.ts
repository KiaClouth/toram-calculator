import { type UserCreate, type Prisma, type PrismaClient } from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";
import { type Session } from "next-auth";

export async function findOrCreateUserCreateData(
  userId: string,
  ctx: {
    session: Session | null;
    headers: Headers;
    db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  },
): Promise<UserCreate> {
  // 尝试查找用户关联的记录
  let userEntry = await ctx.db.userCreate.findUnique({
    where: { userId: userId },
  });

  // 如果不存在，创建新的记录
  if (!userEntry) {
    console.log(
      `${new Date().toLocaleDateString()}--${new Date().toLocaleTimeString()}--${ctx.session?.user.name ?? ctx.session?.user.email} 初次上传内容，自动创建对应UserCreate`,
    );
    userEntry = await ctx.db.userCreate.create({
      data: {
        userId: userId,
        // 其他属性，根据实际情况填写
      },
    });
  }

  return userEntry;
}

export async function findOrCreateUserUpateData(
  userId: string,
  ctx: {
    session: Session | null;
    headers: Headers;
    db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  },
): Promise<UserCreate> {
  // 尝试查找用户关联的记录
  let userEntry = await ctx.db.userCreate.findUnique({
    where: { userId: userId },
  });

  // 如果不存在，创建新的记录
  if (!userEntry) {
    console.log(
      `${new Date().toLocaleDateString()}--${new Date().toLocaleTimeString()}--${ctx.session?.user.name ?? ctx.session?.user.email} 初次上传内容，自动创建对应UserUpdate`,
    );
    userEntry = await ctx.db.userCreate.create({
      data: {
        userId: userId,
        // 其他属性，根据实际情况填写
      },
    });
  }

  return userEntry;
}
