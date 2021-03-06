export default {
	"STATUS_CODES": {
		"OK": 200,
		"BAD_REQUEST": 400,
		"UNAUTHORIZED": 401,
		"BAD_VALUES": 422,
		"INTERNAL_ERROR": 500 
	},
	"LOGS": {
		"MASTER_INTERNAL_ERROR": {
			"MSG": "An unexpected error has occured in function '{fn}', in file '{file}': {e}.",
			"CODE": "MASTER_1",
			"STATUS": "INTERNAL_ERROR"
		},
		"MASTER_INVALID_PARAM": {
			"MSG": "Parameter '{param}' is required.",
			"CODE": "MASTER_2",
			"STATUS": "BAD_REQUEST"
		},
		"MASTER_INVALID_PARAM_TYPE": {
			"MSG": "Parameter '{param}' is of a bad type. Please use a valid type.",
			"CODE": "MASTER_3",
			"STATUS": "BAD_REQUEST"
		},
		"MASTER_NOT_LOGGED_IN": {
			"MSG": "A user must be logged in for this request.",
			"CODE": "MASTER_4",
			"STATUS": "UNAUTHORIZED"
		},
		"MASTER_OUT_OF_RANGE": {
            "MSG": "The parameter '{param}' is out of range.",
			"CODE": "MASTER_5",
			"STATUS": "BAD_VALUES"
		},
        "MASTER_NOT_AUTHORIZED": {
            "MSG": "A boss user must be logged in for this request.",
            "CODE": "MASTER_6",
            "STATUS": "UNAUTHORIZED"
        },
	}
}