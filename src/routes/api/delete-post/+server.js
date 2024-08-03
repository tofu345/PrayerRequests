import { deletePost } from "$lib/prisma";
import { error as errorRes, json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const data = await request.json();
    if (!data.id) {
        return errorRes(400, "invalid post data");
    }

    let deletedPost = await deletePost(data.id);
    return json(deletedPost);
}
