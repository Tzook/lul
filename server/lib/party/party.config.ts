import combatConfig from '../combat/combat.config';

export default {
    SERVER_INNER: {
        DMG_DEALT: Object.assign({}, combatConfig.SERVER_INNER.DMG_DEALT),		
    },
    "SERVER_GETS": {
        "CREATE_PARTY": {"name": "create_party", "log": true},
        "INVITE_TO_PARTY": {"name": "invite_to_party", "log": true},
        "JOIN_PARTY": {"name": "join_party", "log": true},
        "LEAVE_PARTY": {"name": "leave_party", "log": true},
        "LEAD_PARTY": {"name": "change_party_leader", "log": true},
        "KICK_FROM_PARTY": {"name": "kick_from_party", "log": true}
    },
    "CLIENT_GETS": {
        "CREATE_PARTY": {"name": "create_party"},
        "INVITE_TO_PARTY": {"name": "party_invitation"},
        "JOIN_PARTY": {"name": "actor_join_party"},
        "LEAVE_PARTY": {"name": "actor_leave_party"},
        "LEAD_PARTY": {"name": "actor_lead_party"},
        "KICK_FROM_PARTY": {"name": "actor_kicked_from_party"},
        "PARTY_MEMBERS": {"name": "party_members"}
    },
    "MAX_PARTY_MEMBERS": 5,
    "INVITE_EXPIRE_TIME": 30000
}