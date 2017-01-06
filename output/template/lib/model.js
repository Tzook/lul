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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvdGVtcGxhdGUvbGliL21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBRXJEOztHQUVHO0FBQ0gsbUJBQW9CLFNBQVEsU0FBUztJQUNqQzs7T0FFRztJQUNILElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRztRQUNYLElBQUksQ0FBQyxNQUFNLEdBQUc7WUFDVixTQUFTLEVBQUUsTUFBTTtTQUNwQixDQUFDO1FBQ0YsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDUixNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixDQUFDO0NBQ0o7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyJ9