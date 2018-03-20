
import MasterController from '../master/master.controller';
import { Request, Response, NextFunction } from 'express';
import { createIssue } from './github.services';

export default class GithubController extends MasterController {
    public createNewIssue(req: Request, res: Response, next: NextFunction) {
        createIssue(req.body)
            .then(name => {
                this.sendData(res, this.LOGS.CREATE_ISSUE_SUCCESS, name);
            })
            .catch(e => {
                this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "generateRandomName", file: "character.controller.js"});
            });
    }
};