import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // const users = await prisma.admin.findMany();
    // console.log(users);
    // const posts = await prisma.post.findMany();
    // console.log(posts);
}

export async function getPosts() {
    return prisma.post.findMany();
}

/** @param {string} content */
export async function createPost(content) {
    return prisma.post.create({ data: { content: content } });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
