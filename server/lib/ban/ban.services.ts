import MasterServices from "../master/master.services";
import { sendError } from "../socketio/socketio.errors";

export default class BanServices extends MasterServices {
}

export function banDays(socket: GameSocket, days: number, reason?: string) {
    const now = new Date();
    const date = new Date(now.setDate(now.getDate() + days));
    ban(socket, date, reason);
}

export function banMonths(socket: GameSocket, months: number, reason?: string) {
    const now = new Date();
    const date = new Date(now.setMonth(now.getMonth() + months));
    ban(socket, date, reason);
}

export function banYears(socket: GameSocket, years: number, reason?: string) {
    const now = new Date();
    const date = new Date(now.setFullYear(now.getFullYear() + years));
    ban(socket, date, reason);
}

export function ban(socket: GameSocket, date: Date, reason?: string) {
    banUser(socket.user, date, reason);
    sendError({}, socket, getBanExplanation(socket.user), true, true);
    socket.disconnect();
}

export function banUser(user: User, date: Date, reason?: string) {
    user.banEnd = date;
    if (reason) {
        user.banReason = reason;
    }
}

export function unbanUser(user: User) {
    user.set('banEnd', undefined, {strict: false});
    user.set('banReason', undefined, {strict: false});
}

export function isBanned(user: User): boolean {
    return user.banEnd && user.banEnd > new Date();
}

export function getBanExplanation(user: User): string {
    let endTime = user.banEnd.getFullYear() > 3000 ? "the end of time" : `${user.banEnd.toLocaleDateString()}`;
    let reason = user.banReason || "suspicious activity";
    return `You are banned for ${reason} until ${endTime}.`;
}