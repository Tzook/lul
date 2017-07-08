Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
const common_1 = require("../common");
function createParty(b = built_1.browser) {
    b.executeScript(`socket.emit("create_party", {});`);
    common_1.expectText("create_party", b);
}
exports.createParty = createParty;
function leaveParty(b = built_1.browser) {
    b.executeScript(`socket.emit("leave_party", {});`);
    common_1.expectText("actor_leave_party", b);
}
exports.leaveParty = leaveParty;
function inviteToParty(leaderB, otherB, otherName) {
    leaderB.executeScript(`socket.emit("invite_to_party", {char_name: "${otherName}"});`);
    common_1.expectText("party_invitation", otherB);
}
exports.inviteToParty = inviteToParty;
function acceptPartyInvitation(leaderB, otherB, leaderName) {
    otherB.executeScript(`socket.emit("join_party", {leader_name: "${leaderName}"});`);
    common_1.expectText("known_info", otherB, false);
    common_1.expectText("actor_join_party", otherB, false);
    common_1.expectText("party_members", otherB);
    common_1.expectText("known_info", leaderB, false);
    common_1.expectText("actor_join_party", leaderB);
}
exports.acceptPartyInvitation = acceptPartyInvitation;
function joinParty(leaderB, otherB, leaderName, otherName) {
    inviteToParty(leaderB, otherB, otherName);
    acceptPartyInvitation(leaderB, otherB, leaderName);
}
exports.joinParty = joinParty;
function changeLeader(leaderB, otherB, otherName) {
    leaderB.executeScript(`socket.emit("change_party_leader", {char_name: "${otherName}"});`);
    common_1.expectText("actor_lead_party", otherB);
    common_1.expectText("actor_lead_party", leaderB);
}
exports.changeLeader = changeLeader;
function kickFromParty(leaderB, otherB, otherName) {
    leaderB.executeScript(`socket.emit("kick_from_party", {char_name: "${otherName}"});`);
    common_1.expectText("actor_kicked_from_party", otherB);
    common_1.expectText("actor_kicked_from_party", leaderB);
}
exports.kickFromParty = kickFromParty;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFydHkuY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3BlY3MvcGFydHkvcGFydHkuY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0Q0FBMkM7QUFDM0Msc0NBQXVDO0FBRXZDLHFCQUE0QixDQUFDLEdBQUcsZUFBTztJQUNuQyxDQUFDLENBQUMsYUFBYSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7SUFDcEQsbUJBQVUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUhELGtDQUdDO0FBRUQsb0JBQTJCLENBQUMsR0FBRyxlQUFPO0lBQ2xDLENBQUMsQ0FBQyxhQUFhLENBQUMsaUNBQWlDLENBQUMsQ0FBQztJQUNuRCxtQkFBVSxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFIRCxnQ0FHQztBQUVELHVCQUE4QixPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVM7SUFDcEQsT0FBTyxDQUFDLGFBQWEsQ0FBQywrQ0FBK0MsU0FBUyxNQUFNLENBQUMsQ0FBQztJQUN0RixtQkFBVSxDQUFDLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzNDLENBQUM7QUFIRCxzQ0FHQztBQUVELCtCQUFzQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVU7SUFDN0QsTUFBTSxDQUFDLGFBQWEsQ0FBQyw0Q0FBNEMsVUFBVSxNQUFNLENBQUMsQ0FBQztJQUNuRixtQkFBVSxDQUFDLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDeEMsbUJBQVUsQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDOUMsbUJBQVUsQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDcEMsbUJBQVUsQ0FBQyxZQUFZLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3pDLG1CQUFVLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDNUMsQ0FBQztBQVBELHNEQU9DO0FBRUQsbUJBQTBCLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVM7SUFDNUQsYUFBYSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDMUMscUJBQXFCLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBSEQsOEJBR0M7QUFFRCxzQkFBNkIsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTO0lBQ25ELE9BQU8sQ0FBQyxhQUFhLENBQUMsbURBQW1ELFNBQVMsTUFBTSxDQUFDLENBQUM7SUFDMUYsbUJBQVUsQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN2QyxtQkFBVSxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzVDLENBQUM7QUFKRCxvQ0FJQztBQUVELHVCQUE4QixPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVM7SUFDcEQsT0FBTyxDQUFDLGFBQWEsQ0FBQywrQ0FBK0MsU0FBUyxNQUFNLENBQUMsQ0FBQztJQUN0RixtQkFBVSxDQUFDLHlCQUF5QixFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzlDLG1CQUFVLENBQUMseUJBQXlCLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDbkQsQ0FBQztBQUpELHNDQUlDIn0=