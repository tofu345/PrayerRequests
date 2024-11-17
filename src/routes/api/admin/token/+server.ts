import { newToken } from "$lib/jwt";
import { verifyAdminPassword } from "$lib/prisma";
import { error as errorRes, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async function({ request }) {
    const data = await request.json();
    if (
        data.email &&
        data.password &&
        (await verifyAdminPassword(data.email, data.password))
    ) {
        let token = newToken(data.email);
        return json({ token });
    }
    return errorRes(400, "invalid post data");
}
