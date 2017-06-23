Object.defineProperty(exports, "__esModule", { value: true });
const party_common_1 = require("./party.common");
const built_1 = require("protractor/built");
const common_1 = require("../common");
describe('create party', () => {
    it('should create party successfully if not in a party', () => {
        party_common_1.createParty();
        party_common_1.leaveParty();
    });
    it('should not allow to create party if already in a party', () => {
        party_common_1.createParty();
        built_1.browser.executeScript(`socket.emit("create_party", {});`);
        common_1.expectText("Cannot create - character already in party");
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjcy9wYXJ0eS9jcmVhdGUuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaURBQXlEO0FBQ3pELDRDQUEyQztBQUMzQyxzQ0FBdUM7QUFFdkMsUUFBUSxDQUFDLGNBQWMsRUFBRTtJQUNyQixFQUFFLENBQUMsb0RBQW9ELEVBQUU7UUFDckQsMEJBQVcsRUFBRSxDQUFDO1FBQ2QseUJBQVUsRUFBRSxDQUFDO0lBQ2pCLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHdEQUF3RCxFQUFFO1FBQ3pELDBCQUFXLEVBQUUsQ0FBQztRQUNkLGVBQU8sQ0FBQyxhQUFhLENBQUMsa0NBQWtDLENBQUMsQ0FBQztRQUMxRCxtQkFBVSxDQUFDLDRDQUE0QyxDQUFDLENBQUM7SUFDN0QsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9