'use strict';
let ModelBase = require('../master/master.model.js');
/**
 * Movement's Model
 */
class MovementModel extends ModelBase {
    init(files, app) {
        this.addToCharacterSchema = {
            position: {
                x: { type: Number, default: 0 },
                y: { type: Number, default: 0 },
                z: { type: Number, default: 0 }
            }
        };
    }
    get priority() {
        return 20;
    }
    createModel() {
        this.addToSchema('Character', this.addToCharacterSchema);
        return Promise.resolve();
    }
}
module.exports = MovementModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW92ZW1lbnQubW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL21vdmVtZW50L21vdmVtZW50Lm1vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBRXJEOztHQUVHO0FBQ0gsNEJBQTRCLFNBQVM7SUFDbEMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHO1FBQ1YsSUFBSSxDQUFDLG9CQUFvQixHQUFHO1lBQ3hCLFFBQVEsRUFBRTtnQkFDTixDQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUM7Z0JBQzdCLENBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQztnQkFDN0IsQ0FBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFDO2FBQ2hDO1NBQ0osQ0FBQztJQUNOLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDUixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUN6RCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7QUFDTCxDQUFDO0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMifQ==