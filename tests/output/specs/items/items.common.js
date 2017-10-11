Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
const common_1 = require("../common");
function pickItem() {
    getItemId().then(itemId => {
        built_1.browser.executeScript(`socket.emit("picked_item", {item_id: "${itemId}"});`);
        common_1.expectText("actor_pick_item");
    });
}
exports.pickItem = pickItem;
function getItemId() {
    return common_1.getChat().then(chat => {
        let [, itemId] = chat.match(/"item_id": "(item-[0-9]*)"/);
        return itemId;
    });
}
exports.getItemId = getItemId;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMuY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3BlY3MvaXRlbXMvaXRlbXMuY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0Q0FBMkM7QUFDM0Msc0NBQWdEO0FBRWhEO0lBQ0ksU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ3RCLGVBQU8sQ0FBQyxhQUFhLENBQUMseUNBQXlDLE1BQU0sTUFBTSxDQUFDLENBQUE7UUFDNUUsbUJBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ2xDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUxELDRCQUtDO0FBRUQ7SUFDSSxNQUFNLENBQUMsZ0JBQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN6QixJQUFJLENBQUMsRUFBRSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFDMUQsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFMRCw4QkFLQyJ9