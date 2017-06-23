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
    common_1.expectText("actor_join_party", otherB, false);
    common_1.expectText("party_members", otherB);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFydHkuY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3BlY3MvcGFydHkvcGFydHkuY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0Q0FBMkM7QUFDM0Msc0NBQXVDO0FBRXZDLHFCQUE0QixDQUFDLEdBQUcsZUFBTztJQUNuQyxDQUFDLENBQUMsYUFBYSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7SUFDcEQsbUJBQVUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUhELGtDQUdDO0FBRUQsb0JBQTJCLENBQUMsR0FBRyxlQUFPO0lBQ2xDLENBQUMsQ0FBQyxhQUFhLENBQUMsaUNBQWlDLENBQUMsQ0FBQztJQUNuRCxtQkFBVSxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFIRCxnQ0FHQztBQUVELHVCQUE4QixPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVM7SUFDcEQsT0FBTyxDQUFDLGFBQWEsQ0FBQywrQ0FBK0MsU0FBUyxNQUFNLENBQUMsQ0FBQztJQUN0RixtQkFBVSxDQUFDLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzNDLENBQUM7QUFIRCxzQ0FHQztBQUVELCtCQUFzQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVU7SUFDN0QsTUFBTSxDQUFDLGFBQWEsQ0FBQyw0Q0FBNEMsVUFBVSxNQUFNLENBQUMsQ0FBQztJQUNuRixtQkFBVSxDQUFDLGtCQUFrQixFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM5QyxtQkFBVSxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNwQyxtQkFBVSxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzVDLENBQUM7QUFMRCxzREFLQztBQUVELG1CQUEwQixPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxTQUFTO0lBQzVELGFBQWEsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzFDLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkQsQ0FBQztBQUhELDhCQUdDO0FBRUQsc0JBQTZCLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUztJQUNuRCxPQUFPLENBQUMsYUFBYSxDQUFDLG1EQUFtRCxTQUFTLE1BQU0sQ0FBQyxDQUFDO0lBQzFGLG1CQUFVLENBQUMsa0JBQWtCLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDdkMsbUJBQVUsQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBSkQsb0NBSUM7QUFFRCx1QkFBOEIsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTO0lBQ3BELE9BQU8sQ0FBQyxhQUFhLENBQUMsK0NBQStDLFNBQVMsTUFBTSxDQUFDLENBQUM7SUFDdEYsbUJBQVUsQ0FBQyx5QkFBeUIsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM5QyxtQkFBVSxDQUFDLHlCQUF5QixFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUFKRCxzQ0FJQyJ9