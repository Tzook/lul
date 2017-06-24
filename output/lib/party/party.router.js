'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const socketio_router_base_1 = require("../socketio/socketio.router.base");
let config = require('../../../server/lib/party/party.config.json');
class PartyRouter extends socketio_router_base_1.default {
    [config.SERVER_GETS.CREATE_PARTY.name](data, socket) {
        if (this.controller.getCharParty(socket)) {
            return this.sendError(data, socket, "Cannot create - character already in party");
        }
        this.controller.createParty(socket);
    }
    [config.SERVER_GETS.INVITE_TO_PARTY.name](data, socket) {
        let party = this.controller.getCharParty(socket);
        if (!party) {
            return this.sendError(data, socket, "Cannot invite - must be in a party", true, true);
        }
        else if (!this.middleware.isLeader(socket.character.name, party)) {
            return this.sendError(data, socket, "Cannot invite - must be party leader", true, true);
        }
        else if (this.middleware.isPartyFull(party)) {
            return this.sendError(data, socket, "Cannot invite - party is full", true, true);
        }
        let inviteeSocket = socket.map.get(data.char_name);
        if (!inviteeSocket) {
            return this.sendError(data, socket, "Cannot invite - invitee is logged off", true, true);
        }
        else if (this.controller.getCharParty(inviteeSocket)) {
            return this.sendError(data, socket, "Cannot invite - invitee is already in a party", true, true);
        }
        this.controller.inviteToParty(inviteeSocket, party);
    }
    [config.SERVER_GETS.JOIN_PARTY.name](data, socket) {
        if (this.controller.getCharParty(socket)) {
            return this.sendError(data, socket, "Cannot join - already in party", true, true);
        }
        let party = this.controller.getParty(data.leader_name);
        if (!party) {
            return this.sendError(data, socket, "Cannot join - party is disbanded", true, true);
        }
        else if (!this.middleware.isInvited(party, socket)) {
            return this.sendError(data, socket, "Cannot join - not invited anymore", true, true);
        }
        else if (!this.middleware.isLeader(data.leader_name, party)) {
            return this.sendError(data, socket, "Cannot join - party leader has changed", true, true);
        }
        else if (this.middleware.isPartyFull(party)) {
            return this.sendError(data, socket, "Cannot join - party is full", true, true);
        }
        this.controller.joinParty(socket, party);
    }
    [config.SERVER_GETS.LEAVE_PARTY.name](data, socket) {
        let party = this.controller.getCharParty(socket);
        if (!party) {
            return this.sendError(data, socket, "Cannot leave - must be in a party", true, true);
        }
        this.controller.leaveParty(socket, party);
    }
    [config.SERVER_GETS.LEAD_PARTY.name](data, socket) {
        let party = this.controller.getCharParty(socket);
        if (!party) {
            return this.sendError(data, socket, "Cannot switch lead - must be in a party", true, true);
        }
        else if (!this.middleware.isLeader(socket.character.name, party)) {
            return this.sendError(data, socket, "Cannot switch lead - must be party leader", true, true);
        }
        else if (!this.middleware.isMember(data.char_name, party)) {
            return this.sendError(data, socket, "Cannot switch lead - character not in party", true, true);
        }
        this.controller.makeLeader(socket, data.char_name, party);
    }
    [config.SERVER_GETS.KICK_FROM_PARTY.name](data, socket) {
        let party = this.controller.getCharParty(socket);
        if (!party) {
            return this.sendError(data, socket, "Cannot kick - must be in a party", true, true);
        }
        else if (!this.middleware.isLeader(socket.character.name, party)) {
            return this.sendError(data, socket, "Cannot kick - must be party leader", true, true);
        }
        else if (!this.middleware.isMember(data.char_name, party)) {
            return this.sendError(data, socket, "Cannot kick - character not in party", true, true);
        }
        this.controller.kickFromParty(socket, data.char_name, party);
    }
    onConnected(socket) {
        let party = this.controller.getCharParty(socket);
        if (party) {
            this.controller.tellPartyMembers(socket, party);
        }
    }
    getCharParty(socket) {
        return this.controller.getCharParty(socket);
    }
    getPartyMembersInMap(socket) {
        return this.controller.getPartyMembersInMap(socket);
    }
    arePartyMembers(name1, name2) {
        return this.controller.arePartyMembers(name1, name2);
    }
}
exports.default = PartyRouter;
;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NlcnZlci9saWIvcGFydHkvcGFydHkucm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwyRUFBa0U7QUFHbEUsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7QUFFcEUsaUJBQWlDLFNBQVEsOEJBQWtCO0lBSXZELENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQWtCO1FBQzNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLDRDQUE0QyxDQUFDLENBQUM7UUFDdEYsQ0FBQztRQUNELElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxNQUFrQjtRQUMzRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDVCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLG9DQUFvQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMxRixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pFLE1BQU0sQ0FB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J3VzZSBzdHJpY3QnO1xuaW1wb3J0IFNvY2tldGlvUm91dGVyQmFzZSBmcm9tICcuLi9zb2NrZXRpby9zb2NrZXRpby5yb3V0ZXIuYmFzZSc7XG5pbXBvcnQgUGFydHlDb250cm9sbGVyIGZyb20gJy4vcGFydHkuY29udHJvbGxlcic7XG5pbXBvcnQgUGFydHlNaWRkbGV3YXJlIGZyb20gJy4vcGFydHkubWlkZGxld2FyZSc7XG5sZXQgY29uZmlnID0gcmVxdWlyZSgnLi4vLi4vLi4vc2VydmVyL2xpYi9wYXJ0eS9wYXJ0eS5jb25maWcuanNvbicpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJ0eVJvdXRlciBleHRlbmRzIFNvY2tldGlvUm91dGVyQmFzZSB7XG4gICAgcHJvdGVjdGVkIGNvbnRyb2xsZXI6IFBhcnR5Q29udHJvbGxlcjtcbiAgICBwcm90ZWN0ZWQgbWlkZGxld2FyZTogUGFydHlNaWRkbGV3YXJlO1xuICAgIFxuICAgIFtjb25maWcuU0VSVkVSX0dFVFMuQ1JFQVRFX1BBUlRZLm5hbWVdKGRhdGEsIHNvY2tldDogR2FtZVNvY2tldCkge1xuICAgICAgICBpZiAodGhpcy5jb250cm9sbGVyLmdldENoYXJQYXJ0eShzb2NrZXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kRXJyb3IoZGF0YSwgc29ja2V0LCBcIkNhbm5vdCBjcmVhdGUgLSBjaGFyYWN0ZXIgYWxyZWFkeSBpbiBwYXJ0eVwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY3JlYXRlUGFydHkoc29ja2V0KTtcblx0fVxuXG5cdFtjb25maWcuU0VSVkVSX0dFVFMuSU5WSVRFX1RPX1BBUlRZLm5hbWVdKGRhdGEsIHNvY2tldDogR2FtZVNvY2tldCkge1xuICAgICAgICBsZXQgcGFydHkgPSB0aGlzLmNvbnRyb2xsZXIuZ2V0Q2hhclBhcnR5KHNvY2tldCk7XG4gICAgICAgIGlmICghcGFydHkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmRFcnJvcihkYXRhLCBzb2NrZXQsIFwiQ2Fubm90IGludml0ZSAtIG11c3QgYmUgaW4gYSBwYXJ0eVwiLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5taWRkbGV3YXJlLmlzTGVhZGVyKHNvY2tldC5jaGFyYWN0ZXIubmFtZSwgcGFydHkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kRXJyb3IoZGF0YSwgc29ja2V0LCBcIkNhbm5vdCBpbnZpdGUgLSBtdXN0IGJlIHBhcnR5IGxlYWRlclwiLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1pZGRsZXdhcmUuaXNQYXJ0eUZ1bGwocGFydHkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kRXJyb3IoZGF0YSwgc29ja2V0LCBcIkNhbm5vdCBpbnZpdGUgLSBwYXJ0eSBpcyBmdWxsXCIsIHRydWUsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGludml0ZWVTb2NrZXQgPSBzb2NrZXQubWFwLmdldChkYXRhLmNoYXJfbmFtZSk7XG4gICAgICAgIGlmICghaW52aXRlZVNvY2tldCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZEVycm9yKGRhdGEsIHNvY2tldCwgXCJDYW5ub3QgaW52aXRlIC0gaW52aXRlZSBpcyBsb2dnZWQgb2ZmXCIsIHRydWUsIHRydWUpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY29udHJvbGxlci5nZXRDaGFyUGFydHkoaW52aXRlZVNvY2tldCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmRFcnJvcihkYXRhLCBzb2NrZXQsIFwiQ2Fubm90IGludml0ZSAtIGludml0ZWUgaXMgYWxyZWFkeSBpbiBhIHBhcnR5XCIsIHRydWUsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb250cm9sbGVyLmludml0ZVRvUGFydHkoaW52aXRlZVNvY2tldCwgcGFydHkpO1xuXHR9XG5cblx0W2NvbmZpZy5TRVJWRVJfR0VUUy5KT0lOX1BBUlRZLm5hbWVdKGRhdGEsIHNvY2tldDogR2FtZVNvY2tldCkge1xuICAgICAgICBpZiAodGhpcy5jb250cm9sbGVyLmdldENoYXJQYXJ0eShzb2NrZXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kRXJyb3IoZGF0YSwgc29ja2V0LCBcIkNhbm5vdCBqb2luIC0gYWxyZWFkeSBpbiBwYXJ0eVwiLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwYXJ0eSA9IHRoaXMuY29udHJvbGxlci5nZXRQYXJ0eShkYXRhLmxlYWRlcl9uYW1lKTtcbiAgICAgICAgaWYgKCFwYXJ0eSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZEVycm9yKGRhdGEsIHNvY2tldCwgXCJDYW5ub3Qgam9pbiAtIHBhcnR5IGlzIGRpc2JhbmRlZFwiLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5taWRkbGV3YXJlLmlzSW52aXRlZChwYXJ0eSwgc29ja2V0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZEVycm9yKGRhdGEsIHNvY2tldCwgXCJDYW5ub3Qgam9pbiAtIG5vdCBpbnZpdGVkIGFueW1vcmVcIiwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMubWlkZGxld2FyZS5pc0xlYWRlcihkYXRhLmxlYWRlcl9uYW1lLCBwYXJ0eSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmRFcnJvcihkYXRhLCBzb2NrZXQsIFwiQ2Fubm90IGpvaW4gLSBwYXJ0eSBsZWFkZXIgaGFzIGNoYW5nZWRcIiwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5taWRkbGV3YXJlLmlzUGFydHlGdWxsKHBhcnR5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZEVycm9yKGRhdGEsIHNvY2tldCwgXCJDYW5ub3Qgam9pbiAtIHBhcnR5IGlzIGZ1bGxcIiwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuam9pblBhcnR5KHNvY2tldCwgcGFydHkpO1xuXHR9XG5cblx0W2NvbmZpZy5TRVJWRVJfR0VUUy5MRUFWRV9QQVJUWS5uYW1lXShkYXRhLCBzb2NrZXQ6IEdhbWVTb2NrZXQpIHtcbiAgICAgICAgbGV0IHBhcnR5ID0gdGhpcy5jb250cm9sbGVyLmdldENoYXJQYXJ0eShzb2NrZXQpO1xuICAgICAgICBpZiAoIXBhcnR5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kRXJyb3IoZGF0YSwgc29ja2V0LCBcIkNhbm5vdCBsZWF2ZSAtIG11c3QgYmUgaW4gYSBwYXJ0eVwiLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIubGVhdmVQYXJ0eShzb2NrZXQsIHBhcnR5KTtcblx0fVxuXG5cdFtjb25maWcuU0VSVkVSX0dFVFMuTEVBRF9QQVJUWS5uYW1lXShkYXRhLCBzb2NrZXQ6IEdhbWVTb2NrZXQpIHtcbiAgICAgICAgbGV0IHBhcnR5ID0gdGhpcy5jb250cm9sbGVyLmdldENoYXJQYXJ0eShzb2NrZXQpO1xuICAgICAgICBpZiAoIXBhcnR5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kRXJyb3IoZGF0YSwgc29ja2V0LCBcIkNhbm5vdCBzd2l0Y2ggbGVhZCAtIG11c3QgYmUgaW4gYSBwYXJ0eVwiLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5taWRkbGV3YXJlLmlzTGVhZGVyKHNvY2tldC5jaGFyYWN0ZXIubmFtZSwgcGFydHkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kRXJyb3IoZGF0YSwgc29ja2V0LCBcIkNhbm5vdCBzd2l0Y2ggbGVhZCAtIG11c3QgYmUgcGFydHkgbGVhZGVyXCIsIHRydWUsIHRydWUpO1xuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLm1pZGRsZXdhcmUuaXNNZW1iZXIoZGF0YS5jaGFyX25hbWUsIHBhcnR5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZEVycm9yKGRhdGEsIHNvY2tldCwgXCJDYW5ub3Qgc3dpdGNoIGxlYWQgLSBjaGFyYWN0ZXIgbm90IGluIHBhcnR5XCIsIHRydWUsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29udHJvbGxlci5tYWtlTGVhZGVyKHNvY2tldCwgZGF0YS5jaGFyX25hbWUsIHBhcnR5KTtcblx0fVxuXG5cdFtjb25maWcuU0VSVkVSX0dFVFMuS0lDS19GUk9NX1BBUlRZLm5hbWVdKGRhdGEsIHNvY2tldDogR2FtZVNvY2tldCkge1xuICAgICAgICBsZXQgcGFydHkgPSB0aGlzLmNvbnRyb2xsZXIuZ2V0Q2hhclBhcnR5KHNvY2tldCk7XG4gICAgICAgIGlmICghcGFydHkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmRFcnJvcihkYXRhLCBzb2NrZXQsIFwiQ2Fubm90IGtpY2sgLSBtdXN0IGJlIGluIGEgcGFydHlcIiwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMubWlkZGxld2FyZS5pc0xlYWRlcihzb2NrZXQuY2hhcmFjdGVyLm5hbWUsIHBhcnR5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZEVycm9yKGRhdGEsIHNvY2tldCwgXCJDYW5ub3Qga2ljayAtIG11c3QgYmUgcGFydHkgbGVhZGVyXCIsIHRydWUsIHRydWUpO1xuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLm1pZGRsZXdhcmUuaXNNZW1iZXIoZGF0YS5jaGFyX25hbWUsIHBhcnR5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZEVycm9yKGRhdGEsIHNvY2tldCwgXCJDYW5ub3Qga2ljayAtIGNoYXJhY3RlciBub3QgaW4gcGFydHlcIiwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250cm9sbGVyLmtpY2tGcm9tUGFydHkoc29ja2V0LCBkYXRhLmNoYXJfbmFtZSwgcGFydHkpO1xuXHR9XG5cbiAgICBwdWJsaWMgb25Db25uZWN0ZWQoc29ja2V0OiBHYW1lU29ja2V0KSB7XG4gICAgICAgIGxldCBwYXJ0eSA9IHRoaXMuY29udHJvbGxlci5nZXRDaGFyUGFydHkoc29ja2V0KTtcbiAgICAgICAgaWYgKHBhcnR5KSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIudGVsbFBhcnR5TWVtYmVycyhzb2NrZXQsIHBhcnR5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRDaGFyUGFydHkoc29ja2V0OiBHYW1lU29ja2V0KTogUEFSVFlfTU9ERUx8dW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlci5nZXRDaGFyUGFydHkoc29ja2V0KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0UGFydHlNZW1iZXJzSW5NYXAoc29ja2V0OiBHYW1lU29ja2V0KTogR2FtZVNvY2tldFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlci5nZXRQYXJ0eU1lbWJlcnNJbk1hcChzb2NrZXQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhcmVQYXJ0eU1lbWJlcnMobmFtZTE6IHN0cmluZywgbmFtZTI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyLmFyZVBhcnR5TWVtYmVycyhuYW1lMSwgbmFtZTIpO1xuICAgIH1cbn07XG4iXX0=
