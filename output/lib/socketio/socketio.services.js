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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja2V0aW8uc2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL3NvY2tldGlvL3NvY2tldGlvLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwrREFBdUQ7QUFFdkQsc0JBQXNDLFNBQVEseUJBQWM7SUFHcEQsU0FBUztRQUNmLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3BCLENBQUM7SUFFUyxVQUFVO1FBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7YUFDeEIsSUFBSSxDQUFDLENBQUMsSUFBYztZQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRDtBQWRELG1DQWNDO0FBQUEsQ0FBQyJ9