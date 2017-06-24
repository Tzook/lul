'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_services_1 = require("../master/master.services");
class SocketioServices extends master_services_1.default {
    getConfig() {
        return this.config;
    }
    warmConfig() {
        return this.Model.find({})
            .then((docs) => {
            console.log("got config");
            return this.config = docs[0];
        });
    }
}
exports.default = SocketioServices;
;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NlcnZlci9saWIvc29ja2V0aW8vc29ja2V0aW8uc2VydmljZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLCtEQUF1RDtBQUV2RCxzQkFBc0MsU0FBUSx5QkFBYztJQUdwRCxTQUFTO1FBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDcEIsQ0FBQztJQUVTLFVBQVU7UUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQzthQUN4QixJQUFJLENBQUMsQ0FBQyxJQUFjO1lBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNEO0FBZEQsbUNBY0M7QUFBQSxDQUFDIiwiZmlsZSI6ImxpYi9zb2NrZXRpby9zb2NrZXRpby5zZXJ2aWNlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcbmltcG9ydCBNYXN0ZXJTZXJ2aWNlcyBmcm9tICcuLi9tYXN0ZXIvbWFzdGVyLnNlcnZpY2VzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU29ja2V0aW9TZXJ2aWNlcyBleHRlbmRzIE1hc3RlclNlcnZpY2VzIHtcblx0cHJpdmF0ZSBjb25maWc6IENvbmZpZztcblxuXHRwdWJsaWMgZ2V0Q29uZmlnKCk6IENvbmZpZyB7XG5cdFx0cmV0dXJuIHRoaXMuY29uZmlnO1xuXHR9XG5cbiAgICBwdWJsaWMgd2FybUNvbmZpZygpOiBQcm9taXNlPENvbmZpZz4ge1xuXHRcdHJldHVybiB0aGlzLk1vZGVsLmZpbmQoe30pXG5cdFx0XHQudGhlbigoZG9jczogQ29uZmlnW10pID0+IHtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJnb3QgY29uZmlnXCIpO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb25maWcgPSBkb2NzWzBdO1xuXHRcdFx0fSk7XG5cdH1cbn07Il19
