import * as winston from "winston";
require("winston-mongodb");

const consoleTransport = new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
});
const loggerInstance = winston.createLogger({
    transports: [consoleTransport],
    exceptionHandlers: [consoleTransport],
});

export function setLogger(db) {
    winston.add(
        new (<any>winston.transports).MongoDB({
            db,
            collection: "logs",
            handleExceptions: true,
        }),
    );
}

export const logger = loggerInstance;
