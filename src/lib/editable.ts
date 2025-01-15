export let editables: { id: string; postId: number }[] = [];

export function newEditable(postId: number): string {
    let editId = makeId();
    editables.push({ id: editId, postId: postId });
    return editId;
}

export function editableExists(id: string): boolean {
    for (const el of editables) {
        if (el.id === id) return true;
    }
    return false;
}

// For editing posts, generate id and send to client after create-post request,
// client uses to update post without authentication
const idLength = 32; // good luck brute forcing this haha :>
export function makeId() {
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?-=[];',./`~";
    for (let i = 0; i < idLength; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length),
        );
    }
    return result;
}
