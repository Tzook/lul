'use strict';
let expect = require("chai").expect, Model = new (require("../../lib/template/template.model.js"))(), TemplateDataMock = new (require("./mocks/template.data.mock.js"))();
Model.init();
Model.createModel();
Model = Model.getModel();
describe("Template schema", () => {
    it('should have a valid template object', () => {
        let validTemplate = TemplateDataMock.validTemplate;
        let schemadTemplate = new Model(validTemplate);
        for (let i in validTemplate) {
            expect(validTemplate[i]).to.deep.equal(schemadTemplate[i]);
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci90ZW1wbGF0ZS90ZXN0cy9tb2RlbC5zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQ2xDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLHNDQUFzQyxDQUFDLENBQUMsRUFBRSxFQUMvRCxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLCtCQUErQixDQUFDLENBQUMsRUFBRSxDQUFDO0FBRXJFLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNiLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNwQixLQUFLLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBRXpCLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtJQUMxQixFQUFFLENBQUMscUNBQXFDLEVBQUU7UUFDMUMsSUFBSSxhQUFhLEdBQUcsZ0JBQWdCLENBQUMsYUFBYSxDQUFDO1FBQ25ELElBQUksZUFBZSxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQy9DLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDN0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVELENBQUM7SUFDRixDQUFDLENBQUMsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDIn0=