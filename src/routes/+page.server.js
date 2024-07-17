import { getPosts } from '$lib/prisma';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({params}) => {
    let posts = await getPosts();
    return { posts };
};
