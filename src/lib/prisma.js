import { PrismaClient } from "@prisma/client";

import * as bcrypt from "bcrypt";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "$env/static/private";
const saltRounds = 10;

const prisma = new PrismaClient();

/** @type {import('@prisma/client').Post[] | null} */
let cache = null;

export function clearCache() {
    cache = null;
}

/** @returns {Date} */
export function startOfLastWeek() {
    let date = new Date();
    date.setDate(date.getDate() - date.getDay() - 13);
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    return date;
}

export async function getPosts() {
    if (cache != null) {
        return cache;
    }

    let deletedPosts = await prisma.post.deleteMany({
        where: { createdAt: { lt: startOfLastWeek() } },
    });
    if (deletedPosts.count > 0) {
        console.log(`> Deleted ${deletedPosts.count} old posts`);
    }

    cache = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
    return cache;
}

/**
 * @param {string} text
 * @param {boolean} is_prayer_request
 */
export async function createPost(text, is_prayer_request) {
    clearCache();
    return prisma.post.create({
        data: {
            text: text,
            is_prayer_request: is_prayer_request,
        },
    });
}

/** @param {number} id */
export async function deletePost(id) {
    clearCache();
    return prisma.post.deleteMany({ where: { id } });
}

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<boolean>}
 */
export async function verifyAdminPassword(email, password) {
    const admin = await getAdmin(email);
    if (admin === null) {
        return false;
    }

    return await bcrypt.compare(password, admin.password);
}

/**
 * @param {string} email
 * @returns {Promise<import('@prisma/client').Admin | null>}
 */
export async function getAdmin(email) {
    return prisma.admin.findFirst({ where: { email } });
}

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('@prisma/client').Admin>}
 */
async function createAdmin(email, password) {
    const hash = await bcrypt.hash(password, saltRounds);
    const admin = await prisma.admin.create({
        data: { email, password: hash },
    });
    return admin;
}

async function main() {
    let admins = await prisma.admin.count();
    if (admins === 0 && ADMIN_EMAIL && ADMIN_PASSWORD) {
        createAdmin(ADMIN_EMAIL, ADMIN_PASSWORD);
    }
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
