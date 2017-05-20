Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
const common_1 = require("../common");
function wearEquip() {
    built_1.browser.executeScript(`socket.emit("equipped_item", {from: 0, to: "legs"});`);
    common_1.expectText("actor_equip_item");
}
exports.wearEquip = wearEquip;
function unwearEquip() {
    built_1.browser.executeScript(`socket.emit("unequipped_item", {from: "legs", to: 0});`);
    common_1.expectText("actor_unequip_item");
}
exports.unwearEquip = unwearEquip;
function dropEquip(clear = true) {
    built_1.browser.executeScript(`socket.emit("dropped_equip", {slot: "legs"});`);
    common_1.expectText("actor_delete_equip", built_1.browser, clear);
}
exports.dropEquip = dropEquip;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXF1aXBzLmNvbW1vbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NwZWNzL2VxdWlwcy9lcXVpcHMuY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0Q0FBMkM7QUFDM0Msc0NBQXVDO0FBRXZDO0lBQ0ksZUFBTyxDQUFDLGFBQWEsQ0FBQyxzREFBc0QsQ0FBQyxDQUFBO0lBQzdFLG1CQUFVLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBSEQsOEJBR0M7QUFFRDtJQUNJLGVBQU8sQ0FBQyxhQUFhLENBQUMsd0RBQXdELENBQUMsQ0FBQTtJQUMvRSxtQkFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDckMsQ0FBQztBQUhELGtDQUdDO0FBRUQsbUJBQTBCLEtBQUssR0FBRyxJQUFJO0lBQ2xDLGVBQU8sQ0FBQyxhQUFhLENBQUMsK0NBQStDLENBQUMsQ0FBQTtJQUN0RSxtQkFBVSxDQUFDLG9CQUFvQixFQUFFLGVBQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNyRCxDQUFDO0FBSEQsOEJBR0MifQ==