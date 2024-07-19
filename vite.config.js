import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

// a very terrible way of doing things but it works. i hope...
//
// import { PrismaClient } from "@prisma/client";
// import { CronJob } from "cron";
// const prisma = new PrismaClient();
// CronJob.from({
//     cronTime: "30 13 * * 0", // “At 13:30 on Sunday.”
//     onTick: async function () {
//         // delete all posts
//         await prisma.post.deleteMany({});
//     },
//     start: true,
//     timeZone: "Europe/London",
// });

export default defineConfig({
    plugins: [sveltekit()],
});
