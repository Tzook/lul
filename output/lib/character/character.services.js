'use strict';
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CharacterServices;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcmFjdGVyLnNlcnZpY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9jaGFyYWN0ZXIvY2hhcmFjdGVyLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLCtEQUF1RDtBQUV2RCx1QkFBdUMsU0FBUSx5QkFBYztJQUU1RCxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsU0FBUztRQUMvQixNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtZQUNsQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ1YsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxlQUFlLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDdkIsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU07WUFDbEMsSUFBSSxRQUFRLEdBQUksRUFBRSxDQUFDO1lBQ25CLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDakQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztZQUNGLENBQUM7WUFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztZQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ1YsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxlQUFlLENBQUMsSUFBSTtRQUNuQixJQUFJLFNBQVMsR0FBUyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDcEMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsS0FBSyxFQUFFO2dCQUNOLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDVCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNmLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDakIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNmLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTthQUNmO1NBQ0QsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFDRCxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsS0FBSztRQUM1QixNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtZQUNsQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQztpQkFDdEIsSUFBSSxDQUFDLENBQUM7Z0JBQ04sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQztZQUMvQixDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLENBQUM7Z0JBQ1AsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRSxZQUFZLENBQUMsSUFBSTtRQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBQyxpQkFBaUIsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0lBQzdGLENBQUM7Q0FDSjs7QUF4REQsb0NBd0RDO0FBQUEsQ0FBQyJ9