/**********************************************************

		File name   : index.js
		Description : Contains all of the urls

DATE        PROGRAMMER      COMMENT
19/03/18    rbnishant       INITIAL VERSION

**********************************************************/

var apiStrings = require('../config/apiStrings');
var express = require('express');
var router = express.Router();

import { logger } from '../config/logger';

/**
Route: /
Method: GET
Purpose: This is the home page of the website. Before login. If user is already authenticated
		 then user is redirected to the exchange page.
**/
router.get('/', function(req, res, next) {	
	return res.render('index', { 

	});
});

module.exports = router;
