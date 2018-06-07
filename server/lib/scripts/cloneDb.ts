import _ = require('underscore');
import * as mongoose from 'mongoose';
import { getEnvVariable } from '../main/env';

export function cloneDb() {
    console.log("Cloning DB...");
    const prodDb = mongoose.createConnection(getEnvVariable("dbUrlProd"));
    (<any>prodDb).then(() => {
        mongoose.connection.db.collections().then((collections) => {
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
            Promise.all(promises)
                .then(() => console.log("Successfully updated prod db!"))
        });
    })
};