// Editable
//
// A way for clients to submit updates to posts made recently without requiring
// sign-in.  When a post is created an `editId` is generated and stored on the
// server and client, which is required by the edit-post API.  It is valid
// until the server is shutdown (since this is hosted for free on vercel).

// TODO: expiry date
export let editIds: Map<number, string> = new Map();

export function newEditId(): string {
    let id = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?-=[];',./`~";
    for (let i = 0; i < 32; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
}
