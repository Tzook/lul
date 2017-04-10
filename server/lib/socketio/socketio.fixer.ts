'use strict';
let Socket = require('socket.io/lib/socket');
let emit = require('events').EventEmitter.prototype.emit;

// Small fix on the onevent, to make the socket be sent as an exrta parameter on events
Socket.prototype.onevent = function(this: any, packet) {
  var args = packet.data || ['error']; // ADDED 'error'
  args.push(this); // ADDED THIS LINE

  if (null != packet.id) {
    args.push(this.ack(packet.id));
  }

  emit.apply(this, args);
};

// socket as a parameter for disconnect event too
Socket.prototype.onclose = function(this: any, reason) {
  if (!this.connected) {
    return this;
  }
  this.leaveAll();
  this.nsp.remove(this);
  this.client.remove(this);
  this.connected = false;
  this.disconnected = true;
  delete this.nsp.connected[this.id];
  this.emit('disconnect', reason, this); // ADDED the parameter 'this'
};