import { ApicallsService } from '../services/apicalls.service';
import { ContractsService } from '../services/contracts.service';
import { Component, OnInit } from '@angular/core';
import { Router, Params } from '@angular/router';

var BigNumber = require('bignumber.js');

@Component({
	selector: 'app-optiondetails',
	templateUrl: './optiondetails.component.html',
	styleUrls: ['./optiondetails.component.css'],
	providers: [ ApicallsService, ContractsService ]
})

export class OptionDetailsComponent implements OnInit {
	
	optionAddress: any;
	optionPremium: number;
	assetToTrade: number;
	assetToExcercise: number;
	displaySuccess: any;
	displayFail: any;
	displayGif: any;
	
	constructor( private apiCalls:ApicallsService, private contractsService: ContractsService ) { 
		this.displaySuccess = 'none';
		this.displayFail = 'none';
		this.displayGif = 'none';
	 }
	
	ngOnInit() {
		let list = window.location.href.split('/');
		this.optionAddress = list[list.length - 1];
		this.optionPremium = 0;
		this.assetToTrade = 0;
		this.assetToExcercise = 0;

		this.contractsService.initWeb3().then((result) => {
			this.contractsService.initWithOptionAddress(this.optionAddress).then((result) => { 
				this.optionPremium = this.contractsService.getOptionPremium();
			});
		});
	}

	tradeOption() {
		this.displayGif = 'block';
		this.contractsService.tradeOption(this.assetToTrade).then(function(response){
			console.log('tradeOption', response);
			this.displayGif = 'none';
			if(response === undefined || response === null) {
				this.displayFail = 'block';
			}else{
				// error/Success
				this.displaySuccess = 'block';
			}
		});
	}

	excerciseOption() {
		this.displayGif = 'block';
		this.contractsService.exerciseOption(this.assetToExcercise).then(function(result){
			console.log('exerciseOption', result);
			if (result === undefined || result === null) {
				this.displayFail = 'block';
			}else{
				// error/Success
				this.displaySuccess = 'block';
			}
		});
	}

	cancel_btn() {
		this.displaySuccess = 'none';
		this.displayFail = 'none';
	}

}
