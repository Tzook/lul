import { browser } from 'protractor/built';
import { expectText } from '../common';

export function createParty(b = browser) {
    b.executeScript(`socket.emit("create_party", {});`);
    expectText("create_party", b);
}

export function leaveParty(b = browser) {
    b.executeScript(`socket.emit("leave_party", {});`);
    expectText("actor_leave_party", b);
}

export function inviteToParty(leaderB, otherB, otherName) {
    leaderB.executeScript(`socket.emit("invite_to_party", {char_name: "${otherName}"});`);
    expectText("party_invitation", otherB);
}

export function acceptPartyInvitation(leaderB, otherB, leaderName) {
    otherB.executeScript(`socket.emit("join_party", {leader_name: "${leaderName}"});`);
    expectText("actor_join_party", otherB, false);
    expectText("party_members", otherB);
    expectText("actor_join_party", leaderB);
}

export function joinParty(leaderB, otherB, leaderName, otherName) {
    inviteToParty(leaderB, otherB, otherName);
    acceptPartyInvitation(leaderB, otherB, leaderName);
}

export function changeLeader(leaderB, otherB, otherName) {
    leaderB.executeScript(`socket.emit("change_party_leader", {char_name: "${otherName}"});`);
    expectText("actor_lead_party", otherB);
    expectText("actor_lead_party", leaderB);
}

export function kickFromParty(leaderB, otherB, otherName) {
    leaderB.executeScript(`socket.emit("kick_from_party", {char_name: "${otherName}"});`);
    expectText("actor_kicked_from_party", otherB);
    expectText("actor_kicked_from_party", leaderB);
}