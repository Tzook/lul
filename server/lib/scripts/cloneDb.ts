import _ = require('underscore');
import * as mongoose from 'mongoose';
import { getEnvVariable } from '../main/env';
import { Collection } from 'mongoose';

function cloneDb() {
    console.log("Cloning DB...");
    const prodDb = mongoose.createConnection(getEnvVariable("dbUrlProd"));
    const stagingDb = mongoose.createConnection(getEnvVariable("dbUrl"));
    Promise.all([prodDb, stagingDb])
        .then(() => stagingDb.db.collections())
        .then((collections: Collection[]) => {
            let promises = [];
            for (let collection of collections) {
                if (_.contains(["sessions", "logs", "users", "system.indexes", "objectlabs-system.admin.collections", "objectlabs-system"], collection.collectionName)) {
                    continue;
                }
                const promise = collection.find().toArray().then(models => {
                    let promiseValue: any;
                    if (models.length === 0) {
                        promiseValue = Promise.reject(`Collection ${collection.collectionName} was empty!`);
                    } else {
                        const prodCollection = prodDb.db.collection(collection.collectionName);
                        promiseValue = prodCollection.remove({}).then(() => prodCollection.insertMany(models));
                    }
                    return promiseValue;
                });
                promises.push(promise);
            }
            return Promise.all(promises);
        })
        .then(() => {
            console.log("Successfully updated prod db!");
            process.exit();
        })
        .catch((error) => {
            console.log("Had an error", error);
            process.exit(1);
        });
};

cloneDb();