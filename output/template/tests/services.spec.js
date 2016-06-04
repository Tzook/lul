'use strict';
let expect = require("chai").expect, TemplateServices = require("../../lib/template/template.services.js"), TemplateModel = require("../../lib/template/template.model.js"), TemplateDataMock = new (require("./mocks/template.data.mock.js"))(), ResMock = require("../mocks/res.mock.js"), res, services, model;
model = new TemplateModel();
model.init();
beforeEach(() => {
    services = new TemplateServices();
    services.init({ model: model });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZXMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci90ZW1wbGF0ZS90ZXN0cy9zZXJ2aWNlcy5zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQ2xDLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyx5Q0FBeUMsQ0FBQyxFQUNyRSxhQUFhLEdBQUcsT0FBTyxDQUFDLHNDQUFzQyxDQUFDLEVBQy9ELGdCQUFnQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQyxFQUFFLEVBQ25FLE9BQU8sR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsRUFDekMsR0FBRyxFQUNILFFBQVEsRUFDUixLQUFLLENBQUM7QUFFUCxLQUFLLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztBQUM1QixLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixVQUFVLENBQUM7SUFDVixRQUFRLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0lBQ2xDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQyxPQUFBLEtBQUssRUFBQyxDQUFDLENBQUM7QUFDeEIsQ0FBQyxDQUFDLENBQUMifQ==