/**********************************************************

		File name   : index.js
		Description : Contains all of the urls

DATE        PROGRAMMER      COMMENT
19/03/18    rbnishant       INITIAL VERSION

**********************************************************/

var apiStrings = require('../config/apiStrings');
var express = require('express');
var router = express.Router();
var db = require('../bin/db');

import { logger } from '../config/logger';

/**
Route: /
Method: GET
Purpose: This is the home page of the website. Before login. If user is already authenticated
		 then user is redirected to the exchange page.
**/
router.get('/insertAddress', function(req, res, next) {	
	
	var users = db.get().collection('users');
	var address = req.get("address");
	users.findOne({ address: address}, function (err, user) {
		if (err) {
			return res.status(200).json({
				status: 'error',
				error: 'Unable to find address in db'
			});
		}
		
		if (user !== null) {
			return res.status(200).json({
				status: 'error',
				error: 'Address already exist'
			});
		}
		
			
		var user = {
			address: address
		};
		
		users.insert(user, function (err) {
			if (err) {
				return res.status(200).json({
					status: 'error',
					error: 'Unable to insert address'
				});
			}
			
			return res.status(200).json({
				status: 'ok',
				error: ''
			});
		});
	});
});

router.get('/isAddressPresent', function(req, res, next) {	
	
	var users = db.get().collection('users');
	var address = req.get("address");
	users.findOne({ address: address}, function (err, user) {
		if (err) {
			return res.status(200).json({
				status: 'error',
				error: 'Unable to find address in db'
			});
		}
		
		if (user !== null) {
			return res.status(200).json({
				status: 'error',
				error: 'Address already exist'
			});
		}

		return res.status(200).json({
			status: 'error',
			error: 'Address not exist'
		});
	});
});

router.get('/getUserDetails', function(req, res, next) {	
	
	var users = db.get().collection('users');
	var address = req.get("address");
	users.findOne({ address: address}, function (err, user) {
		if (err || user == null) {
			return res.status(200).json({
				status: 'error',
				error: 'Unable to find address in db',
				user: {}
			});
		}
		
		return res.status(200).json({
			status: 'ok',
			error: '',
			user: user
		});
	});
});

module.exports = router;
