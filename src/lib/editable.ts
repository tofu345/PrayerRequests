// *Editables*
//
// A way for clients to submit updates to posts made recently without requiring
// sign-in.  When a post is created an `editId` is generated and stored on the
// server and client, which is required by the edit-post API.  It is valid
// until the page is refreshed (since I don't use local storage) or the server
// is shutdown (since this is hosted for free on vercel).
//
// TODO: expiry date
export let editables: {
    editId: string;
    postId: number;
}[] = [];

export function editable(postId: number): boolean {
    return editables.find((el) => el.postId == postId) !== undefined;
}

const idLength = 32; // good luck brute forcing this haha :>
export function makeEditId(): string {
    let newId = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?-=[];',./`~";
    for (let i = 0; i < idLength; i++) {
        newId += characters.charAt(
            Math.floor(Math.random() * characters.length),
        );
    }
    return editables.find((el) => el.editId == newId) ? makeEditId() : newId;
}
