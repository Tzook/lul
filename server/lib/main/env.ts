import { Request } from "express";

export function isLocal(): boolean {
    return !isStaging() && !isProduction();
}

export function isStaging(): boolean {
    return process.env.NODE_ENV === "staging";
}

export function isProduction(): boolean {
    return process.env.NODE_ENV === "production";
}

export function isSecure(req: Request): boolean {
    return req.headers["x-forwarded-proto"] === "https";
}

export function getEnvVariable(key: string): string {
    return process.env[key] ? process.env[key] : require("../../../config/.env.json")[key];
}
