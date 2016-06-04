'use strict';
let expect = require("chai").expect, TemplateController = require("../../lib/template/template.controller.js"), TemplateServicesMock = require("./mocks/template.services.mock.js"), TemplateDataMock = new (require("./mocks/template.data.mock.js"))(), LOGS = require("../../lib/template/template.config.json").LOGS, ResMock = require("../mocks/res.mock.js"), res, controller, services;
beforeEach(() => {
    res = new ResMock();
});
controller = new TemplateController();
services = new TemplateServicesMock();
controller.init({ services: services, config: { LOGS: LOGS } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbGxlci5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL3RlbXBsYXRlL3Rlc3RzL2NvbnRyb2xsZXIuc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFDYixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUNsQyxrQkFBa0IsR0FBRyxPQUFPLENBQUMsMkNBQTJDLENBQUMsRUFDekUsb0JBQW9CLEdBQUcsT0FBTyxDQUFDLG1DQUFtQyxDQUFDLEVBQ25FLGdCQUFnQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQyxFQUFFLEVBQ25FLElBQUksR0FBRyxPQUFPLENBQUMseUNBQXlDLENBQUMsQ0FBQyxJQUFJLEVBQzlELE9BQU8sR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsRUFDekMsR0FBRyxFQUNILFVBQVUsRUFDVixRQUFRLENBQUM7QUFFVixVQUFVLENBQUM7SUFDVixHQUFHLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUNyQixDQUFDLENBQUMsQ0FBQztBQUNILFVBQVUsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7QUFDdEMsUUFBUSxHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQztBQUN0QyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUMsVUFBQSxRQUFRLEVBQUUsTUFBTSxFQUFFLEVBQUMsTUFBQSxJQUFJLEVBQUMsRUFBQyxDQUFDLENBQUMifQ==