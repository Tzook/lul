
import MasterRouter from '../master/master.router';
import UserController from './user.controller';
import UserMiddleware from './user.middleware';
import userConfig from './user.config';
let passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy;

const sessionTime = 1000 * 60 * 60 * 24 * 30; // 30 days

export default class UserRouter extends MasterRouter {
	protected controller: UserController;
	protected middleware: UserMiddleware;

	init(files, app) {
		this.usePassport(app, app.session, app.mongoStore, files.controller, files.middleware);
		super.init(files, app);
	}

	protected initRoutes(app) {
		app.get(this.ROUTES.USER_SESSION,
			this.middleware.isLoggedIn.bind(this.middleware),
			this.controller.sendUser.bind(this.controller));

		app.get(this.ROUTES.USER_LOGOUT,
			this.controller.performLogout.bind(this.controller),
			this.controller.sendLogout.bind(this.controller));

		app.post(this.ROUTES.USER_LOGIN,
			this.middleware.hasLoginParams.bind(this.middleware),
			this.middleware.passportLocalAuthenticate.bind(this.middleware),
			this.controller.performLogin.bind(this.controller),
			this.controller.sendUser.bind(this.controller));

		app.post(this.ROUTES.USER_REGISTER,
			this.middleware.hasRegisterParams.bind(this.middleware),
			this.middleware.isUsernameUnique.bind(this.middleware),
			this.controller.handleNewUser.bind(this.controller),
			this.controller.performLogin.bind(this.controller),
			this.controller.sendUser.bind(this.controller));

		app.post(this.ROUTES.USER_DELETE,
			this.middleware.isLoggedIn.bind(this.middleware),
			this.controller.deleteUser.bind(this.controller),
			this.controller.performLogout.bind(this.controller),
			this.controller.sendDeleted.bind(this.controller));
	}

	usePassport(app, session, mongoStore, controller, middleware) {
		// NOTE: in passport's middleware library under file authenticate.js, i changed the callback called on error to send the res too
		app.use(session({
            name: userConfig.UNICORN,
            secret: 'UnicornsAreAmazingB0ss',
            store: mongoStore,
            cookie: { maxAge: sessionTime, httpOnly: false },
            saveUninitialized: true,
            resave: true 
		}));
		app.use(passport.initialize());
		app.use((req, res, next) => {
			passport.authenticate('session', {}, (error) => controller.deserializeError(error, res))(req, res, next);
		});
		passport.use(new LocalStrategy(middleware.authenticateUser.bind(middleware)));
        passport.serializeUser(controller.serializeUser.bind(controller));
        passport.deserializeUser(controller.deserializeUser.bind(controller));
	}
};