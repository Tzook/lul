// External dependencies
import * as mongoose from "mongoose";
import Response from "../master/master.response";
// Internal
import Bootstrap, { getController } from "./bootstrap";
import { getEnvVariable, isLocal, isSecure } from "./env";
import { setLogger } from "./logger";
let express = require("express"),
    http = require("http"),
    session = require("express-session"),
    MongoStore = require("connect-mongo")(session),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    cors = require("cors"),
    compression = require("compression");

export default class Main {
    private app;

    constructor() {
        this.app = express();
    }

    useDb() {
        mongoose.connect(getEnvVariable("dbUrl"), { useNewUrlParser: true, useUnifiedTopology: true });
        mongoose.connection.on("error", console.error.bind(console, "connection error:"));
    }

    useDependencies() {
        // Run all async - they don't need to run after each other.
        // To add a dependency to run with them, simply push it to the dependencies array
        this.app.dependencies = [compression({ level: 1 }), cookieParser(), bodyParser.json(), cors()];
        this.app.use((req, res, next) => {
            let count = this.app.dependencies.length;
            for (let i in this.app.dependencies) {
                this.app.dependencies[i](req, res, done);
            }
            function done(err) {
                (err && next(err)) || (!--count && next()); // if had error - next will handle it. otherwise, when all finished, procceed.
            }
        });
    }

    redirectIfNotSecure() {
        if (!isLocal()) {
            this.app.use((req, res, next) => {
                if (isSecure(req)) {
                    // request was via https, so do no special handling
                    next();
                } else {
                    // request was via http, so redirect to https
                    res.redirect("https://" + req.headers.host + req.url);
                }
            });
        }
    }

    listenToErrors() {
        this.app.use((error, req, res, next) => {
            const controller: Response = getController("user");
            controller.sendError(res, error.message, error.tokens);
        });
    }

    beginServer() {
        this.app.set("view engine", "jade");
        this.app.set("port", process.env.PORT || 5000);
        this.app.server = http.createServer(this.app).listen(this.app.get("port"));
        this.app.socketio = require("socket.io")(this.app.server);
    }

    attachAppVariables() {
        this.app.cookieParser = cookieParser;
        this.app.session = session;
        this.app.db = mongoose.connection;
        this.app.mongoStore = new MongoStore({ mongooseConnection: this.app.db });
    }

    connectToDbAndBootstrap() {
        this.app.db.once("open", () => {
            if (!isLocal()) {
                setLogger(this.app.db.db);
            }
            console.info("\t+*+*+ Connected to mongodb! on MongoLab +*+*+");
            let bootstrap = new Bootstrap(this.app);
            bootstrap.init();
        });
    }
}
