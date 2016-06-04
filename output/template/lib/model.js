'use strict';
let ModelBase = require('../master/master.model.js');
/**
 * Template's Model
 */
class TemplateModel extends ModelBase {
    /**
     * Creates the schema of the model
     */
    init(files, app) {
        this.schema = {
            something: String
        };
        this.listenForSchemaAddition('Template');
    }
    get priority() {
        return 1;
    }
    createModel() {
        this.setModel('Template');
        this.removeListen('Template');
        return Promise.resolve();
    }
}
module.exports = TemplateModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvdGVtcGxhdGUvbGliL21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBRXJEOztHQUVHO0FBQ0gsNEJBQTRCLFNBQVM7SUFDakM7O09BRUc7SUFDSCxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUc7UUFDWCxJQUFJLENBQUMsTUFBTSxHQUFHO1lBQ1YsU0FBUyxFQUFFLE1BQU07U0FDcEIsQ0FBQztRQUNGLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1IsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNiLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDN0IsQ0FBQztBQUNMLENBQUM7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyJ9