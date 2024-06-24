import { monsterRouter } from "~/server/api/routers/monster"
import { skillRouter } from "./routers/skill";
// import { equipmentRouter } from "./routers/equipment";
import { crystalRouter } from "./routers/crystal";
import { petRouter } from "./routers/pet";
import { characterRouter } from "~/server/api/routers/character"
import { consumableRouter } from "./routers/consumable";
import { userRouter } from "./routers/user";
import { analyzerRouter } from "./routers/analyzer";

import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  monster: monsterRouter,
  skill: skillRouter,
  // equipment: equipmentRouter,
  crystal: crystalRouter,
  pet: petRouter,
  consumable: consumableRouter,
  character: characterRouter,
  analyzer: analyzerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
