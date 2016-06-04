'use strict';
let MiddlewareBase = require('../master/master.middleware.js');
/**
 * Rooms's middleware
 */
class RoomsMiddleware extends MiddlewareBase {
    checkIfUserIsInRoom(res, req, next) {
        let rooms = (req.user) ? req.user.rooms : [], roomName = req.params.roomName;
        if (rooms && rooms.length === 0 || rooms.indexOf(roomName) === -1)
            this.sendError(res, this.LOGS.LEAVE_ROOM_FAILURE_USER_NOT_IN_ROOM, { room: roomName });
        // NOAM, we (should..) always use curly braces on ifs and loops. delete comment
        next();
    }
}
module.exports = RoomsMiddleware;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMubWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvcm9vbXMvcm9vbXMubWlkZGxld2FyZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFDYixJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQUUvRDs7R0FFRztBQUNILDhCQUE4QixjQUFjO0lBQzNDLG1CQUFtQixDQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSTtRQUNsQyxJQUFJLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQzNDLFFBQVEsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNqRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxFQUFFLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7UUFDdEYsK0VBQStFO1FBQy9FLElBQUksRUFBRSxDQUFDO0lBQ1IsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQyJ9