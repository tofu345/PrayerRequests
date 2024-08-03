import { getPosts } from "$lib/prisma";

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
    let posts = await getPosts();
    return { posts, admin: locals.admin };
};
