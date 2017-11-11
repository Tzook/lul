import statsConfig from '../stats/stats.config';

export default {
	"ROUTES": {
		"GENERATE": "/talents/generate"
	},
	"LOGS": {
		"GENERATE_TALENTS": {
			"MSG": "Generated talents successfully.",
			"CODE": "TALENTS_1",
			"STATUS": "OK"
		}
	},
	"SERVER_INNER": {
		GAIN_ABILITY: Object.assign({}, statsConfig.SERVER_INNER.GAIN_ABILITY),
	},
	"SERVER_GETS": {
		
	},
	"CLIENT_GETS": {
		
	},
}