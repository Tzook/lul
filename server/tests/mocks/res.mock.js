'use strict';
let self;
/**
 * res mock
 */
class ResMock {
	constructor() {
		self = this;
	}
	status(status) {
		self.status = status;
		return self;
	}
	send(dataOrError) {
		self.latestData = dataOrError; 
	}
	popLatestData() {
		let temp = self.latestData;
		self.latestData = undefined;
		return temp;
	}
	next() {
		self.latestData = 'next';
	}
	
	done(e, d) {
		self.latestData = e || d;
	}
}

module.exports = ResMock;