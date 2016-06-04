'use strict';

let fs = require('fs');
let path = require('path');

/**
 *  Bootstrap manager to initiate all packages
 */
class Bootstrap {
    /**
     * Default constructor
     */
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

    /**
     * Loads the routes structure from the structure.json file
     */
    init(app) {
        let structure = require('../../../config/config.structure.json');
        let models = [];
        let routers = {};
        for (let i = 0; i < structure.folders.length; i++) {
            if (structure.skip[structure.folders[i]]) { // There are classes that we do not want to instantiate, like Master - everything inherits from it
                continue;
            }
            let files = {};
            // creates new instances
            for (let j = 0; j < structure.templates.length; j++) {
                files[structure.templates[j]] = new (require(`../${structure.folders[i]}/${structure.folders[i]}.${structure.templates[j]}.js`))();
            }
            // load config files
            for (let j = 0; j < structure.configs.length; j++) {
                files[structure.configs[j]] = require(`../../../server/lib/${structure.folders[i]}/${structure.folders[i]}.${structure.configs[j]}.json`);
            }
            // initializes all objects
            for (let j = 0; j < structure.templates.length; j++) {
                files[structure.templates[j]].init(files, app);
            }
            let model = {};
            model.priority = files.model.priority;
            model.model = files.model;
            model.services = files.services;
            models.push(model);
            routers[structure.folders[i]] = files.router;
        }
        models.sort((a, b) => b.priority - a.priority);
        createModel(models, 0);
        initRouterConnections(routers);
    }
};

function createModel(models, i) {
    if (i === models.length) {
        return;
    }
    models[i].model.createModel()
    .then(() => {
        createModel(models, i + 1);
        models[i].services.setModel(models[i].model.getModel());
    });
}

function initRouterConnections(routers) {
    let connections = {};
    // push any connection (another router) to the array if there are
    for (let i in routers) {
        if (routers[i].connection) {
            connections[routers[i].connection] = connections[routers[i].connection] || [];
            connections[routers[i].connection].push(i);
        }
    }
    // set the connections
    for (let i in connections) {
        for (let j in connections[i]) {
            routers[i].setConnection(routers[connections[i][j]]);
        }
    }

}

module.exports = Bootstrap;