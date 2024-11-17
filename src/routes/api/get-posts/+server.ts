import { getPosts } from "$lib/prisma";
import { json } from "@sveltejs/kit";

export async function GET() {
    let posts = await getPosts();
    return json(posts);
}
