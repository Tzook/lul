export default {
	"ROUTES": {
		"CHARACTER_CREATE": "/character/create",
		"CHARACTER_DELETE": "/character/delete"
	},
	"LOGS": {
		"CHARACTER_CREATED_SUCCESSFULLY": {
			"MSG": "Character has been created successfully.",
			"CODE": "CHARACTER_1",
			"STATUS": "OK"
		},
		"CHARACTER_DELETED_SUCCESSFULLY": {
			"MSG": "Character has been deleted successfully.",
			"CODE": "CHARACTER_2",
			"STATUS": "OK"
		},
		"CHARACTER_NAME_CAUGHT": {
			"MSG": "The name '{name}' is already being used.",
			"CODE": "CHARACTER_3",
			"STATUS": "BAD_VALUES"
		},
		"CHARACTER_DOES_NOT_EXIST": {
			"MSG": "The character id does not exist in the user.",
			"CODE": "CHARACTER_4",
			"STATUS": "BAD_VALUES"
		},
		"MAX_CHARACTERS": {
			"MSG": "The user already has the maximum amount of characters available.",
			"CODE": "CHARACTER_5",
			"STATUS": "UNAUTHORIZED"
		}
	},
	"MAX_CHARACTERS": 8
}