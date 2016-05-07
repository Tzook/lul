'use strict';
let expect 			 = require("chai").expect,
	UserController 	 = require("../../lib/user/user.controller.js"),
	LOGS 			 = require("../../lib/user/user.config.json").LOGS,
	UserServicesMock = require("./mocks/user.services.mock.js"),
	UserDataMock 	 = new (require("./mocks/user.data.mock.js"))(),
	ResMock			 = require("../mocks/res.mock.js"),
	res,
	controller,
	services;
 
beforeEach(() => {
	res = new ResMock();
});
controller = new UserController();
services = new UserServicesMock();
controller.init({services, config: {LOGS}});

describe("sendUser", () => {
 	it('should send the user successfully without its password', () => {
		let req = {user: UserDataMock.validUser};
		controller.sendUser(req, res);
        expect(res.popLatestData()).to.deep.equal({data: UserDataMock.passwordlessUser, code: LOGS.USER_SESSION_OK.CODE, msg: LOGS.USER_SESSION_OK.MSG});
	});
});

// TODO performLogin
// TODO performLogout
      // , sessionID: 1
	    // expect(req.user['unicorn']).to.equal(1);
describe("serializeUser", () => {
 	it('should proccess the username and push it over out of the entire user object', () => {
		let user = UserDataMock.validUser;
		controller.serializeUser(user, res.done);
        expect(res.popLatestData()).to.equal(user.username);
	});
});
    
describe("deserializeUser", () => {
 	it('should deserialize a user from just username to entire user', () => {
		let username = UserDataMock.validUser.username;
		return controller.deserializeUser(username, res.done)
		.then(() => {
			expect(res.popLatestData()).to.deep.equal(UserDataMock.validUser);
		});
	});
	
	it('should return false if username was not found', () => {
		let username = UserDataMock.badUsername;
		return controller.deserializeUser({username}, res.done)
		.then(() => {
			expect(res.popLatestData()).to.equal(false);
		});
	});
});    
    
describe("handleNewUser", () => {
 	it('should register a new user, and procceed', () => {
		let req = {body: UserDataMock.validUser};
		return controller.handleNewUser(req, res, res.next)
		.then(() => {
			expect(req.body.user).to.deep.equal(UserDataMock.validUser);
			expect(res.popLatestData()).to.equal("next");
		});
	});
});