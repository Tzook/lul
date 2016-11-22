'use strict';
const master_services_1 = require('../master/master.services');
class CharacterServices extends master_services_1.default {
    saveNewCharacter(user, character) {
        return new Promise((resolve, reject) => {
            user.characters.push(new this.Model(character));
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
        return Promise.resolve({
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CharacterServices;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcmFjdGVyLnNlcnZpY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9jaGFyYWN0ZXIvY2hhcmFjdGVyLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLGtDQUEyQiwyQkFBMkIsQ0FBQyxDQUFBO0FBRXZELGdDQUErQyx5QkFBYztJQUU1RCxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsU0FBUztRQUMvQixNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtZQUNsQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ1YsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxlQUFlLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDdkIsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU07WUFDbEMsSUFBSSxRQUFRLEdBQUksRUFBRSxDQUFDO1lBQ25CLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDakQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztZQUNGLENBQUM7WUFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztZQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ1YsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxlQUFlLENBQUMsSUFBSTtRQUNuQixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztZQUN0QixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixLQUFLLEVBQUU7Z0JBQ04sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNULElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2FBQ2Y7U0FDRCxDQUFDLENBQUM7SUFDSixDQUFDO0lBQ0QsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUs7UUFDNUIsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU07WUFDbEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7aUJBQ3RCLElBQUksQ0FBQyxDQUFDO2dCQUNOLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxFQUFFLENBQUM7WUFDL0IsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxDQUFDO2dCQUNQLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNYLENBQUMsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUUsWUFBWSxDQUFDLElBQUk7UUFDYixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsU0FBUyxFQUFFLEVBQUMsaUJBQWlCLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztJQUM3RixDQUFDO0FBQ0wsQ0FBQztBQXRERDttQ0FzREMsQ0FBQTtBQUFBLENBQUMifQ==