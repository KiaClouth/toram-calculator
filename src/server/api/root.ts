import { postRouter } from "~/server/api/routers/post";
import { monsterRouter } from "~/server/api/routers/monster"
import { characterRouter } from "~/server/api/routers/character"
import { userRouter } from "./routers/user";
import { analyzerRouter } from "./routers/analyzer";

import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  monster: monsterRouter,
  character: characterRouter,
  user: userRouter,
  analyzer: analyzerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
