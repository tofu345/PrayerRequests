import { createPost } from "$lib/prisma";
import { error as errorRes, json, type RequestHandler } from "@sveltejs/kit";
import { Prisma } from "@prisma/client";
import Joi from "joi";

const postSchema = Joi.object({
    text: Joi.string().max(280).required(),
    is_prayer_request: Joi.boolean().required(),
});

export const POST: RequestHandler = async function({ request }) {
    const data = await request.json();
    let { error, value } = postSchema.validate({
        text: data.text.trim(),
        is_prayer_request: data.is_prayer_request,
    });
    if (error !== undefined) {
        return errorRes(400, error.details.map((v) => v.message).join("\n"));
    }

    let obj = null;
    try {
        obj = await createPost(value.text, value.is_prayer_request);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return errorRes(400, e);
        }
        throw e;
    }

    return json(obj);
}
