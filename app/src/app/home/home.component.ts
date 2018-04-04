import { ApicallsService } from '../services/apicalls.service';
import { ContractsService } from '../services/contracts.service';
import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { LegendItem, ChartType } from '../lbd/lbd-chart/lbd-chart.component';
import { NgForm } from '@angular/forms';

var BigNumber = require('bignumber.js');

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
	providers: [ ApicallsService, ContractsService ]
})

export class HomeComponent implements OnInit {
	
	display: any;

	private wandxTokenAddress: string;
	private tokenList: any;
	
	public contractFee: any;
	public userBalance: any;
	public currentAllowance: any;
	
	base_token: any = '';
	base_tokenJSON: any;
	baseTokenAddress: any = '';
	baseTokenDecimal: any;
	
	quote_token: any = '';
	quote_tokenJSON: any = '';
	qouteTokenAddress: any = '';
	quoteTokenDecimal: any;

	blockTimestamp: any;
	strikePrice: any;
	
	assets_offered: any = '';
	premium: any = '';
	expiryBlock: any = '';

	optionAddress: string = null;
	
	minBlockNumber: any;
	
	newdate: any;
	date: any;
	month: any;
	year: number;
	
	validate: any;
	
	displayNotEnoughBalance: any;
	displayAllowanceApproval: any;
	displayGif: any;

	displayStepOne: any;
	displayStepTwo: any;
	displayStepThree: any;
	
	errorBox: any;

	faucetToken1: any;
	
	constructor( private apiCalls:ApicallsService, private contractsService: ContractsService ) {
		
		// this.faucetToken1 = contractsService.faucetGetTokens('10000000000000000000000');

		// document.getElementById("jQueryScript").remove();
		// var jQueryScript = document.createElement("script");
		// jQueryScript.setAttribute("id", "jQueryScript");
		// jQueryScript.setAttribute("src", "//code.jquery.com/jquery-1.11.1.min.js");
		// document.body.appendChild(jQueryScript);

		// document.getElementById("testScript").remove();
		// var testScript = document.createElement("script");
		// testScript.setAttribute('id', "testScript");
		// testScript.setAttribute('src', 'https://unpkg.com/avalon2@2.2.8/dist/avalon.js');
		// document.body.appendChild(testScript);


		this.display = 'none';
		this.displayNotEnoughBalance = 'none';
		this.displayAllowanceApproval = 'none';
		this.displayGif = 'none';

		this.displayStepOne = 'block';
		this.displayStepTwo = 'none';
		this.displayStepThree = 'none';

		this.errorBox = 'none';


		var day = new Date();
		var nextDay = new Date();
		nextDay.setDate(day.getDate() + 1);
		
		this.date = nextDay.getDate();
		if (this.date.length !== 2) {
			this.date = '0' + this.date;
		}
		this.month = nextDay.getMonth() + 1;
		if (this.month.length !== 2) {
			this.month = '0' + this.month;
		}
		this.year = nextDay.getFullYear();

		this.validate = this.year + '-' + this.month + '-' + this.date;
		
		this.premium = 10;

		this.wandxTokenAddress = this.contractsService.getWandxTokenAddress();
		this.tokenList = this.contractsService.getTokenList();
		
		this.base_token = this.tokenList[0].name;
		this.quote_token = this.tokenList[0].name;
	}

	take_special_char(event){
		let l = event.charCode;  	// k = event.keyCode;  (Both can be used)
		return((l > 64 && l < 91) || (l > 96 && l < 123) || l == 8 || l == 32 || (l >= 48 && l <= 57) || l==46);
	}

	ngOnInit() {
		this.contractsService.initWeb3().then((result) => {
			this.contractsService.getBalance(this.wandxTokenAddress).then((balance: number) => {
				this.userBalance = balance;
			});
	
			this.contractsService.getWandxAllowance().then((allowance: number) => {
				this.currentAllowance = allowance;
			});
	
			this.contractsService.getContractFee().then((contractFee: number) => {
				this.contractFee = contractFee;
			});
	
			this.contractsService.getBlockNumber().then((blockNumber: number) => {
				this.minBlockNumber = blockNumber + 50;
			});
		});
	}

