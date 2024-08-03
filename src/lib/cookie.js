/**
 * @param {string} name - cookie key
 * @param {string} value - cookie value
 * @param {number} daysToLive - daysToLive
 */
export function setCookie(name, value, daysToLive) {
    const date = new Date();
    // Convert date to milliseconds
    date.setTime(date.getTime() + daysToLive * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * @param {string} name - cookie key
 */
export function deleteCookie(name) {
    const date = new Date();
    document.cookie = `${name}=; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
}
