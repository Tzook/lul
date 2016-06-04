'use strict';
let emitter = new (require('events').EventEmitter)(); // TODO pass it along as param
/**
 *  Model base class to manage the model
 */
class ModelBase {
    /**
     * Default constructor
     */
    constructor(mongoose) {
        this.mongoose = mongoose || require('mongoose');
    }
    init(files, app) {
    }
    createModel() {
        // inherit me!
        return Promise.resolve();
    }
    /**
     * Sets the mongoose model.
     * If a previous model has been created, returns it instead
     */
    setModel(name) {
        try {
            this.model = this.mongoose.model(name);
        }
        catch (e) {
            this.model = this.mongoose.model(name, this.mongoose.Schema(this.schema));
        }
    }
    /**
     * Returns the mongoose model
     */
    getModel(name) {
        return name ? this.mongoose.model(name) : this.model;
    }
    get priority() {
        return 1;
    }
    addToSchema(model, data) {
        emitter.emit(model + "Schema", data);
    }
    listenForSchemaAddition(model) {
        emitter.on(model + "Schema", addToSchema.bind(this));
    }
    removeListen(model) {
        emitter.removeListener(model + "Schema", addToSchema.bind(this));
    }
}
;
function addToSchema(data) {
    for (let i in data) {
        this.schema[i] = data[i];
    }
}
module.exports = ModelBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzdGVyLm1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9tYXN0ZXIvbWFzdGVyLm1vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDLDhCQUE4QjtBQUNwRjs7R0FFRztBQUNIO0lBQ0k7O09BRUc7SUFDSCxZQUFZLFFBQVE7UUFDaEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUc7SUFFZixDQUFDO0lBRUQsV0FBVztRQUNQLGNBQWM7UUFDZCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxRQUFRLENBQUMsSUFBSTtRQUNULElBQUksQ0FBQztZQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsQ0FBRTtRQUFBLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM5RSxDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0gsUUFBUSxDQUFDLElBQUk7UUFDVCxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDekQsQ0FBQztJQUVELElBQUksUUFBUTtRQUNSLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRUQsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJO1FBQ25CLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsdUJBQXVCLENBQUMsS0FBSztRQUN6QixPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssR0FBRyxRQUFRLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxZQUFZLENBQUMsS0FBSztRQUNkLE9BQU8sQ0FBQyxjQUFjLENBQUMsS0FBSyxHQUFHLFFBQVEsRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDckUsQ0FBQztBQUNMLENBQUM7QUFBQSxDQUFDO0FBQ0YscUJBQXFCLElBQUk7SUFDckIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QixDQUFDO0FBQ0wsQ0FBQztBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDIn0=