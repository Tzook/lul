'use strict';
let winston = require('winston');

export default class Logger {
	private logger;

	constructor() {
		this.logger = new winston.Logger ({
			transports: [
				new (winston.transports.File) ({
					name: 'info file',
					filename: 'server/logs.log',
					level: 'info'
				}),
				new (winston.transports.File) ({
					name: 'error file',
					filename: 'server/logs.log',
					level: 'error'
				})
			]
		});
	}
	getMetaData(req) {
		return {
			url: req.url,
			method: req.method,
			user: req.user && req.user.username
		};
	}
	info(req, msg) {
		this.logger.info(msg, this.getMetaData(req));
	}

	error(req, msg) {
		this.logger.error(msg, this.getMetaData(req));
	}
};