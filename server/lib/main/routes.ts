import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import * as express from "express";

const PARTS_SIZE = 5;

export default class Routes {
    protected app: express.Application;
    protected dataCache: {file?: Promise<Buffer>, parts: Promise<Buffer>[]} = {parts: []};
    
    constructor(app) {
        this.app = app;
    }

    public init() {
        this.app.get('/', (req, res) => {
            res.sendFile(path.resolve(`playground/index.html`));
        });

        this.app.get('/assets.html', (req, res) => {
            res.sendFile(path.resolve(`playground/assets`));
        });

        this.app.use('/Build/Desktop.data.unityweb', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log("In!!", req.query);
            if (req.query.part >= 1 && req.query.part <= PARTS_SIZE) {
                this.getBuildDataPart(req.query.part - 1)
                    .then(buffer => res.send(buffer))
                    .catch(next);
                
            } else {
                next();
            }
        });

        this.app.use(express.static('playground'));
    }

    protected getBuildDataPart(partIndex: number): Promise<Buffer> {
        const filePromise = this.dataCache.file || (this.dataCache.file = util.promisify(fs.readFile)("playground/Build/Desktop.data.unityweb"));
        const partPromise = this.dataCache.parts[partIndex] || (this.dataCache.parts[partIndex] = filePromise
            .then(buffer => {
                const size = Math.ceil(buffer.length / PARTS_SIZE);
                return buffer.slice(partIndex * size, (partIndex + 1) * size);
            }));
        return partPromise;
    }
};