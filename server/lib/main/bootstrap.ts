import * as path from 'path';

export default class Bootstrap {
    protected app;

    constructor(app) {
        this.app = app;

        if (process.env.NODE_ENV === 'development') {
            this.app.get('/', (req, res) => {
                res.sendFile(path.resolve(`playground/test.html`));
            });
            this.app.get('/assets.html', (req, res) => {
                res.sendFile(path.resolve(`playground/assets.html`));
            });
        }
    }

    public init() {
        let structure = require('../../../config/config.structure.json');
        let routers = {};
        var filesGroups = [];
        for (let i = 0; i < structure.folders.length; i++) {
            if (structure.skip[structure.folders[i]]) { // There are classes that we do not want to instantiate, like Master - everything inherits from it
                continue;
            }
            let files: any = this.createFiles(structure, i);
            files.routers = routers;
            
            filesGroups.push(files);
            routers[structure.folders[i]] = files.router;
        }
        this.initObjects(structure.templates, filesGroups, this.app);
        
        filesGroups.sort((a, b) => b.model.priority - a.model.priority);
        this.createModel(filesGroups, 0);
    }

    private createFiles(structure, i) {
        let files = {};
        // creates new instances
        for (let j = 0; j < structure.templates.length; j++) {
            let path = `../${structure.folders[i]}/${structure.folders[i]}.${structure.templates[j]}.js`;
            files[structure.templates[j]] = new (require(path).default)();
        }
        // load config files
        for (let j = 0; j < structure.configs.length; j++) {
            files[structure.configs[j]] = require(`../../../server/lib/${structure.folders[i]}/${structure.folders[i]}.${structure.configs[j]}.json`);
        }
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