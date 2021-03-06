import { EventEmitter } from 'events';
import Routes from './routes';

let routers = {};
let services = {};
let controllers = {};
let globalEmitter = new EventEmitter();

export default class Bootstrap {
    protected app;

    constructor(app) {
        this.app = app;
    }
    
    public init() {
        (new Routes(this.app)).init();
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
        
        filesGroups.sort((a, b) => (b.model || {priority: 0}).priority - (a.model || {priority: 0}).priority);
        this.createModel(filesGroups, 0);
    }

    private createFiles(structure, i) {
        let files: any = {};
        // creates new instances
        let feature = structure.folders[i];
        for (let j = 0; j < structure.templates.length; j++) {
            try {
                let path = `../${feature}/${feature}.${structure.templates[j]}`;
                files[structure.templates[j]] = new (require(path).default)();
            } catch (e) {
                let error: Error = e;
                if (!error.message.includes("Cannot find module")) {
                    console.error("Had an error initiating file", feature, structure.templates[j], error);
                }
            }
        } 
        // load config files
        files.config = require(`../${feature}/${feature}.config`).default;

        for (let eventKey in (files.config.GLOBAL_EVENTS || {})) {
            let event = files.config.GLOBAL_EVENTS[eventKey];
            let handler = files.router[event.name].bind(files.router);
            globalEmitter.on(event.name, handler);
        }

        return files;
    }

    private createModel(filesGroups: any[], i) {
        if (i === filesGroups.length) {
            return;
        }
        if (!filesGroups[i].model) {
            return this.createModel(filesGroups, i + 1);
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
                objToInit[template] && objToInit[template].init(objToInit, app);
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

export function getEmitter() {
    return globalEmitter;
}