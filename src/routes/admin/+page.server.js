import { redirect } from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export function load() {
    redirect(302, "/admin/login");
}
