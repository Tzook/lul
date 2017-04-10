import * as fs from 'fs';
import * as path from 'path';

export default class Bootstrap {
    protected app;

    constructor(app) {
        this.app = app;
        app.get('/', (req, res) => {
            res.sendFile(path.resolve(`server/test.html`));
        });
        app.get('/config', (req, res) => {
            res.send(require('../../../config/config.generated.json'));
        });
        app.get('/logs', (req, res) => {
            var logs = fs.readFileSync(path.resolve(`server/logs.log`), 'utf8');
            logs = logs.split('\n').reverse().join('<br>');
            res.send(logs);
        });
    }

    init(app) {
        let structure = require('../../../config/config.structure.json');
        let routers = {};
        var filesGroups = [];
        for (let i = 0; i < structure.folders.length; i++) {
            if (structure.skip[structure.folders[i]]) { // There are classes that we do not want to instantiate, like Master - everything inherits from it
                continue;
            }
            let files: any = createFiles(structure, i);
            files.routers = routers;
            
            filesGroups.push(files);
            routers[structure.folders[i]] = files.router;
        }
        initObjects(structure.templates, filesGroups, app);
        
        filesGroups.sort((a, b) => b.model.priority - a.model.priority);
        createModel(filesGroups, 0);
    }
};

function createFiles(structure, i) {
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

function createModel(filesGroups: any[], i) {
    if (i === filesGroups.length) {
        return;
    }
    filesGroups[i].model.createModel()
        .then(() => {
            createModel(filesGroups, i + 1);
            filesGroups[i].services.setModel(filesGroups[i].model.getModel());
        });
}

function initObjects(templates, objectsToInit, app) {
    objectsToInit.forEach(objToInit => {
        templates.forEach(template => {
            objToInit[template].init(objToInit, app);
        });
    });
}