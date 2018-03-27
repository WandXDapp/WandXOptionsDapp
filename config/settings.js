/**********************************************************

		File name   : settings.js
		Description : Full project static settings strings

DATE        PROGRAMMER      COMMENT
19/03/18    rbnishant       INITIAL VERSION

**********************************************************/

module.exports = {
    env: {
		"development": {
			"sessionName": "wandx_dev",
			"secret": "fda23ac925a39b393d0799d2ada759e03add920f2a7d45da82cbea9177c1c395",
			"env": "development",
			"secure": false,
			"port": 1414,
			"bodyLimit": "200kb",
			"corsHeaders": [
				"Link"
			],
			"accessLogFile": "app_access.log",
			"errorLogFile": "app_error.log",
			"logDirectory": "./logs_dev",
			"mongodb": "mongodb://localhost/node-2fa"
		},
		"production": {
			"sessionName": "wandx_prod",
			"secret": "234afe6a0ac174cca796cbd729ff556c337f643564d819287250435c26c43ee3",
			"env": "production",
			"secure": false,
			"port": 1414,
			"bodyLimit": "200kb",
			"corsHeaders": [
				"Link"
			],
			"accessLogFile": "app_access.log",
			"errorLogFile": "app_error.log",
			"BUCKET_NAME": "kyc-papers",
			"logDirectory": "./logs_prod",
			"mongodb": "mongodb://localhost/node-2fa"
		}
	}
}