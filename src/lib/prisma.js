import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
/** @type {{ id: number, content: string, createdAt: Date }[] | null} */
let cache = null;

export function clearCache() {
    cache = null;
}

/** @returns {Date} */
export function secondToTheLastSunday() {
    let date = new Date();
    date.setDate(date.getDate() - date.getDay() - 7);
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
