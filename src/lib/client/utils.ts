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
