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
router.put('/insertAddress', function(req, res, next) {	
	
	var users = db.get().collection('users');
	var address = req.body.address;
	users.findOne({ address: address}, function (err, user) {
		if (err) {
			return res.status(200).json({
				status: 'error',
				error: 'Unable to find address in db',
				result: false
			});
		}
		
		if (user !== null) {
			return res.status(200).json({
				status: 'error',
				error: 'Address already exist',
				result: false
			});
		}
		
		var user = {
			address: address
		};
		
		users.insert(user, function (err) {
			if (err) {
				return res.status(200).json({
					status: 'error',
					error: 'Unable to insert address',
					result: false
				});
			}
			
			return res.status(200).json({
				status: 'ok',
				error: '',
				result: true
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
				error: 'Unable to find address in db',
				result: false
			});
		}
		
		if (user == null) {
			return res.status(200).json({
				status: 'error',
				error: 'Address not exist',
				result: false
			});
		}

		return res.status(200).json({
			status: 'ok',
			error: '',
			result: true
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

router.put('/updateUserProfile', function(req, res, next) {	

	var users = db.get().collection('users');
	
	console.log(req.body);
	
	var address = req.body.address;
	var profile = {
		company: req.body.company,
		username: req.body.username,
		email: req.body.email,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		residential_address: req.body.residential_address,
		city: req.body.city,
		country: req.body.country,
		pincode: req.body.pincode,
		aboutMe: req.body.aboutMe
	}
	
	users.findOne({ address: address}, function (err, user) {
		if (err || user == null) {
			return res.status(200).json({
				status: 'Unable to find address in db',
				error: err,
				result: false
			});
		}
		
		var myquery = { address: address };
		var newvalues = { $set: profile };
		users.update(myquery, newvalues, function(err, res1) {
			if (err){
				return res.status(200).json({
					status: 'Unable to update user',
					error: err,
					result: false
				});
			}

			return res.status(200).json({
				status: 'ok',
				error: '',
				result: true
			});
		});
	});
});

module.exports = router;
