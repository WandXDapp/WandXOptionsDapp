import { ContractsService } from '../services/contracts.service';
import { Web3Service } from '../services/web3.service';
import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { LegendItem, ChartType } from '../lbd/lbd-chart/lbd-chart.component';
import { NgForm } from '@angular/forms';

var BigNumber = require('bignumber.js');

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
	providers: [ContractsService]
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
	
	minBlockNumber: any;
	assetsOffered: any;
	assetValue: any;

	newdate: any;
	date: number;
	month: any;
	year: number;
	
	validate: any;
	token: any;
	eth: any;
	
	multiplyFactor: any;
	
	flag: number;
	
	constructor( public contractsService: ContractsService,public web3Service:Web3Service) {
		
		this.display = 'none';

		var day = new Date();
		var nextDay = new Date();
		nextDay.setDate(day.getDate() + 1);
		
		this.date = nextDay.getDate();
		this.month = nextDay.getMonth() + 1;
		this.year = nextDay.getFullYear();

		this.validate = this.year + '-' + this.month + '-' + this.date;
		
		this.assetsOffered = 50;
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

        let web3=this.web3Service.getWeb3();
        console.log("Web3",web3.eth.accounts);
	}

	onSubmit1(form: HTMLFormElement) {
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
			console.log("have allowance")
			// create new option
			this.createNewOption();
		}else {
			// check user has enough balance to create option
			let allowanceNeeded = this.contractFee - this.currentAllowance;
			console.log("getting allowance", allowanceNeeded);
			if(this.userBalance < allowanceNeeded) {
				console.log("Not enough balance")
				return;
			}

			// get allowance to create option
			this.contractsService.approveWandx(allowanceNeeded).then((result) => {
				if(!result){
					console.log("Unable to get allowance approval");
					return;
				}

				// create new option
				this.createNewOption();
			});
		}
	}

	onStepTwo() {
		this.contractsService.issueOption(
			this.assetsOffered, 
			this.premium, 
			this.expiryBlock
		).then(function(result) {
			console.log("issueOption", result);
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
			console.log("createNewOption", optionAddress);
		});
	}

	minDate() {
		this.newdate = Date();
	}

	optionCreate() { }

	cancel_btn() {
		this.display = 'none';
	}



}