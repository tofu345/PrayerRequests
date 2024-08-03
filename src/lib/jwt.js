import { JWT_SECRET } from "$env/static/private";

import jwt from "jsonwebtoken";

/**
 * @param {string} email
 * @returns {string}
 * */
export function newToken(email) {
    var token = jwt.sign({ email }, JWT_SECRET, {
        expiresIn: "1d",
        issuer: "prayer-requests",
    });

    return token;
}

/**
 * @param {string} token
 * @returns {string | null}
 * */
export function verifyToken(token) {
    try {
        var data = jwt.verify(token, JWT_SECRET, { issuer: "prayer-requests" });
        if (typeof data !== 'string') {
            return data.email;
        }
    } catch (e) {}

    return null;
}
