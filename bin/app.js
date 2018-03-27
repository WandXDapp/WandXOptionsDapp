/**********************************************************

		File name   : app.js
        Description : Contains all the modules and variables
                      The node application is setup as pure
                      api server. Backend will not serve
                      HTML or frontend content.

DATE	    PROGRAMMER		COMMENT
19/03/18    rbnishant       Initial Version

**********************************************************/

/******************** Node imports ***********************/
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import favicon from 'serve-favicon'
import flash from 'connect-flash'
import fs from 'fs';
import methodOverride from 'method-override';
import morgan from 'morgan';
import path from 'path';
import session from 'express-session';

/******************* Local imports ***********************/
import { logger } from '../config/logger';
import routes from '../routes/index';
import settings from '../config/settings';

/************************* Setup Application Server *********************************/
var app = express();
var env = app.get('env') || 'development';
var envConfig;

if(env === 'production') {
	logger.info('=========	Running in PRODUCTION mode =========')
	envConfig = settings.env.production;
} else {
	logger.info('=========	Running in DEVELOPMENT mode =========');
	envConfig = settings.env.development;
}

// setup port
app.set('port', envConfig.port);

// create log folders if it does not exist
if (!fs.existsSync(envConfig.logDirectory)) {
	fs.mkdirSync(envConfig.logDirectory);
}

// setup morgan for application level logging
let accessLogStream = fs.createWriteStream(envConfig.logDirectory + "/" + envConfig.accessLogFile, {
	flags: 'a'
});
let errorLogStream = fs.createWriteStream(envConfig.logDirectory + "/" + envConfig.errorLogFile, {
	flags: 'a'
});
morgan.format(
	'custom-format',
	':date[iso] :response-time ms :remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"');
let theAccessLog = morgan('custom-format', {
	skip: function (req, res) {
		return res.statusCode >= 400
	},
	stream: accessLogStream
});
let theErrorLog = morgan('custom-format', {
	skip: function (req, res) {
		return res.statusCode < 400
	},
	stream: errorLogStream
});
app.use(theAccessLog);
app.use(theErrorLog);

// setup session
app.use(session({
	secret: envConfig.secret,
	name: envConfig.sessionName,
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 3600000,
		secure: envConfig.secure,			// when using HTTPS, this is set to true
		httpOnly: true
	}
}));

// setup response for OPTIONS hit
app.use((req, res, next) => {
	if (req.method === 'OPTIONS') {
		return res.status(200).send();
	} else {
		next();
	}
});

// setup parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// setup extras
app.disable('x-powered-by');
app.enable('trust proxy')
app.use(methodOverride('X-HTTP-Method')) // Microsoft
app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
app.use(methodOverride('X-Method-Override')) // IBM
app.use(flash());

// setup routes
app.use('/', routes);

// setup path not found error handler
app.use((req, res, next) => {
	if (req.resourcePath) {
		return next()
	} else {
		res.status(404);
		return res.json({
			status: false,
			"message": `The path ${req.path} is not found`
		});
	}
});

// setup internal server error handler
app.use((err, req, res, next) => {
	if (err) {
		logger.error("Error checker server", err);
		let _err;
		if (env === 'development') {
			_err = "ERROR: Validation failed. ";
		} else {
			_err = 'Internal Error'
		}
		res.status(400);
		return res.json({
			status: false,
			"message": _err
		});
	} else {
		return next();
	}
});

module.exports = app;
