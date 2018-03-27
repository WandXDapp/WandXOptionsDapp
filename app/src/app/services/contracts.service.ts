import { Injectable } from '@angular/core';
import * as Web3 from 'web3';

const ierc20 = require("wandx-options/build/contracts/IERC20.json");
const derivativeFactory = require("wandx-options/build/contracts/DerivativeFactory.json");
const option = require("wandx-options/build/contracts/Option.json");
const wandxfaucet = require("wandx-options/build/contracts/WandXTokenFaucet.json");

const dummyTokenBase = require("wandx-options/build/dummyTokenBaseInfo.json");
const dummyTokenQuote = require("wandx-options/build/dummyTokenQuoteInfo.json");

export const WEB3_INITIALIZED = 'WEB3_INITIALIZED';

declare let require: any;
declare let window: any;

const networkMap = {
	1: 'mainnet',
	2: 'morden',
	3: 'ropsten',
	4: 'rinkeby',
	15: 'localhost',
	42: 'kovan',
	4447: 'truffle',
};

@Injectable()
export class ContractsService {
	
	private _account: string = null;
	private _web3: any;
	private _web3Status: string = null;
	private _test_version: any;
	private _test_version_name: string;
	
	private _useNetwork: string = '15';
	private _useNetworkNumber: number = 15;
	private _gas = 4000000;
	private _gasPrice = 21000000000;
	
	private _faucetObj: any;
	private _derivativeFactoryObj: any;
	
	constructor() { }

	public async initWeb3(): Promise<string> {

		this._web3Status = null;
		
		let initStatus = await new Promise((resolve, reject) => {
			var web3 = window.web3;
			var response = null;

			// Checking if Web3 has been injected by the browser (Mist/MetaMask)
			if (typeof web3 !== 'undefined' && web3.currentProvider && web3.currentProvider.isMetaMask) {
				console.log("Mist/MetaMask's detected!");

				if (!web3.eth.defaultAccount) {
					response = "Please unlock MetaMask!";
					console.log(response);
					this._web3Status = response;
					reject(response);
				}
			
				web3 = new Web3(web3.currentProvider);
				this._web3 = web3;
				
				web3.eth.net.getId((err, version) => {
					this._test_version = version;
					this._test_version_name = networkMap[this._test_version];
					if (this._test_version !== this._useNetworkNumber) {
						response = 'Please connect to the Ropsten network';
						console.log(response);
						this._web3Status = response;
						reject(response);
					}
					else {
						response = "success";
						console.log("Connected to " + this._test_version_name);
						this._web3Status = response;
						resolve(response);
					}
				});
			} else {
				response = "No web3 instance injected";
				console.log(response);
				this._web3Status = response;
				reject(response);
			}
		}) as string;

		if(initStatus == 'success'){
			let account = await this.getAccount();
			this._faucetObj = this.createContractObj(wandxfaucet.abi, wandxfaucet.networks[this._useNetwork].address);
			this._derivativeFactoryObj = this.createContractObj(derivativeFactory.abi, derivativeFactory.networks[this._useNetwork].address);
		}
		
		return Promise.resolve(initStatus);
	}
	
	public getNetworkVersion(): number {
		return this._useNetworkNumber;
	}

	public getBaseTokenAddress(): string {
		return dummyTokenBase.address;
	}

	public getQuoteTokenAddress(): string {
		return dummyTokenQuote.address;
	}

	public async getContractFee(): Promise<number> {
		var fee = await new Promise((resolve, reject) => {
			this._derivativeFactoryObj.methods.getOptionFee().call().then(function(result){
				resolve(result);
			});
		}) as number;
		return Promise.resolve(fee);
	}

	public async getUserBalance(): Promise<number> {
		var fee = await new Promise((resolve, reject) => {
			this._faucetObj.methods.balanceOf(this._web3.eth.defaultAccount).call().then(function(result){
				resolve(result);
			});
		}) as number;
		return Promise.resolve(fee);
	}

