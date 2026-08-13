import { json } from "@sveltejs/kit";
import { getPosts } from "$lib/server/prisma";

export async function GET() {
    let posts = await getPosts();
    return json(posts);
}
