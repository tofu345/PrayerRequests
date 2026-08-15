import moment from "moment";

// Edit[able]
//
// A way for clients to submit updates to posts made recently without requiring
// sign-in.  When a post is created an `editId` is generated and stored on the
// server and client, which is required by the edit-post API.  It is valid for
// 15 minutes or until the server is shutdown (since this is hosted for free on
// vercel).

export type Edit = {
    id: string;
    expiration: Date;
};
export type Edits = Map<number, Edit>;
export let edits: Edits = new Map();

export function newEdit(): Edit {
    let id = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?-=[];',./`~";
    for (let i = 0; i < 32; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const expiration = moment(new Date()).add(15, "m").toDate();
    return { id, expiration };
}
