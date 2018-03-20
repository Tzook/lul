
import MasterMiddleware from '../master/master.middleware';
import { Request, Response, NextFunction } from 'express';

export default class GithubMiddleware extends MasterMiddleware {
    public validateBodyParams(req: Request, res: Response, next: NextFunction) {
        let {name} = req.body
        delete req.body.name;
        for (let character of (<any>req).user.characters) {
            if (character.name === name) {
                req.body.name = name;
                break;
            }
        }

        return this.validateParams(req, res, next, [
			{param: "title", isType: ["string"], callback: this.services.inRange, args: [(req.body.title || "").length, 3, 30, this.LOGS.MASTER_OUT_OF_RANGE, 'title']},
			{param: "body", isType: ["string"], callback: this.services.inRange, args: [(req.body.body || "").length, 3, 200, this.LOGS.MASTER_OUT_OF_RANGE, 'body']},
			{param: "name", isType: ["string"]}
		]);
    }
};