	onSubmit1(form: HTMLFormElement) {
		this.displayGif = 'block';

		this.base_token = form.value.base_token;
		this.base_tokenJSON = this.contractsService.getTokenObj(this.base_token);
		this.baseTokenDecimal = this.base_tokenJSON.decimals;
		this.baseTokenAddress = this.base_tokenJSON.address;

		this.quote_token = form.value.quote_token;
		this.quote_tokenJSON = this.contractsService.getTokenObj(this.quote_token);
		this.quoteTokenDecimal = this.quote_tokenJSON.decimals;
		this.qouteTokenAddress = this.quote_tokenJSON.address;
		
		this.blockTimestamp = Date.parse(form.value.blockTimestamp);
		this.strikePrice = form.value.strikePrice;

		this.onStepOne();
	}

	onSubmit2(form2: HTMLFormElement) {
		
		this.displayGif = 'block';
		
		this.assets_offered = form2.value.assets_offered;
		this.premium = form2.value.premium;
		this.expiryBlock = form2.value.expiryBlock;

		this.onStepTwo();
	}

	onSubmit3(form3: HTMLFormElement) {
		console.log(form3);
	}

	onStepOne() {
		// check if user has allowance to create option
		if (this.currentAllowance >= this.contractFee) {
			// create new option
			this.createNewOption();
		}else {
			// check user has enough balance to create option
			let allowanceNeeded = this.contractFee - this.currentAllowance;
			console.log('getting allowance', allowanceNeeded);
			if (this.userBalance < allowanceNeeded) {
				console.log('Not enough balance');
				let tokenCount = '10000000000000000000000';
				this.contractsService.getTokens(this.wandxTokenAddress, tokenCount).then(function(result){});
				this.displayGif = 'none';
				this.displayNotEnoughBalance = 'block';
				return;
			}

			// get allowance to create option
			this.contractsService.approveWandx(allowanceNeeded).then((result) => {
				if (!result) {
					console.log('Unable to get allowance approval');
					this.displayGif = "none";
					this.displayAllowanceApproval = 'block';
					return;
				}

				// create new option
				this.createNewOption();
			});
		}
	}

	onStepTwo() {
		this.contractsService.issueOption(
			this.assets_offered,
			this.premium,
			this.expiryBlock
		).then((result) => {
			this.displayGif = 'none';
			console.log('issueOption', result);

			this.displayStepThree = 'block';
			this.displayStepTwo = 'none';

			if (result === undefined || result === null) {
				this.errorBox = 'block';
			}
			else {
				this.apiCalls.createNewOption(
					this.contractsService.getUserAddress(),
					this.optionAddress,
					this.base_token,
					this.quote_token,
					this.strikePrice,
					this.blockTimestamp,
					this.expiryBlock,
					this.assets_offered
				).then((createResult) => {
					console.log("createNewOption", createResult);
				});
			}

		});
	}

	createNewOption() {
		this.contractsService.createNewOption(
			this.baseTokenAddress,
			this.qouteTokenAddress,
			this.baseTokenDecimal,
			this.quoteTokenDecimal,
			this.strikePrice,
			this.blockTimestamp
		).then((optionAddress) => {
			this.optionAddress = optionAddress;
			console.log('createNewOption', optionAddress);
			this.displayGif = "none";
			console.log("optionAddress", optionAddress);
			if (optionAddress === undefined || optionAddress === null) {

				this.displayGif = 'block';
			}else{
				this.displayGif = 'none';
				this.displayStepTwo = 'block';
				this.displayStepOne = 'none';

				this.errorBox = 'block';

			}
		});
	}

	minDate() {
		this.newdate = Date();
	}

	optionCreate() { }

	cancel_btn() {
		this.display = 'none';
		this.displayNotEnoughBalance = 'none';
		this.displayAllowanceApproval = 'none';
		this.errorBox = 'none';
	}

	backButton() {
		this.displayStepTwo = 'none';
		this.displayStepOne = 'block';
	}

}