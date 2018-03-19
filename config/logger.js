/**********************************************************

		File name   : logger.js
		Description : This file is used for internal logs
					  all over the application

DATE        PROGRAMMER      COMMENT
19/03/18    rbnishant       INITIAL VERSION

**********************************************************/

import winston from 'winston';
import fs from 'fs';
var logDirectory = './internal_logs';

winston.setLevels(winston.config.npm.levels);
winston.addColors(winston.config.npm.colors);

if (!fs.existsSync(logDirectory)) {
	// Create the directory if it does not exist
	fs.mkdirSync(logDirectory);
}

let logger = new (winston.Logger)({
	transports: [
		new winston.transports.Console({
			name: 'debug-file',
			level: 'debug',
			timestamp: function () { return Date() },
			filename: logDirectory + '/debug.log',
			handleExceptions: true,
			json: true,
		}),
		new winston.transports.File({
			name: 'error-file',
			level: 'error',
			timestamp: function () { return Date() },
			filename: logDirectory + '/error.log',
			handleExceptions: true,
			json: true
		}),
		new winston.transports.File({
			name: 'info-file',
			level: 'info',
			timestamp: function () { return Date() },
			filename: logDirectory + '/info.log',
			handleExceptions: true,
			json: true
		})
	],
	exitOnError: false
});

export {logger};