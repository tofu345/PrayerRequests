import { json } from "@sveltejs/kit";
import { lastChange } from "$lib/server/prisma";

export async function GET() {
    return json(lastChange);
}
