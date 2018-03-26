/**********************************************************

		File name	: apiStrings.js
		Description	: Contains all the static strigs for
					  backend api

DATE        PROGRAMMER      COMMENT
19/03/18    rbnishant       INITIAL VERSION

**********************************************************/

import { logger } from '../config/logger';

var NODE_ENV =  process.env.NODE_ENV;

if(NODE_ENV == "production"){
	
}

module.exports = {
	sample: "/sample",
}