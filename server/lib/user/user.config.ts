export default {
	"ROUTES": {
		"USER_DELETE": "/user/delete",
		"USER_LOGIN": "/user/login",
		"USER_LOGOUT": "/user/logout",
		"USER_REGISTER": "/user/register",
		"USER_SESSION": "/user/session"
	},
	"LOGS": {
		"USER_LOGGED_OUT_OK": {
			"MSG": "Logged out successfully.",
			"CODE": "USER_2",
			"STATUS": "OK"
		},
		"USER_LOGGED_IN_OK": {
			"MSG": "Logged in successfully.",
			"CODE": "USER_3",
			"STATUS": "OK"
		},
		"USER_SESSION_OK": {
			"MSG": "Logged in through session successfully.",
			"CODE": "USER_4",
			"STATUS": "OK"
		},
		"USER_REGISTERED_OK": {
			"MSG": "Registered and then logged in successfully.",
			"CODE": "USER_5",
			"STATUS": "OK"
		},
		"USER_USERNAME_CAUGHT": {
			"MSG": "Username '{username}' is already being used.",
			"CODE": "USER_6",
			"STATUS": "BAD_VALUES"
		},
		"USER_NO_SUCH_USERNAME": {
			"MSG": "No such username '{username}'.",
			"CODE": "USER_7",
			"STATUS": "BAD_VALUES"
		},
		"USER_WRONG_PASSWORD": {
			"MSG": "Invalid password.",
			"CODE": "USER_8",
			"STATUS": "BAD_VALUES"
		},
		"USER_DELETED": {
			"MSG": "User successfully deleted.",
			"CODE": "USER_9",
			"STATUS": "OK"
		},
		"USER_BANNED": {
			"MSG": "{message}",
			"CODE": "USER_10",
			"STATUS": "UNAUTHORIZED"
		}
    },
    "UNICORN": "unicorn"
}