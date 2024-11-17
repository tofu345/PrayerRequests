export function setCookie(name: string, value: string, daysToLive: number) {
    const date = new Date();
    // Convert date to milliseconds
    date.setTime(date.getTime() + daysToLive * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
}

export function deleteCookie(name: string) {
    const date = new Date();
    document.cookie = `${name}=; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
}
