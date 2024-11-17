import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = function({ locals }) {
    if (locals.admin) {
        redirect(302, "/");
    }
}
