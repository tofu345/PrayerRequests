import type Prisma from "@prisma/client";

export type EventCallback = (name: Event) => any;

export function preventDefault(handler: EventCallback) {
    return (e: SubmitEvent) => {
        e.preventDefault();
        handler(e);
    };
}

export function postTypeEmoji(postType: Prisma.PostType): string {
    switch (postType) {
        case "PrayerRequest":
            return "🙏";
        case "PraiseReport":
            return "🎉";
        default:
            return "❓";
    }
}

// TODO: For editing posts, generate id and send to client after create-post request, 
// client uses to update post without authentication, make sure to check date, should expire in 30mins-1hr
const idLength = 32; // good luck brute forcing this haha
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
