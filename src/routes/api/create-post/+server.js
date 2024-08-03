import { createPost } from "$lib/prisma";
import { error as errorRes, json } from "@sveltejs/kit";
import { Prisma } from "@prisma/client";
import Joi from "joi";

const postSchema = Joi.string().max(100).required();

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const data = await request.json();
    if (!data.content) {
        return errorRes(400, "invalid post data");
    }

    let { error, value } = postSchema.validate(data.content.trim());
    if (error !== undefined) {
        return errorRes(400, error.details.map((v) => v.message).join("\n"));
    }

    let obj = null;
    try {
        obj = await createPost(value);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return errorRes(400, e);
        }
        throw e;
    }

    return json(obj);
}
