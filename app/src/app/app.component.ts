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
    
		// let networkVersion = cs.getNetworkVersion();

		// let baseToken = cs.getBaseTokenAddress();
		// let quoteToken = cs.getQuoteTokenAddress();
		// let baseTokenDecimal = 18;
		// let quoteTokenDecimal = 18;
		// let strikePrice = 1
		// let blockTimestamp = Date.now() + 86400000;

		// let assetsOffered = 50;
		// let premium = 10;
		// let expiry = 5000;

		// let multiplyFactor = new BigNumber(10).pow(quoteTokenDecimal).toNumber();
		// let assetValue = assetsOffered * strikePrice * multiplyFactor;
		
    	// init web3
		// cs.initWeb3().then(function(result) {

		// 	// get current allowance of contract
		// 	cs.getCurrentAllowance().then(function(currentAllowance){

		// 		// if we dont have enough allowance then throw error
		// 		// in dev, get more from faucet in palce of error
		// 		cs.getContractFee().then(function(contractFee){

		// 			if(currentAllowance < contractFee) {
		// 				console.log(currentAllowance, contractFee);
		// 				if(networkVersion == 1){
		// 					console.log("Not enough allowance")
		// 					return;
		// 				}
	
		// 				let tokenCount = '10000000000000000000000';
		// 				cs.faucetGetTokens(tokenCount).then(function(result){
		// 					if(result){
		// 						cs.faucetApprove(tokenCount).then(function(result){
	
		// 						})
		// 					}
		// 				})
		// 				return;
		// 			}

		// 			// cs.createNewOption(
		// 			// 	baseToken,
		// 			// 	quoteToken,
		// 			// 	baseTokenDecimal,
		// 			// 	quoteTokenDecimal,
		// 			// 	strikePrice,
		// 			// 	blockTimestamp
		// 			// ).then(function(optionAddress) {
		// 			// 	cs.approveAssets(quoteToken, optionAddress, assetValue).then(function(result){
		// 			// 		if(!result){
		// 			// 			console.log("Unable to approce assets");
		// 			// 			return;
		// 			// 		}
		// 			// 		cs.issueOption(optionAddress, assetsOffered, premium, expiry).then(function(result) {
		// 			// 			console.log("issue" + result);
		// 			// 		}, function(err) {
		// 			// 			console.log(err);
		// 			// 		}); 
		// 			// 	});
		// 			// }, function(err) {
		// 			// 	console.log(err);
		// 			// });

		// 		});
		// 	});

		// }, function(err) {
		// 	console.log(err);
		// });
  	}

    ngOnInit(){
      
    }

    /*isMap(path){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.slice( 1 );
      if(path == titlee){
        return false;
      }
      else {
        return true;
      }
    }*/

    suggestUserName() {
		const suggestedName = 'Superuser';
    } 
}
