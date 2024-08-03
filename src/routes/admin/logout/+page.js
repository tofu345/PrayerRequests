import { redirect } from "@sveltejs/kit";
import { deleteCookie } from "$lib/cookie";

export const ssr = false;

/** @type {import('./$types').PageLoad} */
export function load() {
    deleteCookie("token");
    redirect(302, "/");
}
