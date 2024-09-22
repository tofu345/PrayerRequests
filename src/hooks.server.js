import { deleteOldPosts } from "$lib/prisma";
import { CronJob } from "cron";
import { verifyToken } from "$lib/jwt";

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    const token = event.cookies.get("token");
    if (token) {
        const email = verifyToken(token);
        if (email) {
            event.locals.admin = email;
        }
    }

    const response = await resolve(event);
    return response;
}

// console.log("> init cron worker");
// CronJob.from({
//     cronTime: "* * * * *", // “At 13:30 on Sunday.”
//     // cronTime: "30 13 * * 0", // “At 13:30 on Sunday.”
//     onTick: async function () {
//         let deletedPosts = await deleteOldPosts();
//         if (deletedPosts.count > 0) {
//             console.log(`> Deleted ${deletedPosts.count} old posts`);
//         }
//     },
//     start: true,
//     timeZone: "Europe/London",
// });
