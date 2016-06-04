'use strict';
const master_model_1 = require('../master/master.model');
class CharacterModel extends master_model_1.default {
    init(files, app) {
        let looks = {
            g: Boolean
        };
        this.schema = {
            name: String,
            looks: looks
        };
        this.listenForSchemaAddition('Character');
    }
    get priority() {
        return 10;
    }
    createModel() {
        this.setModel('Character');
        this.addToSchema('User', { characters: [this.getModel().schema] });
        this.removeListen('Character');
        return Promise.resolve();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CharacterModel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcmFjdGVyLm1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9jaGFyYWN0ZXIvY2hhcmFjdGVyLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLCtCQUF3Qix3QkFBd0IsQ0FBQyxDQUFBO0FBRWpELDZCQUE0QyxzQkFBVztJQUVuRCxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUc7UUFDWCxJQUFJLEtBQUssR0FBRztZQUNSLENBQUMsRUFBRSxPQUFPO1NBQ2IsQ0FBQztRQUNGLElBQUksQ0FBQyxNQUFNLEdBQUc7WUFDVixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQUEsS0FBSztTQUNSLENBQUM7UUFDRixJQUFJLENBQUMsdUJBQXVCLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELElBQUksUUFBUTtRQUNSLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixDQUFDO0FBQ0wsQ0FBQztBQXZCRDtnQ0F1QkMsQ0FBQTtBQUFBLENBQUMifQ==