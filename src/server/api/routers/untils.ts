export async function findOrCreateUserEntry<T>(
  model: "userCreate" | "userUpdate",
  userId: string,
  ctx: any,
): Promise<T> {
  // 尝试查找用户关联的记录
  let userEntry = await ctx.db[model].findUnique({
    where: { userId: userId },
  });

  // 如果不存在，创建新的记录
  if (!userEntry) {
    console.log(
      `${new Date().toLocaleDateString()}--${new Date().toLocaleTimeString()}--${ctx.session?.user.name ?? ctx.session?.user.email} 初次上传内容，自动创建对应${model}`,
    );
    userEntry = await ctx.db[model].create({
      data: {
        userId: userId,
        // 其他属性，根据实际情况填写
      },
    });
  }

  return userEntry;
}
