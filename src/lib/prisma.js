import { PrismaClient } from "@prisma/client";
import * as Types from "$lib/types"

const prisma = new PrismaClient();

/** @type {Types.Post[] | null} */
let cache = null;

export function clearCache() {
    cache = null;
}

/** @returns {Date} */
export function secondToTheLastSunday() {
    let date = new Date();
    date.setDate(date.getDate() - date.getDay() - 14);
    return date;
}

export async function getPosts() {
    if (cache != null) {
        return cache;
    }

    cache = await prisma.post.findMany({
        where: {
            createdAt: { gt: secondToTheLastSunday() },
        },
    });
    return cache;
}

/** @param {string} content */
export async function createPost(content) {
    clearCache();
    return prisma.post.create({ data: { content: content } });
}

export async function deleteOldPosts() {
    clearCache();
    return prisma.post.deleteMany({
        where: {
            createdAt: { lt: secondToTheLastSunday() },
        },
    });
}

// async function test() {
//     // let obj = await prisma.post.create({ data: { content: "something", createdAt: new Date("Sun Jul 15 2024 14:42:24 GMT+0100 (British Summer Time)")}});
//     let posts = await prisma.post.findMany();
//     console.log("non recent:", posts.filter((v) => v.createdAt < secondToTheLastSunday()));
// }
//
// test()
//     .then(async () => {
//         await prisma.$disconnect();
//     })
//     .catch(async (e) => {
//         console.error(e);
//         await prisma.$disconnect();
//         process.exit(1);
//     });
