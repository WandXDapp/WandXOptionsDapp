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

router.put('/createNewOption', function(req, res, next) {	

	var userOptions = db.get().collection('useroptions');
	
	var address = req.body.address;
	var optionAddress = req.body.optionAddress;
	var baseToken = req.body.baseToken;
	var quoteToken = req.body.quoteToken;
	var strikePrice = req.body.strikePrice;
	var blockTimestamp = req.body.blockTimestamp;
	var expiry = req.body.expiry;
	var assetsOffered = req.body.assetsOffered;

	var userOptionsObj = {
		address: address,
		optionAddress: optionAddress,
		baseToken: baseToken,
		quoteToken: quoteToken,
		strikePrice: strikePrice,
		blockTimestamp: blockTimestamp,
		expiry: expiry,
		assetsOffered: assetsOffered
	};
	
	userOptions.findOne({ optionAddress: optionAddress }, function (err, option) {
		if (err || option != null) {
			return res.status(200).json({
				status: 'Error in connecting to db or option already exist',
				error: err,
				result: false
			});
		}
		
		userOptions.insert(userOptionsObj, function (err) {
			if (err) {
				return res.status(200).json({
					status: 'error',
					error: 'Unable to insert user option',
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

router.get('/getUserOptions', function(req, res, next) {	
	
	var useroptions = db.get().collection('useroptions');
	var address = req.get("address");
	var currentBlockNumber = req.get("currentBlockNumber");
	var tokenName = req.get("tokenName");

	useroptions.find({ address: address, baseToken: tokenName }).toArray(function(err, optionList) {
		if (err || optionList == null) {
			return res.status(200).json({
				status: 'error',
				error: 'Unable to find address in db',
				optionList: []
			});
		}
		optionList.forEach(element => {
			if(parseInt(element.expiry) < parseInt(currentBlockNumber)){
				element.isActive = false;
			}
			else {
				element.isActive = true;
			}
		});
		return res.status(200).json({
			status: 'ok',
			error: '',
			optionList: optionList
		});
	});
});

router.get('/getActiveOptions', function(req, res, next) {	
	
	var useroptions = db.get().collection('useroptions');
	var currentBlockNumber = req.get("currentBlockNumber");
	var tokenName = req.get("tokenName");

	useroptions.find({ baseToken: tokenName }).toArray(function(err, optionList) {
		if (err || optionList == null) {
			return res.status(200).json({
				status: 'error',
				error: 'Unable to find address in db',
				optionList: []
			});
		}

		let count = optionList.length
		while (count--) {
			if (parseInt(optionList[count].expiry) < parseInt(currentBlockNumber)) {
				optionList.splice(count, 1);
			}
		}

		return res.status(200).json({
			status: 'ok',
			error: '',
			optionList: optionList
		});
	});
});

module.exports = router;
