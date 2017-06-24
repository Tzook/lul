'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const socketio_router_base_1 = require("./socketio.router.base");
const Emitter = require("events");
const Heroku = require("heroku-client");
require('./socketio.fixer');
let passportSocketIo = require('passport.socketio');
let config = require('../../../server/lib/socketio/socketio.config.json');
class SocketioRouter extends socketio_router_base_1.default {
    constructor() {
        super();
        this.routers = [this];
        this.map = new Map();
    }
    init(files, app) {
        super.init(files, app);
        this.services = files.services;
        this.mapRouters(files.routers);
        this.initDependencies(app.mongoStore);
        this.initListeners();
        this.restartServerEvent(app);
    }
    getConfig() {
        return this.services.getConfig();
    }
    mapRouters(routers) {
        for (let i in routers) {
            if (routers[i].connection === "socketio") {
                this.routers.push(routers[i]);
            }
        }
    }
    initDependencies(mongoStore) {
        this.io.use((socket, next) => {
            if (socket.request._query.unicorn) {
                socket.request._query.session_id = socket.request._query.unicorn.split(/s:|\./)[1];
            }
            next();
        });
        this.io.use(passportSocketIo.authorize({
            key: 'unicorn',
            secret: 'UnicornsAreAmazingB0ss',
            store: mongoStore,
            success: this.onAuthorizeSuccess.bind(this),
            fail: this.onAuthorizeFail.bind(this),
        }));
    }
    onAuthorizeSuccess(req, next) {
        for (let i = 0; i < req.user.characters.length; i++) {
            if (req.user.characters[i]._id.equals(req._query.id)) {
                req.character = req.user.characters[i];
                break;
            }
        }
        if (!req.character) {
            let errorMessage = 'no character param OR no such character in user, param was' + req._query.id;
            console.error(errorMessage);
            next(new Error(errorMessage));
        }
        else if (this.map.has(req.user._id.toString())) {
            let errorMessage = `Users character is already logged in: ${req._query.id}~`;
            console.error(errorMessage);
            next(new Error(errorMessage));
        }
        else {
            next();
        }
    }
    onAuthorizeFail(req, message, error, next) {
        let errorMessage = 'Error occured trying to connect to user: ' + message;
        console.error(errorMessage);
        next(new Error(errorMessage));
    }
    initListeners() {
        this.io.on(this.ROUTES.BEGIN_CONNECTION, (socket) => {
            if (!this.isProduction() && socket.request._query.test === 'true') {
                socket.test = true;
            }
            socket.user = socket.client.request.user;
            socket.character = socket.client.request.character;
            if (this.map.has(socket.user._id.toString())) {
                socket.disconnect();
                return;
            }
            socket.throttles = new Map();
            this.map.set(socket.user._id.toString(), socket);
            this.map.set(socket.character.name, socket);
            this.map.set(socket.id, socket);
            let emitter = new Emitter.EventEmitter();
            for (let j in this.routers) {
                let router = this.routers[j];
                router.eventEmitter = emitter;
                this.listenToEvents(router, router.SERVER_GETS, [socket, emitter], config.EVENTS_THROTTLE);
                this.listenToEvents(router, router.SERVER_INNER, [emitter], 0);
            }
            console.log('connected', socket.character.name);
            socket.map = this.map;
            for (let j in this.routers) {
                let router = this.routers[j];
                router.onConnected(socket);
            }
        });
    }
    listenToEvents(router, events, listeners, defaultThrottle) {
        for (let i in events) {
            let event = events[i];
            let routerFn = router[event.name].bind(router);
            for (let j in listeners) {
                listeners[j].on(event.name, (...args) => {
                    let socket = args[1];
                    if (this.fitThrottle(socket, event, defaultThrottle, routerFn) &&
                        this.fitBitch(socket, event) &&
                        this.fitAlive(socket, event)) {
                        event.log && this.log(args[0], socket, event.name);
                        routerFn.apply(router, args);
                    }
                });
            }
        }
    }
    fitThrottle(socket, event, defaultThrottle, routerFn) {
        let throttle = event.throttle >= 0 ? event.throttle : defaultThrottle;
        if (throttle && !socket.test) {
            let lastTime = socket.throttles.get(routerFn) || 0;
            let now = Date.now();
            let time = now - lastTime;
            if (time < throttle) {
                console.error('Throttling event!', event.name);
                return false;
            }
            socket.throttles.set(routerFn, now);
        }
        return true;
    }
    fitBitch(socket, event) {
        if (event.bitch !== undefined) {
            if (event.bitch !== socket.bitch) {
                console.error('Not bitch!', event.name);
                return false;
            }
        }
        return true;
    }
    fitAlive(socket, event) {
        if (event.alive !== undefined) {
            if (event.alive !== socket.alive) {
                console.error('Not alive!', event.name);
                return false;
            }
        }
        return true;
    }
    [config.SERVER_GETS.DISCONNECT.name](data, socket) {
        if (!this.map.has(socket.id)) {
            return;
        }
        this.log({}, socket, "Disconnected");
        if (!socket.test) {
            socket.user.save(e => {
                if (e) {
                    console.error("Saving user error", e);
                }
            });
        }
        this.map.delete(socket.user._id.toString());
        this.map.delete(socket.character.name);
        this.map.delete(socket.id);
    }
    restartServerEvent(app) {
        let token = process.env.herokuAuth ? process.env.herokuAuth : require('../../../config/.env.json').herokuAuth;
        let heroku = new Heroku({ token });
        app.post(this.ROUTES.RESTART, this.middleware.validateHasSercetKey.bind(this.middleware), (req, res) => {
            heroku.delete('/apps/lul/dynos')
                .then(apps => {
                console.log("Restarting dynos");
                res.send({ data: 'Restarting server.' });
            })
                .catch(e => {
                console.error("Had an error restarting lul:", e);
            });
        });
    }
    isProduction() {
        return process.env.NODE_ENV === "production";
    }
}
exports.default = SocketioRouter;
;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NlcnZlci9saWIvc29ja2V0aW8vc29ja2V0aW8ucm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYixpRUFBd0Q7QUFDeEQsa0NBQW1DO0FBRW5DLHdDQUF3QztBQUd4QyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUM1QixJQUFJLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3BELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO0FBRTFFLG9CQUFvQyxTQUFRLDhCQUFrQjtJQU03RDtRQUNDLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBS0QsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHO1FBQ2QsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQy9CLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRU0sU0FBUztRQUNmLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFFTyxVQUFVLENBQUMsT0FBdUI7UUFDekMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN2QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQzFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFxQixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRCxDQUFDO1FBQ0YsQ0FBQztJQUNGLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxVQUFVO1FBQzFCLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBa0IsRUFBRSxJQUFjO1lBQzlDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BGLENBQUM7WUFDRCxJQUFJLEVBQUUsQ0FBQztRQUNSLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDO1lBQ3JDLEdBQUcsRUFBVyxTQUFTO1lBQ3ZCLE1BQU0sRUFBUSx3QkFBd0I7WUFDdEMsS0FBSyxFQUFTLFVBQVU7WUFDeEIsT0FBTyxFQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2hELElBQUksRUFBVSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDOUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsa0JBQWtCLENBQUMsR0FBRyxFQUFFLElBQWM7UUFDckMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNyRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0RCxHQUFHLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxLQUFLLENBQUM7WUFDUCxDQUFDO1FBQ0YsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsSUFBSSxZQUFZLEdBQUcsNERBQTRELEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDaEcsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUMvQixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xELElBQUksWUFBWSxHQUFHLHlDQUF5QyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDO1lBQzdFLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDL0IsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1AsSUFBSSxFQUFFLENBQUM7UUFDUixDQUFDO0lBQ0YsQ0FBQztJQUVELGVBQWUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJO1FBQ3hDLElBQUksWUFBWSxHQUFHLDJDQUEyQyxHQUFHLE9BQU8sQ0FBQztRQUN6RSxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxhQUFhO1FBQ1osSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLE1BQWtCO1lBQzNELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNuRSxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNwQixDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDekMsTUFBTSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFDbkQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRTlDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDcEIsTUFBTSxDQUFDO1lBQ1IsQ0FBQztZQUNELE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRWhDLElBQUksT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3pDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixNQUFNLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQztnQkFDOUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsRUFBRSxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQzNGLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNoRSxDQUFDO1lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoRCxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7WUFFdEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUIsQ0FBQztRQUNGLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVPLGNBQWMsQ0FBQyxNQUEwQixFQUFFLE1BQWUsRUFBRSxTQUEyQyxFQUFFLGVBQXVCO1FBQ3ZJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDdEIsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQy9DLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSTtvQkFDbkMsSUFBSSxNQUFNLEdBQWUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNqQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFLFFBQVEsQ0FBQzt3QkFDN0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDO3dCQUM1QixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ1QsS0FBSyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNyRSxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDbEMsQ0FBQztnQkFDRixDQUFDLENBQUMsQ0FBQztZQUNKLENBQUM7UUFDRixDQUFDO0lBQ0YsQ0FBQztJQUVPLFdBQVcsQ0FBQyxNQUFrQixFQUFFLEtBQVksRUFBRSxlQUF1QixFQUFFLFFBQWtCO1FBQ2hHLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxRQUFRLEdBQUcsZUFBZSxDQUFDO1FBQ3RFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDckIsSUFBSSxJQUFJLEdBQUcsR0FBRyxHQUFHLFFBQVEsQ0FBQztZQUMxQixFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDckIsT0FBTyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9DLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDZCxDQUFDO1lBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVPLFFBQVEsQ0FBQyxNQUFrQixFQUFFLEtBQVk7UUFDaEQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQy9CLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDeEMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNkLENBQUM7UUFDRixDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNiLENBQUM7SUFFTyxRQUFRLENBQUMsTUFBa0IsRUFBRSxLQUFZO1FBQ2hELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUMvQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3hDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDZCxDQUFDO1FBQ0YsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBa0I7UUFDNUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sQ0FBQztRQUNSLENBQUM7UUFDSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFFM0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNqQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNQLE9BQU8sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLENBQUM7WUFDRixDQUFDLENBQUMsQ0FBQztRQUNKLENBQUM7UUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFTyxrQkFBa0IsQ0FBQyxHQUFHO1FBQzdCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLFVBQVUsQ0FBQztRQUM5RyxJQUFJLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFbkMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUMxRCxDQUFDLEdBQUcsRUFBRSxHQUFHO1lBQ1IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztpQkFDOUIsSUFBSSxDQUFDLElBQUk7Z0JBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUNoQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFDLENBQUMsQ0FBQztZQUN4QyxDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLENBQUM7Z0JBQ1AsT0FBTyxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNsRCxDQUFDLENBQUMsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVPLFlBQVk7UUFDbkIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLFlBQVksQ0FBQztJQUM5QyxDQUFDO0NBQ0E7QUE3TUYsaUNBNk1FO0FBQUEsQ0FBQyIsImZpbGUiOiJsaWIvc29ja2V0aW8vc29ja2V0aW8ucm91dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuaW1wb3J0IFNvY2tldGlvUm91dGVyQmFzZSBmcm9tICcuL3NvY2tldGlvLnJvdXRlci5iYXNlJztcbmltcG9ydCBFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5pbXBvcnQgTWFzdGVyUm91dGVyIGZyb20gXCIuLi9tYXN0ZXIvbWFzdGVyLnJvdXRlclwiO1xuaW1wb3J0ICogYXMgSGVyb2t1IGZyb20gJ2hlcm9rdS1jbGllbnQnO1xuaW1wb3J0IFNvY2tldGlvTWlkZGxld2FyZSBmcm9tICcuL3NvY2tldGlvLm1pZGRsZXdhcmUnO1xuaW1wb3J0IFNvY2tldGlvU2VydmljZXMgZnJvbSAnLi9zb2NrZXRpby5zZXJ2aWNlcyc7XG5yZXF1aXJlKCcuL3NvY2tldGlvLmZpeGVyJyk7XG5sZXQgcGFzc3BvcnRTb2NrZXRJbyA9IHJlcXVpcmUoJ3Bhc3Nwb3J0LnNvY2tldGlvJyk7XG5sZXQgY29uZmlnID0gcmVxdWlyZSgnLi4vLi4vLi4vc2VydmVyL2xpYi9zb2NrZXRpby9zb2NrZXRpby5jb25maWcuanNvbicpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb2NrZXRpb1JvdXRlciBleHRlbmRzIFNvY2tldGlvUm91dGVyQmFzZSB7XG5cdHByb3RlY3RlZCBtaWRkbGV3YXJlOiBTb2NrZXRpb01pZGRsZXdhcmU7XG5cdHByb3RlY3RlZCBzZXJ2aWNlczogU29ja2V0aW9TZXJ2aWNlcztcblx0cHJvdGVjdGVkIHJvdXRlcnM6IFNvY2tldGlvUm91dGVyQmFzZVtdO1xuXHRwcm90ZWN0ZWQgbWFwOiBNYXA8c3RyaW5nLCBHYW1lU29ja2V0PjtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMucm91dGVycyA9IFt0aGlzXTtcblx0XHR0aGlzLm1hcCA9IG5ldyBNYXAoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXplcyB0aGUgaW5zdGFuY2Vcblx0ICovXG5cdGluaXQoZmlsZXMsIGFwcCkge1xuXHRcdHN1cGVyLmluaXQoZmlsZXMsIGFwcCk7XG5cdFx0dGhpcy5zZXJ2aWNlcyA9IGZpbGVzLnNlcnZpY2VzO1xuXHRcdHRoaXMubWFwUm91dGVycyhmaWxlcy5yb3V0ZXJzKTtcblx0XHR0aGlzLmluaXREZXBlbmRlbmNpZXMoYXBwLm1vbmdvU3RvcmUpO1xuXHRcdHRoaXMuaW5pdExpc3RlbmVycygpO1xuXHRcdHRoaXMucmVzdGFydFNlcnZlckV2ZW50KGFwcCk7XG5cdH1cblxuXHRwdWJsaWMgZ2V0Q29uZmlnKCk6IENvbmZpZyB7XG5cdFx0cmV0dXJuIHRoaXMuc2VydmljZXMuZ2V0Q29uZmlnKCk7XG5cdH1cblxuXHRwcml2YXRlIG1hcFJvdXRlcnMocm91dGVyczogTWFzdGVyUm91dGVyW10pIHtcblx0XHRmb3IgKGxldCBpIGluIHJvdXRlcnMpIHtcblx0XHRcdGlmIChyb3V0ZXJzW2ldLmNvbm5lY3Rpb24gPT09IFwic29ja2V0aW9cIikge1xuXHRcdFx0XHR0aGlzLnJvdXRlcnMucHVzaCg8U29ja2V0aW9Sb3V0ZXJCYXNlPnJvdXRlcnNbaV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGluaXREZXBlbmRlbmNpZXMobW9uZ29TdG9yZSkge1xuXHRcdHRoaXMuaW8udXNlKChzb2NrZXQ6IEdhbWVTb2NrZXQsIG5leHQ6IEZ1bmN0aW9uKSA9PiB7XG5cdFx0XHRpZiAoc29ja2V0LnJlcXVlc3QuX3F1ZXJ5LnVuaWNvcm4pIHtcblx0XHRcdFx0c29ja2V0LnJlcXVlc3QuX3F1ZXJ5LnNlc3Npb25faWQgPSBzb2NrZXQucmVxdWVzdC5fcXVlcnkudW5pY29ybi5zcGxpdCgvczp8XFwuLylbMV07XG5cdFx0XHR9XG5cdFx0XHRuZXh0KCk7XG5cdFx0fSk7XG5cdFx0dGhpcy5pby51c2UocGFzc3BvcnRTb2NrZXRJby5hdXRob3JpemUoe1xuXHRcdFx0XHRrZXk6ICAgICAgICAgICd1bmljb3JuJyxcblx0XHRcdFx0c2VjcmV0OiAgICAgICAnVW5pY29ybnNBcmVBbWF6aW5nQjBzcycsXG5cdFx0XHRcdHN0b3JlOiAgICAgICAgbW9uZ29TdG9yZSxcblx0XHRcdFx0c3VjY2VzczogICAgICB0aGlzLm9uQXV0aG9yaXplU3VjY2Vzcy5iaW5kKHRoaXMpLFxuXHRcdFx0XHRmYWlsOiAgICAgICAgIHRoaXMub25BdXRob3JpemVGYWlsLmJpbmQodGhpcyksXG5cdFx0fSkpO1xuXHR9XG5cblx0b25BdXRob3JpemVTdWNjZXNzKHJlcSwgbmV4dDogRnVuY3Rpb24pIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHJlcS51c2VyLmNoYXJhY3RlcnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmIChyZXEudXNlci5jaGFyYWN0ZXJzW2ldLl9pZC5lcXVhbHMocmVxLl9xdWVyeS5pZCkpIHtcblx0XHRcdFx0cmVxLmNoYXJhY3RlciA9IHJlcS51c2VyLmNoYXJhY3RlcnNbaV07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoIXJlcS5jaGFyYWN0ZXIpIHtcblx0XHRcdGxldCBlcnJvck1lc3NhZ2UgPSAnbm8gY2hhcmFjdGVyIHBhcmFtIE9SIG5vIHN1Y2ggY2hhcmFjdGVyIGluIHVzZXIsIHBhcmFtIHdhcycgKyByZXEuX3F1ZXJ5LmlkO1xuXHRcdFx0Y29uc29sZS5lcnJvcihlcnJvck1lc3NhZ2UpO1xuXHRcdFx0bmV4dChuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKSk7XG5cdFx0fSBlbHNlIGlmICh0aGlzLm1hcC5oYXMocmVxLnVzZXIuX2lkLnRvU3RyaW5nKCkpKSB7XG5cdFx0XHRsZXQgZXJyb3JNZXNzYWdlID0gYFVzZXJzIGNoYXJhY3RlciBpcyBhbHJlYWR5IGxvZ2dlZCBpbjogJHtyZXEuX3F1ZXJ5LmlkfX5gO1xuXHRcdFx0Y29uc29sZS5lcnJvcihlcnJvck1lc3NhZ2UpO1xuXHRcdFx0bmV4dChuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5leHQoKTtcblx0XHR9XG5cdH1cblxuXHRvbkF1dGhvcml6ZUZhaWwocmVxLCBtZXNzYWdlLCBlcnJvciwgbmV4dCkge1xuXHRcdGxldCBlcnJvck1lc3NhZ2UgPSAnRXJyb3Igb2NjdXJlZCB0cnlpbmcgdG8gY29ubmVjdCB0byB1c2VyOiAnICsgbWVzc2FnZTtcblx0XHRjb25zb2xlLmVycm9yKGVycm9yTWVzc2FnZSk7XG5cdFx0bmV4dChuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKSk7XG5cdH1cblxuXHRpbml0TGlzdGVuZXJzKCkge1xuXHRcdHRoaXMuaW8ub24odGhpcy5ST1VURVMuQkVHSU5fQ09OTkVDVElPTiwgKHNvY2tldDogR2FtZVNvY2tldCkgPT4ge1xuXHRcdFx0aWYgKCF0aGlzLmlzUHJvZHVjdGlvbigpICYmIHNvY2tldC5yZXF1ZXN0Ll9xdWVyeS50ZXN0ID09PSAndHJ1ZScpIHtcblx0XHRcdFx0c29ja2V0LnRlc3QgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0c29ja2V0LnVzZXIgPSBzb2NrZXQuY2xpZW50LnJlcXVlc3QudXNlcjtcblx0XHRcdHNvY2tldC5jaGFyYWN0ZXIgPSBzb2NrZXQuY2xpZW50LnJlcXVlc3QuY2hhcmFjdGVyO1xuXHRcdFx0aWYgKHRoaXMubWFwLmhhcyhzb2NrZXQudXNlci5faWQudG9TdHJpbmcoKSkpIHtcblx0XHRcdFx0Ly8gY2hhcmFjdGVyIGFscmVhZHkgY29ubmVjdGVkISBtdXN0IGRpc2Nvbm5lY3Rcblx0XHRcdFx0c29ja2V0LmRpc2Nvbm5lY3QoKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0c29ja2V0LnRocm90dGxlcyA9IG5ldyBNYXAoKTtcblx0XHRcdHRoaXMubWFwLnNldChzb2NrZXQudXNlci5faWQudG9TdHJpbmcoKSwgc29ja2V0KTtcblx0XHRcdHRoaXMubWFwLnNldChzb2NrZXQuY2hhcmFjdGVyLm5hbWUsIHNvY2tldCk7XG5cdFx0XHR0aGlzLm1hcC5zZXQoc29ja2V0LmlkLCBzb2NrZXQpO1xuXG5cdFx0XHRsZXQgZW1pdHRlciA9IG5ldyBFbWl0dGVyLkV2ZW50RW1pdHRlcigpO1xuXHRcdFx0Zm9yIChsZXQgaiBpbiB0aGlzLnJvdXRlcnMpIHtcblx0XHRcdFx0bGV0IHJvdXRlciA9IHRoaXMucm91dGVyc1tqXTtcblx0XHRcdFx0cm91dGVyLmV2ZW50RW1pdHRlciA9IGVtaXR0ZXI7XG5cdFx0XHRcdHRoaXMubGlzdGVuVG9FdmVudHMocm91dGVyLCByb3V0ZXIuU0VSVkVSX0dFVFMsIFtzb2NrZXQsIGVtaXR0ZXJdLCBjb25maWcuRVZFTlRTX1RIUk9UVExFKTtcblx0XHRcdFx0dGhpcy5saXN0ZW5Ub0V2ZW50cyhyb3V0ZXIsIHJvdXRlci5TRVJWRVJfSU5ORVIsIFtlbWl0dGVyXSwgMCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnNvbGUubG9nKCdjb25uZWN0ZWQnLCBzb2NrZXQuY2hhcmFjdGVyLm5hbWUpO1xuXHRcdFx0c29ja2V0Lm1hcCA9IHRoaXMubWFwO1xuXG5cdFx0XHRmb3IgKGxldCBqIGluIHRoaXMucm91dGVycykge1xuXHRcdFx0XHRsZXQgcm91dGVyID0gdGhpcy5yb3V0ZXJzW2pdO1xuXHRcdFx0XHRyb3V0ZXIub25Db25uZWN0ZWQoc29ja2V0KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgbGlzdGVuVG9FdmVudHMocm91dGVyOiBTb2NrZXRpb1JvdXRlckJhc2UsIGV2ZW50czogRVZFTlRbXSwgbGlzdGVuZXJzOiB7b246IChzdHJpbmcsIEZ1bmN0aW9uKSA9PiB7fX1bXSwgZGVmYXVsdFRocm90dGxlOiBudW1iZXIpIHtcblx0XHRmb3IgKGxldCBpIGluIGV2ZW50cykge1xuXHRcdFx0bGV0IGV2ZW50ID0gZXZlbnRzW2ldO1xuXHRcdFx0bGV0IHJvdXRlckZuID0gcm91dGVyW2V2ZW50Lm5hbWVdLmJpbmQocm91dGVyKTtcblx0XHRcdGZvciAobGV0IGogaW4gbGlzdGVuZXJzKSB7XG5cdFx0XHRcdGxpc3RlbmVyc1tqXS5vbihldmVudC5uYW1lLCAoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdGxldCBzb2NrZXQ6IEdhbWVTb2NrZXQgPSBhcmdzWzFdO1xuXHRcdFx0XHRcdGlmICh0aGlzLmZpdFRocm90dGxlKHNvY2tldCwgZXZlbnQsIGRlZmF1bHRUaHJvdHRsZSwgcm91dGVyRm4pICYmIFxuXHRcdFx0XHRcdFx0dGhpcy5maXRCaXRjaChzb2NrZXQsIGV2ZW50KSAmJiBcblx0XHRcdFx0XHRcdHRoaXMuZml0QWxpdmUoc29ja2V0LCBldmVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5sb2cgJiYgdGhpcy5sb2coYXJnc1swXSwgc29ja2V0LCBldmVudC5uYW1lKTtcblx0XHRcdFx0XHRcdCAgICByb3V0ZXJGbi5hcHBseShyb3V0ZXIsIGFyZ3MpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBmaXRUaHJvdHRsZShzb2NrZXQ6IEdhbWVTb2NrZXQsIGV2ZW50OiBFVkVOVCwgZGVmYXVsdFRocm90dGxlOiBudW1iZXIsIHJvdXRlckZuOiBGdW5jdGlvbik6IGJvb2xlYW4ge1xuXHRcdGxldCB0aHJvdHRsZSA9IGV2ZW50LnRocm90dGxlID49IDAgPyBldmVudC50aHJvdHRsZSA6IGRlZmF1bHRUaHJvdHRsZTtcblx0XHRpZiAodGhyb3R0bGUgJiYgIXNvY2tldC50ZXN0KSB7XG5cdFx0XHRsZXQgbGFzdFRpbWUgPSBzb2NrZXQudGhyb3R0bGVzLmdldChyb3V0ZXJGbikgfHwgMDtcblx0XHRcdGxldCBub3cgPSBEYXRlLm5vdygpO1xuXHRcdFx0bGV0IHRpbWUgPSBub3cgLSBsYXN0VGltZTtcblx0XHRcdGlmICh0aW1lIDwgdGhyb3R0bGUpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcignVGhyb3R0bGluZyBldmVudCEnLCBldmVudC5uYW1lKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0c29ja2V0LnRocm90dGxlcy5zZXQocm91dGVyRm4sIG5vdyk7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0cHJpdmF0ZSBmaXRCaXRjaChzb2NrZXQ6IEdhbWVTb2NrZXQsIGV2ZW50OiBFVkVOVCk6IGJvb2xlYW4ge1x0XHRcdFxuXHRcdGlmIChldmVudC5iaXRjaCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRpZiAoZXZlbnQuYml0Y2ggIT09IHNvY2tldC5iaXRjaCkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdOb3QgYml0Y2ghJywgZXZlbnQubmFtZSk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRwcml2YXRlIGZpdEFsaXZlKHNvY2tldDogR2FtZVNvY2tldCwgZXZlbnQ6IEVWRU5UKTogYm9vbGVhbiB7XG5cdFx0aWYgKGV2ZW50LmFsaXZlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdGlmIChldmVudC5hbGl2ZSAhPT0gc29ja2V0LmFsaXZlKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ05vdCBhbGl2ZSEnLCBldmVudC5uYW1lKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdFtjb25maWcuU0VSVkVSX0dFVFMuRElTQ09OTkVDVC5uYW1lXShkYXRhLCBzb2NrZXQ6IEdhbWVTb2NrZXQpIHtcblx0XHRpZiAoIXRoaXMubWFwLmhhcyhzb2NrZXQuaWQpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuICAgICAgICB0aGlzLmxvZyh7fSwgc29ja2V0LCBcIkRpc2Nvbm5lY3RlZFwiKTtcblx0XHQvLyBhdXRvbWF0aW9ucyBzaG91bGQgbm90IGJlIHNhdmVkIGFmdGVyd2FyZHMgLSB3ZSB3YW50IGl0IHRvIHJlc2V0IGV2ZXJ5IHRpbWVcblx0XHRpZiAoIXNvY2tldC50ZXN0KSB7XG5cdFx0XHRzb2NrZXQudXNlci5zYXZlKGUgPT4ge1xuXHRcdFx0XHRpZiAoZSkge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJTYXZpbmcgdXNlciBlcnJvclwiLCBlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHRoaXMubWFwLmRlbGV0ZShzb2NrZXQudXNlci5faWQudG9TdHJpbmcoKSk7XG5cdFx0dGhpcy5tYXAuZGVsZXRlKHNvY2tldC5jaGFyYWN0ZXIubmFtZSk7XG5cdFx0dGhpcy5tYXAuZGVsZXRlKHNvY2tldC5pZCk7XG5cdH1cblxuXHRwcml2YXRlIHJlc3RhcnRTZXJ2ZXJFdmVudChhcHApIHtcblx0XHRsZXQgdG9rZW4gPSBwcm9jZXNzLmVudi5oZXJva3VBdXRoID8gcHJvY2Vzcy5lbnYuaGVyb2t1QXV0aCA6IHJlcXVpcmUoJy4uLy4uLy4uL2NvbmZpZy8uZW52Lmpzb24nKS5oZXJva3VBdXRoO1xuXHRcdGxldCBoZXJva3UgPSBuZXcgSGVyb2t1KHsgdG9rZW4gfSk7XG5cdFx0XG5cdFx0YXBwLnBvc3QodGhpcy5ST1VURVMuUkVTVEFSVCwgXG5cdFx0XHR0aGlzLm1pZGRsZXdhcmUudmFsaWRhdGVIYXNTZXJjZXRLZXkuYmluZCh0aGlzLm1pZGRsZXdhcmUpLFxuXHRcdFx0KHJlcSwgcmVzKSA9PiB7XG5cdFx0XHRcdGhlcm9rdS5kZWxldGUoJy9hcHBzL2x1bC9keW5vcycpXG5cdFx0XHRcdFx0LnRoZW4oYXBwcyA9PiB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIlJlc3RhcnRpbmcgZHlub3NcIik7XG5cdFx0XHRcdFx0XHRyZXMuc2VuZCh7ZGF0YTogJ1Jlc3RhcnRpbmcgc2VydmVyLid9KTtcdFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmNhdGNoKGUgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihcIkhhZCBhbiBlcnJvciByZXN0YXJ0aW5nIGx1bDpcIiwgZSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIGlzUHJvZHVjdGlvbigpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiO1xuXHR9XG4gfTsiXX0=
