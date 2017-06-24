'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_services_1 = require("../master/master.services");
class CharacterServices extends master_services_1.default {
    saveNewCharacter(user, character) {
        return new Promise((resolve, reject) => {
            user.characters.push(character);
            user.save(e => {
                e ? reject(e) : resolve(user);
            });
        });
    }
    deleteCharacter(user, id) {
        return new Promise((resolve, reject) => {
            var newArray = [];
            for (var i = 0; i < user.characters.length; i++) {
                if (!user.characters[i]._id.equals(id)) {
                    newArray.push(user.characters[i]);
                }
            }
            user.characters = newArray;
            user.save(e => {
                e ? reject(e) : resolve(user);
            });
        });
    }
    convertToFormat(data) {
        let character = new this.Model({
            name: data.name,
            looks: {
                g: data.g,
                eyes: data.eyes,
                nose: data.nose,
                mouth: data.mouth,
                skin: data.skin,
                hair: data.hair
            }
        });
        this.model.addFields(character, data);
        return Promise.resolve(character);
    }
    checkIsNameUnique(name, error) {
        return new Promise((resolve, reject) => {
            this.getCharacter(name)
                .then(d => {
                d ? reject(error) : resolve();
            })
                .catch(e => {
                reject(e);
            });
        });
    }
    getCharacter(name) {
        return this.Q.ninvoke(this.mongoose.model('User'), 'findOne', { 'characters.name': name });
    }
}
exports.default = CharacterServices;
;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NlcnZlci9saWIvY2hhcmFjdGVyL2NoYXJhY3Rlci5zZXJ2aWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsK0RBQXVEO0FBRXZELHVCQUF1QyxTQUFRLHlCQUFjO0lBRTVELGdCQUFnQixDQUFDLElBQUksRUFBRSxTQUFTO1FBQy9CLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ2xDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDVixDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQixDQUFDLENBQUMsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELGVBQWUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUN2QixNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtZQUNsQyxJQUFJLFFBQVEsR0FBSSxFQUFFLENBQUM7WUFDbkIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNqRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3hDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxDQUFDO1lBQ0YsQ0FBQztZQUNELElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO1lBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDVixDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQixDQUFDLENBQUMsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELGVBQWUsQ0FBQyxJQUFJO1FBQ25CLElBQUksU0FBUyxHQUFTLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztZQUNwQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixLQUFLLEVBQUU7Z0JBQ04sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNULElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2FBQ2Y7U0FDRCxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUNELGlCQUFpQixDQUFDLElBQUksRUFBRSxLQUFLO1FBQzVCLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ2xDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO2lCQUN0QixJQUFJLENBQUMsQ0FBQztnQkFDTixDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDO1lBQy9CLENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsQ0FBQztnQkFDUCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDWCxDQUFDLENBQUMsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVFLFlBQVksQ0FBQyxJQUFJO1FBQ2IsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFNBQVMsRUFBRSxFQUFDLGlCQUFpQixFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7SUFDN0YsQ0FBQztDQUNKO0FBeERELG9DQXdEQztBQUFBLENBQUMiLCJmaWxlIjoibGliL2NoYXJhY3Rlci9jaGFyYWN0ZXIuc2VydmljZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5pbXBvcnQgTWFzdGVyU2VydmljZXMgZnJvbSAnLi4vbWFzdGVyL21hc3Rlci5zZXJ2aWNlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYXJhY3RlclNlcnZpY2VzIGV4dGVuZHMgTWFzdGVyU2VydmljZXMge1xuXG5cdHNhdmVOZXdDaGFyYWN0ZXIodXNlciwgY2hhcmFjdGVyKSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdHVzZXIuY2hhcmFjdGVycy5wdXNoKGNoYXJhY3Rlcik7XG5cdFx0XHR1c2VyLnNhdmUoZSA9PiB7XG5cdFx0XHRcdGUgPyByZWplY3QoZSkgOiByZXNvbHZlKHVzZXIpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHRkZWxldGVDaGFyYWN0ZXIodXNlciwgaWQpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0dmFyIG5ld0FycmF5ICA9IFtdO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB1c2VyLmNoYXJhY3RlcnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKCF1c2VyLmNoYXJhY3RlcnNbaV0uX2lkLmVxdWFscyhpZCkpIHtcblx0XHRcdFx0XHRuZXdBcnJheS5wdXNoKHVzZXIuY2hhcmFjdGVyc1tpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHVzZXIuY2hhcmFjdGVycyA9IG5ld0FycmF5O1xuXHRcdFx0dXNlci5zYXZlKGUgPT4ge1xuXHRcdFx0XHRlID8gcmVqZWN0KGUpIDogcmVzb2x2ZSh1c2VyKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0Y29udmVydFRvRm9ybWF0KGRhdGEpIHtcblx0XHRsZXQgY2hhcmFjdGVyOiBDaGFyID0gbmV3IHRoaXMuTW9kZWwoe1xuXHRcdFx0bmFtZTogZGF0YS5uYW1lLFxuXHRcdFx0bG9va3M6IHtcblx0XHRcdFx0ZzogZGF0YS5nLFxuXHRcdFx0XHRleWVzOiBkYXRhLmV5ZXMsXG5cdFx0XHRcdG5vc2U6IGRhdGEubm9zZSxcblx0XHRcdFx0bW91dGg6IGRhdGEubW91dGgsXG5cdFx0XHRcdHNraW46IGRhdGEuc2tpbixcblx0XHRcdFx0aGFpcjogZGF0YS5oYWlyXG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dGhpcy5tb2RlbC5hZGRGaWVsZHMoY2hhcmFjdGVyLCBkYXRhKTtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGNoYXJhY3Rlcik7XG5cdH1cblx0Y2hlY2tJc05hbWVVbmlxdWUobmFtZSwgZXJyb3IpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0dGhpcy5nZXRDaGFyYWN0ZXIobmFtZSlcblx0XHRcdC50aGVuKGQgPT4ge1xuXHRcdFx0XHRkID8gcmVqZWN0KGVycm9yKSA6IHJlc29sdmUoKTtcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZSA9PiB7XG5cdFx0XHRcdHJlamVjdChlKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cbiAgICBnZXRDaGFyYWN0ZXIobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5RLm5pbnZva2UodGhpcy5tb25nb29zZS5tb2RlbCgnVXNlcicpLCAnZmluZE9uZScsIHsnY2hhcmFjdGVycy5uYW1lJzogbmFtZX0pO1xuICAgIH1cbn07Il19
