import * as winston from 'winston';
require('winston-mongodb');

const consoleTransport = new winston.transports.Console({
    colorize: true,
    prettyPrint: true
});
const loggerInstance = new winston.Logger({
    transports: [
        consoleTransport,
    ],
    exceptionHandlers: [
        consoleTransport
    ]
});

export function setLogger(db) {
    loggerInstance.add((<any>winston.transports).MongoDB, {
        db,
        collection: "logs",
        handleExceptions: true,
    });
}

export const logger = loggerInstance;

