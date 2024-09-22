import { deleteOldPosts } from "$lib/prisma";

export async function GET() {
    let deletedPosts = await deleteOldPosts();
    if (deletedPosts.count > 0) {
        return new Response(`> Deleted ${deletedPosts.count} old posts`);
    }
    return new Response("> No old posts to delete");
}

export const config = {
    runtime: "nodejs",
};
