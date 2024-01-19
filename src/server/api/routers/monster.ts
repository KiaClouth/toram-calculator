// import { z } from "zod";

import {
    createTRPCRouter,
    // protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const monsterRouter = createTRPCRouter({
    getMonsterList: publicProcedure.query(({ ctx }) => {
        return ctx.db.monster.findMany();
    }),
});
