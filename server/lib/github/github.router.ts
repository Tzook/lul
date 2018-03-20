
import MasterRouter from '../master/master.router';
import githubConfig from './github.config';
import GithubMiddleware from './github.middleware';
import GithubController from './github.controller';

export default class GithubRouter extends MasterRouter {
    protected middleware: GithubMiddleware;
    protected controller: GithubController;

    protected initRoutes(app) {
		app.post(githubConfig.ROUTES.CREATE_ISSUE,
            this.middleware.isLoggedIn.bind(this.middleware),
            this.middleware.validateBodyParams.bind(this.middleware),
			this.controller.createNewIssue.bind(this.controller));
	}
};