import { error as errorRes, json, type RequestHandler } from "@sveltejs/kit";
import { Prisma as PrismaObj } from "@prisma/client";
import Prisma from "@prisma/client";
import Joi from "joi";

import { editableExists } from "$lib/editable";
import { editPost } from "$lib/prisma";

const schema = Joi.object({
    id: Joi.string(), // not required to allow admin to edit everything
    postId: Joi.number().required(),
    text: Joi.string().max(280).required(),
    postType: Joi.string()
        .valid(...Object.values(Prisma.PostType))
        .required(),
});

export const POST: RequestHandler = async function ({ request, locals }) {
    const data = await request.json();
    let { error, value } = schema.validate({
        id: data.id,
        postId: data.postId,
        text: data.text,
        postType: data.postType,
    });
    if (error !== undefined) {
        return errorRes(400, error.details.map((v) => v.message).join("\n"));
    }

    if (locals.admin || data.id || editableExists(data.id)) {
        let post = null;
        try {
            post = await editPost(value.postId, value.text, value.postType);
        } catch (e) {
            if (e instanceof PrismaObj.PrismaClientKnownRequestError) {
                return errorRes(400, e);
            }
            throw e;
        }

        return json({ post });
    }
    return errorRes(401, "unauthorized");
};
