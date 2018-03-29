import { Component, OnInit, ElementRef } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { NgForm } from '@angular/forms';

import { AuthService } from './services/auth.service';
import { ContractsService } from './services/contracts.service';

var BigNumber = require('bignumber.js');

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	public balance: number;
	
	constructor(cs: ContractsService) {
    
		// // wandx token
		// let baseToken;
		// let quoteToken;
		// let baseTokenDecimal = 18;
		// let quoteTokenDecimal = 18;
		// let strikePrice = 1
		// let blockTimestamp = Date.now() + 86400000;

		// let assetsOffered = 50;
		// let premium = 10;
		// let expiryBlock = 5000;

		// let multiplyFactor = new BigNumber(10).pow(quoteTokenDecimal).toNumber();
		// let assetValue = assetsOffered * strikePrice * multiplyFactor;

		// let assetToTrade = 1;
		// let assetToTradeApprove = 1 * premium * multiplyFactor;
		
    	// // init web3
		// cs.initWeb3().then(function(result) {

		// 	baseToken = cs.getWandxTokenAddress();
		// 	quoteToken = cs.getWandxTokenAddress();

		// 	cs.getBlockNumber().then(function(blockNumber){

		// 		expiryBlock = blockNumber + 50;
				
		// 		// get current allowance of contract
		// 		cs.getWandxAllowance().then(function(currentWandxAllowance){

		// 			// if we dont have enough allowance then throw error
		// 			// in dev, get more from faucet in palce of error
		// 			cs.getContractFee().then(function(contractFee){

		// 				if(currentWandxAllowance < contractFee) {
		// 					console.log("currentWandxAllowance is low", currentWandxAllowance, contractFee);
							
		// 					let tokenCount = '10000000000000000000000';
		// 					cs.faucetGetTokens(tokenCount).then(function(result){});
		// 					cs.approveWandx(tokenCount).then(function(result){});
		// 					return;
		// 				}

		// 				cs.createNewOption(
		// 					baseToken,
		// 					quoteToken,
		// 					baseTokenDecimal,
		// 					quoteTokenDecimal,
		// 					strikePrice,
		// 					blockTimestamp
		// 				).then(function(optionAddress) {
		// 					cs.approveToken(quoteToken, optionAddress, assetValue).then(function(result){
		// 						if(!result){
		// 							console.log("Unable to approve assets");
		// 							return;
		// 						}

		// 						cs.issueOption(optionAddress, assetsOffered, premium, expiryBlock).then(function(result) {
		// 							let tokenProxy = result;
		// 							console.log("issueOption", result);

		// 							cs.approveToken(quoteToken, optionAddress, assetToTradeApprove).then(function(result){
		// 								if(!result){
		// 									console.log("Unable to approve assets");
		// 									return;
		// 								}

		// 								cs.tradeOption(optionAddress, assetToTrade).then(function(response){
		// 									console.log("tradeOption", response);

		// 									cs.approveToken(optionAddress, optionAddress, assetToTrade).then(function(result){
		// 										if(!result){
		// 											console.log("Unable to approve assets");
		// 											return;
		// 										}

		// 										cs.approveToken(baseToken, tokenProxy, assetToTradeApprove).then(function(result){
		// 											if(!result){
		// 												console.log("Unable to approve assets");
		// 												return;
		// 											}
	
		// 											cs.exerciseOption(optionAddress, assetToTrade).then(function(result){
		// 												console.log("exerciseOption", result);
		// 											});
	
		// 										});



		// 									});
										
		// 								}, function(err){
		// 									console.log(err);
		// 								})
		// 							});

									
		// 						}, function(err) {
		// 							console.log(err);
		// 						}); 
		// 					});
		// 				}, function(err) {
		// 					console.log(err);
		// 				});
		// 			});
		// 		});
		// 	});
		// }, function(err) {
		// 	console.log(err);
		// });
  	}

    ngOnInit(){ 
      
    }

    suggestUserName() {
		const suggestedName = 'Superuser';
    } 
}
