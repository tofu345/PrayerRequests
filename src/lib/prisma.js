import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
/** @type {{ id: number, content: string, createdAt: Date }[] | null} */
let cache = null;

export function clearCache() {
    cache = null;
}

export async function getPosts() {
    if (cache != null) {
        return cache;
    }

    cache = await prisma.post.findMany();
    return cache;
}

/** @param {string} content */
export async function createPost(content) {
    clearCache();
    return prisma.post.create({ data: { content: content } });
}

// async function main() {
// }

// main()
//     .then(async () => {
//         await prisma.$disconnect();
//     })
//     .catch(async (e) => {
//         console.error(e);
//         await prisma.$disconnect();
//         process.exit(1);
//     });
