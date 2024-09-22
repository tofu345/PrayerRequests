import { verifyToken } from "$lib/jwt";

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    const token = event.cookies.get("token");
    if (token) {
        const email = verifyToken(token);
        if (email) {
            event.locals.admin = email;
        }
    }

    const response = await resolve(event);
    return response;
}
