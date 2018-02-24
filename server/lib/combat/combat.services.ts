
import MasterServices from '../master/master.services';
import TalentsRouter from '../talents/talents.router';
import { getDamageRange } from '../mobs/mobs.services';

export default class CombatServices extends MasterServices {
    protected talentsRouter: TalentsRouter;
	
	init(files, app) {
		this.talentsRouter = files.routers.talents;
		super.init(files, app);
	}

	public calculateDamage(socket: GameSocket, target: GameSocket|MOB_INSTANCE): DMG_RESULT {
		let mainStat = this.talentsRouter.getPrimaryTalentInfo(socket).stat;
        let baseDmg = socket.character.stats[mainStat] + socket.bonusStats[mainStat]; 
        let load = socket.lastAttackLoad || 0;
		let bonusDmg = socket.getLoadModifier() * load * baseDmg / 100;
		let dmgModifier = socket.getDmgModifier(socket, target);
		let maxDmg = (baseDmg + bonusDmg) * dmgModifier.dmg;
		let minDmg = maxDmg / 2;
		let dmg = getDamageRange(minDmg, maxDmg);
		return {dmg, crit: dmgModifier.crit};
	}
};