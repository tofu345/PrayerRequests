import { getPosts } from "$lib/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    let posts = await getPosts();
    return { posts, admin: locals.admin };
};
