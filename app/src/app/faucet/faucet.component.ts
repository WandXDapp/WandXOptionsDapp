import { Component, OnInit, Type, Directive } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContractsService } from '../services/contracts.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgForm } from '@angular/forms';

var BigNumber = require('bignumber.js');

@Component({
	selector: 'app-faucet',
	templateUrl: './faucet.component.html',
	styleUrls: ['./faucet.component.scss'],
	providers: [ContractsService]
})

export class FaucetComponent implements OnInit {

	faucetTokenList: any;
	searchTokenList: any;
	
	displaySuccess: string;
	displayFail: string;
	displayGif: string;

	selectedToken: any;
	tokenBalance: number = 0;

	tokenToRequest: number = 0;

	search: string = null;
	
	constructor(public contractsService: ContractsService, private fb: FormBuilder, private cdRef: ChangeDetectorRef) {
		this.displaySuccess = 'none';
		this.displayFail = 'none';
		this.displayGif = 'none';
		this.faucetTokenList = contractsService.getTokenList();
		this.searchTokenList = this.faucetTokenList;
		this.selectedToken = this.searchTokenList[0];
	}

	ngOnInit() {
		this.contractsService.initWeb3().then((result) => {
			this.setCurrentToken(this.searchTokenList[0]);
		});
	}

	setCurrentToken(token) {
		this.selectedToken = this.getTokenObj(token);
		this.getTokenBalance();
	}

	getTokenObj(token){
		return this.contractsService.getTokenObj(token.name);
	}

	getTokenBalance(){
		let multiplyFactor = new BigNumber(10).pow(this.selectedToken.decimals).toNumber();
		this.contractsService.getBalance(this.selectedToken.address).then((balance) => {
			this.tokenBalance = balance / multiplyFactor;
		});
	}

	requestToken() {
		this.displayGif = 'block';
		let multiplyFactor = new BigNumber(10).pow(this.selectedToken.decimals).toNumber();
		let noOfDesiredTokens = this.tokenToRequest * multiplyFactor;
		this.contractsService.getTokens(this.selectedToken.address, noOfDesiredTokens).then((output: boolean) => {
			this.displayGif = 'none';
			if (output === true) {
				this.displaySuccess = 'block';
			}
			else {
				this.displayFail = 'block';
			}
			this.tokenToRequest = 0;
			this.getTokenBalance();
		});
	}

	cancel_btn() {
		this.displayGif = 'none';
		this.displaySuccess = 'none';
		this.displayFail = 'none';
	}

	searchToken() {
		if(this.search == ''){
			this.searchTokenList = this.faucetTokenList;
		}
		else {
			this.searchTokenList = [];
			this.faucetTokenList.forEach(element => {
				if(element.name.toLowerCase().includes(this.search.toLowerCase())){
					this.searchTokenList.push(element);
				}
			});
		}
	}	
}
