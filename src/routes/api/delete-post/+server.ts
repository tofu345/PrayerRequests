import { deletePost } from "$lib/prisma";
import { error as errorRes, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async function({ request, locals }) {
    if (!locals.admin) {
        return errorRes(401, "unauthorized");
    }

    const data = await request.json();
    if (!data.id) {
        return errorRes(400, "invalid post data");
    }

    let deletedPost = await deletePost(data.id);
    return json(deletedPost);
}
