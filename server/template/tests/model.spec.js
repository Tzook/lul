'use strict';
let expect = require("chai").expect,
	Model = new (require("../../lib/template/template.model.js"))(),
	TemplateDataMock = new (require("./mocks/template.data.mock.js"))();
 
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