import { deleteOldPosts } from "$lib/prisma";
import { CronJob } from "cron";

console.log("> init worker");
CronJob.from({
    cronTime: "30 13 * * 0", // “At 13:30 on Sunday.”
    onTick: async function () {
        let deletedPosts = await deleteOldPosts();
        if (deletedPosts.count > 0) {
            console.log(`> Deleted ${deletedPosts.count} old posts`);
        }
    },
    start: true,
    timeZone: "Europe/London",
});
