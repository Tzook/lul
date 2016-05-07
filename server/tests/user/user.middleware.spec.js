'use strict';
let expect 				= require("chai").expect,
	UserMiddleware 		= require("../../lib/user/user.middleware.js"),
	UserServicesMock 	= require("./mocks/user.services.mock.js"),
	UserDataMock 		= new (require("./mocks/user.data.mock.js"))(),
	LOGS 				= require("../../lib/user/user.config.json").LOGS,
	ResMock 			= require("../mocks/res.mock.js"),
	passport        	= require('passport'),
    LocalStrategy   	= require('passport-local').Strategy,
	res,
	middleware,
	services;
	
beforeEach(() => {
	res = new ResMock(); 
});
middleware = new UserMiddleware();
services = new UserServicesMock();
middleware.init({services, config: {LOGS}});
 
describe("hasLoginParams", () => {
	it('should put valid data only in req.body', () => {
		let req = {body: UserDataMock.validUser};
		return middleware.hasLoginParams(req, res, res.next)
		.then((d) => {
			expect(res.popLatestData()).to.equal('next');
			expect(req.body).to.deep.equal(UserDataMock.validUser);
		});
	});
});

describe("hasRegisterParams", () => {
	it('should put valid data only in req.body', () => {
		let req = {body: UserDataMock.validUser};
		return middleware.hasLoginParams(req, res, res.next)
		.then(() => {
			expect(res.popLatestData()).to.equal('next');
			expect(req.body).to.deep.equal(UserDataMock.validUser);
		});
	});
});


describe("authenticateUser", () => {
 	it('should have a bad username and throw an error', () => {
		return middleware.authenticateUser(UserDataMock.badUsername, '', res.done)
		.then(() => {
			expect(res.popLatestData().LOG).to.deep.equal(LOGS.USER_NO_SUCH_USERNAME); // any error with username
		});
	});
	
	it('should have a bad password and throw an error', () => {
		return middleware.authenticateUser(UserDataMock.validUser.username, UserDataMock.badPassword, res.done)
		.then(() => {
			expect(res.popLatestData().LOG).to.deep.equal(LOGS.USER_WRONG_PASSWORD); // any error with username
		});
	});
	
	it('should find a user and confirm the password and send it forward', () => {
		let validUser = UserDataMock.validUser;
		return middleware.authenticateUser(validUser.username, validUser.password, res.done)
		.then(() => {
			expect(res.popLatestData()).to.deep.equal(validUser);
		});
	});
});
	
describe("passportLocalAuthenticate", () => {
	beforeEach(() => {
		passport.use(new LocalStrategy(middleware.authenticateUser.bind(middleware)));		
	});
	
 	it('should validate user successfully, set it on body and procceed', done => {
		let req = {body: UserDataMock.validUser};
		middleware.passportLocalAuthenticate(req, res, res.next);
		Promise.resolve()
		.then(() => Promise.resolve())
		.then(() => Promise.resolve())
		.then(() => {
			expect(req.body['user']).to.deep.equal(UserDataMock.validUser);
			expect(res.popLatestData()).to.equal('next');
			done();
		}).catch(done);
	});
	
	it('should catch an error of wrong username/password and send it back', done => {
		let req = {body: UserDataMock.badPassword};
		middleware.passportLocalAuthenticate(req, res, res.next);
		Promise.resolve()
		.then(() => Promise.resolve())
		.then(() => Promise.resolve())
		.then(() => Promise.resolve())
		.then(() => {
			expect(res.popLatestData()).to.have.property('error');
			done();
		}).catch(done);
	});
}); 
	
// TODO
// isLoggedOut


describe("isUsernameUnique", () => {
	let req = {};
	beforeEach(() => {
		req['body'] = UserDataMock.validUser;
	});
	
 	it('should not find a user with that username and procceed', () => {
		req['body'].username += 123;
		return middleware.isUsernameUnique(req, res, res.next)
		.then((d) => {
			expect(res.popLatestData()).to.equal('next');
		});
	});
	
	it('should find a user with that username and throw an error', () => {
		return middleware.isUsernameUnique(req, res, res.next)
		.then(() => {
			expect(res.popLatestData()).to.have.property('error');
		});
	});
});