import { error as errorRes, json, type RequestHandler } from "@sveltejs/kit";
import { Prisma as PrismaObj } from "@prisma/client";
import Prisma from "@prisma/client";
import Joi from "joi";

import { editPost } from "$lib/server/prisma";
import { maxTextLength } from "$lib/client/constants";
import { editIds } from "$lib/server/editable";

const schema = Joi.object({
    editId: Joi.string(), // not required here to allow admin to edit everything
    postId: Joi.number().required(),
    text: Joi.string().min(3).max(maxTextLength).required(),
    postType: Joi.string()
        .valid(...Object.values(Prisma.PostType))
        .required(),
});

export const POST: RequestHandler = async function ({ request, locals }) {
    const data = await request.json();
    let { error, value } = schema.validate({
        editId: data.editId,
        postId: data.postId,
        text: data.text,
        postType: data.postType,
    });
    if (error !== undefined) {
        return errorRes(400, error.details.map((v) => v.message).join("\n"));
    }

    const storedEditId = editIds.get(value.postId);
    if (locals.admin || storedEditId == value.editId) {
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
