'use strict';
let expect = require("chai").expect, TemplateMiddleware = require("../../lib/template/template.middleware.js"), TemplateServicesMock = require("./mocks/template.services.mock.js"), TemplateDataMock = new (require("./mocks/template.data.mock.js"))(), LOGS = require("../../lib/template/template.config.json").LOGS, ResMock = require("../mocks/res.mock.js"), res, middleware, services;
beforeEach(() => {
    res = new ResMock();
});
middleware = new TemplateMiddleware();
services = new TemplateServicesMock();
middleware.init({ services: services, config: { LOGS: LOGS } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL3RlbXBsYXRlL3Rlc3RzL21pZGRsZXdhcmUuc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFDYixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUNsQyxrQkFBa0IsR0FBRyxPQUFPLENBQUMsMkNBQTJDLENBQUMsRUFDekUsb0JBQW9CLEdBQUcsT0FBTyxDQUFDLG1DQUFtQyxDQUFDLEVBQ25FLGdCQUFnQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQyxFQUFFLEVBQ25FLElBQUksR0FBRyxPQUFPLENBQUMseUNBQXlDLENBQUMsQ0FBQyxJQUFJLEVBQzlELE9BQU8sR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsRUFDekMsR0FBRyxFQUNILFVBQVUsRUFDVixRQUFRLENBQUM7QUFFVixVQUFVLENBQUM7SUFDVixHQUFHLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUNyQixDQUFDLENBQUMsQ0FBQztBQUNILFVBQVUsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7QUFDdEMsUUFBUSxHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQztBQUN0QyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUMsVUFBQSxRQUFRLEVBQUUsTUFBTSxFQUFFLEVBQUMsTUFBQSxJQUFJLEVBQUMsRUFBQyxDQUFDLENBQUMifQ==