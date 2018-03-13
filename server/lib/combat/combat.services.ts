
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
        const talent = socket.character.talents._doc[socket.character.stats.primaryAbility];
        let baseDmg = (talent || {lvl: 1}).lvl * 2 + 1;
        baseDmg += socket.getDmgBonus();
        let load = socket.lastAttackLoad || 0;
		let loadDmg = socket.getLoadModifier() * load * baseDmg / 100;
		let dmgModifier = socket.getDmgModifier(socket, target);
		let maxDmg = (baseDmg + loadDmg) * dmgModifier.dmg;
		let minDmg = maxDmg / 2;
		let dmg = getDamageRange(minDmg, maxDmg);
		return {dmg, crit: dmgModifier.crit};
	}
};