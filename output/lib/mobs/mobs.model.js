'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_model_1 = require("../master/master.model");
const MOB_SCHEMA = {
    mobId: String,
    name: String,
    hp: Number,
    lvl: Number,
    exp: Number,
    minDmg: Number,
    maxDmg: Number
};
class MobsModel extends master_model_1.default {
    init(files, app) {
        this.controller = files.controller;
        this.schema = Object.assign({}, MOB_SCHEMA);
        this.listenForSchemaAddition('Mobs');
    }
    get priority() {
        return 10;
    }
    createModel() {
        this.setModel('Mobs');
        setTimeout(() => this.controller.warmMobsInfo());
        this.removeListen('Mobs');
        return Promise.resolve();
    }
}
exports.default = MobsModel;
;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NlcnZlci9saWIvbW9icy9tb2JzLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYix5REFBaUQ7QUFHakQsTUFBTSxVQUFVLEdBQUc7SUFDZixLQUFLLEVBQUUsTUFBTTtJQUNiLElBQUksRUFBRSxNQUFNO0lBQ1osRUFBRSxFQUFFLE1BQU07SUFDVixHQUFHLEVBQUUsTUFBTTtJQUNYLEdBQUcsRUFBRSxNQUFNO0lBQ1gsTUFBTSxFQUFFLE1BQU07SUFDZCxNQUFNLEVBQUUsTUFBTTtDQUNqQixDQUFDO0FBRUYsZUFBK0IsU0FBUSxzQkFBVztJQUc5QyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUc7UUFDWCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFFbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELElBQUksUUFBUTtRQUNSLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQsV0FBVztRQUVQLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFNUIsVUFBVSxDQUFDLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixDQUFDO0NBQ0o7QUF0QkQsNEJBc0JDO0FBQUEsQ0FBQyIsImZpbGUiOiJsaWIvbW9icy9tb2JzLm1vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuaW1wb3J0IE1hc3Rlck1vZGVsIGZyb20gJy4uL21hc3Rlci9tYXN0ZXIubW9kZWwnO1xuaW1wb3J0IE1vYnNDb250cm9sbGVyIGZyb20gXCIuL21vYnMuY29udHJvbGxlclwiO1xuXG5jb25zdCBNT0JfU0NIRU1BID0ge1xuICAgIG1vYklkOiBTdHJpbmcsIFxuICAgIG5hbWU6IFN0cmluZyxcbiAgICBocDogTnVtYmVyLFxuICAgIGx2bDogTnVtYmVyLFxuICAgIGV4cDogTnVtYmVyLFxuICAgIG1pbkRtZzogTnVtYmVyLFxuICAgIG1heERtZzogTnVtYmVyXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb2JzTW9kZWwgZXh0ZW5kcyBNYXN0ZXJNb2RlbCB7XG5cdHByb3RlY3RlZCBjb250cm9sbGVyOiBNb2JzQ29udHJvbGxlcjtcbiAgICBcbiAgICBpbml0KGZpbGVzLCBhcHApIHtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gZmlsZXMuY29udHJvbGxlcjtcblxuICAgICAgICB0aGlzLnNjaGVtYSA9IE9iamVjdC5hc3NpZ24oe30sIE1PQl9TQ0hFTUEpO1xuICAgICAgICB0aGlzLmxpc3RlbkZvclNjaGVtYUFkZGl0aW9uKCdNb2JzJyk7XG4gICAgfVxuXG4gICAgZ2V0IHByaW9yaXR5KCkge1xuICAgICAgICByZXR1cm4gMTA7XG4gICAgfVxuXG4gICAgY3JlYXRlTW9kZWwoKSB7XG5cbiAgICAgICAgdGhpcy5zZXRNb2RlbCgnTW9icycpO1xuXG5cdFx0c2V0VGltZW91dCgoKSA9PiB0aGlzLmNvbnRyb2xsZXIud2FybU1vYnNJbmZvKCkpOyAvLyB0aW1lb3V0IHNvIHRoZSBNb2RlbCBjYW4gYmUgc2V0XG4gICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuKCdNb2JzJyk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG59OyJdfQ==
