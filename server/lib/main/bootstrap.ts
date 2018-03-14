import * as path from 'path';

let routers = {};
let services = {};
let controllers = {};

export default class Bootstrap {
    protected app;

    constructor(app) {
        this.app = app;

        this.app.get('/', (req, res) => {
            res.sendFile(path.resolve(`playground/test.html`));
        });
        this.app.get('/assets.html', (req, res) => {
            res.sendFile(path.resolve(`playground/assets`));
        });
    }

    public init() {
        let structure = require('../../../config/config.structure.json');
        var filesGroups = [];
        for (let i = 0; i < structure.folders.length; i++) {
            if (structure.skip[structure.folders[i]]) { // There are classes that we do not want to instantiate, like Master - everything inherits from it
                continue;
            }
            let files: any = this.createFiles(structure, i);
            files.routers = routers;
            
            filesGroups.push(files);
            routers[structure.folders[i]] = files.router;
            services[structure.folders[i]] = files.services;
            controllers[structure.folders[i]] = files.controller;
        }
        this.initObjects(structure.templates, filesGroups, this.app);
        
        filesGroups.sort((a, b) => b.model.priority - a.model.priority);
        this.createModel(filesGroups, 0);
    }

    private createFiles(structure, i) {
        let files: any = {};
        // creates new instances
        let feature = structure.folders[i];
        for (let j = 0; j < structure.templates.length; j++) {
            let path = `../${feature}/${feature}.${structure.templates[j]}`;
            files[structure.templates[j]] = new (require(path).default)();
        } 
        // load config files
        files.config = require(`../${feature}/${feature}.config`).default;

        return files;
    }

    private createModel(filesGroups: any[], i) {
        if (i === filesGroups.length) {
            return;
        }
        filesGroups[i].model.createModel()
            .then(() => {
                this.createModel(filesGroups, i + 1);
                filesGroups[i].services.setModel(filesGroups[i].model.getModel());
            });
    }

    private initObjects(templates, objectsToInit, app) {
        objectsToInit.forEach(objToInit => {
            templates.forEach(template => {
                objToInit[template].init(objToInit, app);
            });
        });
    }
};

export function getRouter(name: string) {
    return routers[name];
}

export function getServices(name: string) {
    return services[name];
}

export function getController(name: string) {
    return controllers[name];
}