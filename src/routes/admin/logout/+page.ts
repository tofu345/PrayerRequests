import { redirect } from "@sveltejs/kit";
import { deleteCookie } from "$lib/client/cookie";
import type { PageLoad } from "./$types";

export const ssr = false;

export const load: PageLoad = function() {
    deleteCookie("token");
    redirect(302, "/");
}
