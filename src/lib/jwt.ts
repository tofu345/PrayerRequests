import { JWT_SECRET } from "$env/static/private";

import jwt from "jsonwebtoken";

export function newToken(email: string): string {
    var token = jwt.sign({ email }, JWT_SECRET, {
        expiresIn: "1d",
        issuer: "prayer-requests",
    });

    return token;
}

export function verifyToken(token: string): string | null {
    try {
        var data = jwt.verify(token, JWT_SECRET, { issuer: "prayer-requests" });
        if (typeof data !== 'string') {
            return data.email;
        }
    } catch (e) {}

    return null;
}
