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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcmFjdGVyLnNlcnZpY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9jaGFyYWN0ZXIvY2hhcmFjdGVyLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwrREFBdUQ7QUFFdkQsdUJBQXVDLFNBQVEseUJBQWM7SUFFNUQsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFNBQVM7UUFDL0IsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU07WUFDbEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNWLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9CLENBQUMsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsZUFBZSxDQUFDLElBQUksRUFBRSxFQUFFO1FBQ3ZCLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ2xDLElBQUksUUFBUSxHQUFJLEVBQUUsQ0FBQztZQUNuQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ2pELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDeEMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLENBQUM7WUFDRixDQUFDO1lBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7WUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNWLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9CLENBQUMsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsZUFBZSxDQUFDLElBQUk7UUFDbkIsSUFBSSxTQUFTLEdBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3BDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNmLEtBQUssRUFBRTtnQkFDTixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ1QsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNmLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDZixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2pCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7YUFDZjtTQUNELENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0QyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBQ0QsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUs7UUFDNUIsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU07WUFDbEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7aUJBQ3RCLElBQUksQ0FBQyxDQUFDO2dCQUNOLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxFQUFFLENBQUM7WUFDL0IsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxDQUFDO2dCQUNQLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNYLENBQUMsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUUsWUFBWSxDQUFDLElBQUk7UUFDYixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsU0FBUyxFQUFFLEVBQUMsaUJBQWlCLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztJQUM3RixDQUFDO0NBQ0o7QUF4REQsb0NBd0RDO0FBQUEsQ0FBQyJ9