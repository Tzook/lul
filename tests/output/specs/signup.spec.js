Object.defineProperty(exports, "__esModule", { value: true });
const built_1 = require("protractor/built");
describe('signup', () => {
    beforeEach(() => {
        built_1.browser.ignoreSynchronization = true;
        built_1.browser.get('http://localhost:5000/');
    });
    it('should not allow registering without a username and a password', () => {
        built_1.element(built_1.by.id("register")).click();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbnVwLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcGVjcy9zaWdudXAuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNENBQXdEO0FBRXhELFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFDZixVQUFVLENBQUM7UUFDUCxlQUFPLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO1FBQ3JDLGVBQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztJQUMxQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxnRUFBZ0UsRUFBRTtRQUNqRSxlQUFPLENBQUMsVUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBRXZDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMifQ==