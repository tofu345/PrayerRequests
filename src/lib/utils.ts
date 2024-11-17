export type EventCallback = (name: Event) => any;

export function preventDefault(handler: EventCallback) {
    return (e: SubmitEvent) => {
        e.preventDefault();
        handler(e);
    };
}
