'use strict';
import MasterRouter from '../master/master.router';
let passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy;

const sessionTime = 1000 * 60 * 60 * 24 * 30; // 30 days

export default class UserRouter extends MasterRouter {

	init(files, app) {
		this.usePassport(app, app.session, app.mongoStore, files.controller, files.middleware);
		super.init(files, app);
	}

	initRoutes(app) {
		app.get(this.ROUTES.USER_SESSION,
			this.middleware.isLoggedIn.bind(this.middleware),
			this.controller.sendUser.bind(this.controller));

		app.get(this.ROUTES.USER_LOGOUT,
			this.middleware.isLoggedIn.bind(this.middleware),
			this.controller.performLogout.bind(this.controller));

		app.post(this.ROUTES.USER_LOGIN,
			this.middleware.isLoggedOut.bind(this.middleware),
			this.middleware.hasLoginParams.bind(this.middleware),
			this.middleware.passportLocalAuthenticate.bind(this.middleware),
			this.controller.performLogin.bind(this.controller),
			this.controller.sendUser.bind(this.controller));

		app.post(this.ROUTES.USER_REGISTER,
			this.middleware.isLoggedOut.bind(this.middleware),
			this.middleware.hasRegisterParams.bind(this.middleware),
			this.middleware.isUsernameUnique.bind(this.middleware),
			this.controller.handleNewUser.bind(this.controller),
			this.controller.performLogin.bind(this.controller),
			this.controller.sendUser.bind(this.controller));
	}

	usePassport(app, session, mongoStore, controller, middleware) {
		// NOTE: in passport's middleware library under file authenticate.js, i changed the callback called on error to send the res too
		app.dependencies.push((session({
				name: 'unicorn',
				secret: 'UnicornsAreAmazingB0ss',
				store: mongoStore,
				cookie: { maxAge: sessionTime },
				saveUninitialized: true,
				resave: true })));
		app.use(passport.initialize());
		app.use(passport.authenticate('session', {}, controller.deserializeError.bind(controller)));
		passport.use(new LocalStrategy(middleware.authenticateUser.bind(middleware)));
        passport.serializeUser(controller.serializeUser.bind(controller));
        passport.deserializeUser(controller.deserializeUser.bind(controller));
	}
};