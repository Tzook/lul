'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_controller_1 = require("../master/master.controller");
class StatsController extends master_controller_1.default {
    addExp(character, exp) {
        console.log("Adding exp to char", exp, character.stats.exp, character.name);
        character.stats.exp += exp;
        let expNeededToLevel = this.services.getExp(character.stats.lvl);
        if (character.stats.exp >= expNeededToLevel) {
            character.stats.exp -= expNeededToLevel;
            this.services.lvlUp(character.stats);
            expNeededToLevel = this.services.getExp(character.stats.lvl);
            if (character.stats.exp >= expNeededToLevel) {
                console.log("Stopping 2nd level", character.stats.exp, expNeededToLevel);
                character.stats.exp = expNeededToLevel - 1;
            }
        }
    }
    addHp(character, hp) {
        let nowHp = character.stats.hp.now;
        character.stats.hp.now = Math.min(nowHp + hp, character.stats.hp.total);
        let gainedHp = nowHp !== character.stats.hp.now;
        console.log("Adding hp to char", hp, character.stats.hp.now, character.name);
        return gainedHp;
    }
    addMp(character, mp) {
        let nowMp = character.stats.mp.now;
        character.stats.mp.now = Math.min(nowMp + mp, character.stats.mp.total);
        let gainedMp = nowMp !== character.stats.mp.now;
        console.log("Adding mp to char", mp, character.stats.mp.now, character.name);
        return gainedMp;
    }
}
exports.default = StatsController;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHMuY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvc3RhdHMvc3RhdHMuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBRzNELHFCQUFxQyxTQUFRLDJCQUFnQjtJQUdsRCxNQUFNLENBQUMsU0FBZSxFQUFFLEdBQVc7UUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVFLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQztRQUUzQixJQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakUsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQzFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLGdCQUFnQixDQUFDO1lBQ3hDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUdyQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQztnQkFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUN6RSxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7WUFDL0MsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRU0sS0FBSyxDQUFDLFNBQWUsRUFBRSxFQUFVO1FBQ3BDLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztRQUNuQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hFLElBQUksUUFBUSxHQUFHLEtBQUssS0FBSyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUM7UUFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3RSxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFFTSxLQUFLLENBQUMsU0FBZSxFQUFFLEVBQVU7UUFDcEMsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDO1FBQ25DLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEUsSUFBSSxRQUFRLEdBQUcsS0FBSyxLQUFLLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztRQUNoRCxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdFLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDcEIsQ0FBQztDQUNKO0FBcENELGtDQW9DQztBQUFBLENBQUMifQ==