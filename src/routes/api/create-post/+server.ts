import { error as errorRes, json, type RequestHandler } from "@sveltejs/kit";
import Joi from "joi";

import { Prisma as PrismaObj } from "@prisma/client";
import Prisma from "@prisma/client";

import { createPost } from "$lib/server/prisma";
import { maxTextLength } from "$lib/client/constants";
import { editIds, newEditId } from "$lib/server/editable";

const postSchema = Joi.object({
    text: Joi.string().min(3).max(maxTextLength).required(),
    postType: Joi.string()
        .valid(...Object.values(Prisma.PostType))
        .required(),
});

export const POST: RequestHandler = async function ({ request }) {
    const data = await request.json();
    let { error, value } = postSchema.validate({
        text: data.text,
        postType: data.postType,
    });
    if (error !== undefined) {
        return errorRes(400, error.details.map((v) => v.message).join("\n"));
    }

    let post = null;
    try {
        post = await createPost(value.text, value.postType);
    } catch (e) {
        if (e instanceof PrismaObj.PrismaClientKnownRequestError) {
            return errorRes(400, e);
        }
        throw e;
    }

    // store editId on server and send to client
    let editId = newEditId();
    editIds.set(post.id, editId);
    return json({ post, editId });
};