	public getweb3Status(){
		return this._web3Status;
	}

	public async getCurrentAllowance(): Promise<number> {		
		var allowance = await new Promise((resolve, reject) => {
			this._faucetObj.methods.allowance(this._web3.eth.defaultAccount,  derivativeFactory.networks[this._useNetwork].address).call().then(function(result){
				resolve(result);
			});
		}) as any;
		return Promise.resolve(allowance);
	}

	public async faucetGetTokens(tokenCount): Promise<boolean> {		
		var getTokens = await new Promise((resolve, reject) => {
			this._faucetObj.methods.getTokens(tokenCount, this._web3.eth.defaultAccount).send({}, function(error, result){
				if(error){
					console.log("faucetGetTokens erorr", error);
					resolve(false);
				}
				console.log("faucetGetTokens result", result);
				resolve(true);
			});
		}) as boolean;
		return Promise.resolve(getTokens);
	}

	public async faucetApprove(tokenCount): Promise<boolean> {		
		var approve = await new Promise((resolve, reject) => {
			this._faucetObj.methods.approve(derivativeFactory.networks[this._useNetwork].address, tokenCount).send({}, function(error, result){
				if(error){
					console.log("faucetApprove erorr", error);
					resolve(false);
				}
				console.log("faucetApprove result", result);
				resolve(true);
			});
		}) as boolean;
		return Promise.resolve(approve);
	}

	public async createNewOption(baseToken, quoteToken, baseTokenDecimal, quoteTokenDecimal, strikePrice, blockTimestamp): Promise<string> {
		
		var optionAddress = await new Promise((resolve, reject) => {			
			
			this._derivativeFactoryObj.methods.createNewOption(
				baseToken,
				quoteToken,
				baseTokenDecimal,
				quoteTokenDecimal,
				strikePrice,
				blockTimestamp
			)
			.send()
			.on('receipt', function(receipt){ 
				resolve(receipt.events.LogOptionCreated.returnValues._optionAddress);
			})
			.catch(function(error) {
				console.log("error", error);
				reject("error");
			});
		}) as string;
		return Promise.resolve(optionAddress);
	}

	public async approveAssets(contractAddress, optionAddress, assetValue): Promise<boolean> {
		var approve = await new Promise((resolve, reject) => {
			var assetObj = this.createContractObj(ierc20.abi, contractAddress);
			assetObj.methods.approve(optionAddress, assetValue).send({}, function(error, result){
				if(error){
					reject(false);
				}
				resolve(true);
			});
		}) as boolean;
		return Promise.resolve(approve);
	}

	public async issueOption(optionAddress, assetsOffered, premium, expiry): Promise<any> {
		var response = await new Promise((resolve, reject) => {			
			var optionObj = this.createContractObj(option.abi, optionAddress);
			optionObj.methods.issueOption(
				assetsOffered,
				premium,
				expiry
			).send()
			.then(function(error, result){
				if (error){
					console.error('Error in issueOption', error);
					reject(null);
				}
				else{
					console.log('Result of issueOption', result);
					resolve(result);
				}
			});
		}) as any;
		return Promise.resolve(response);
	}

	private async getAccount(): Promise<string> {		
		if (this._account == null) {
			this._account = await new Promise((resolve, reject) => {
				this._web3.eth.getAccounts((err, accs) => {
					if (err != null) {
						alert('There was an error fetching your accounts.');
						return;
					}
			
					if (accs.length === 0) {
						alert(
							'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
						);
						return;
					}
					resolve(accs[0]);
				})
			}) as string;
			this._web3.eth.defaultAccount = this._account;
		}
		return Promise.resolve(this._account);
	}

	private createContractObj(abi, address): any {
		var contractObj = new this._web3.eth.Contract(abi, address);
		contractObj.options.from = this._web3.eth.defaultAccount;
		contractObj.options.gas = this._gas;
		contractObj.options.gasPrice = this._gasPrice;
		return contractObj;
	}
}
