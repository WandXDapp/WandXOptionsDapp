import { Injectable } from '@angular/core';
import * as Web3 from 'web3';

const derivativeFactory = require("wandx-options/build/contracts/DerivativeFactory.json");
const option = require("wandx-options/build/contracts/Option.json");
const wandxfaucet = require("wandx-options/build/contracts/WandXTokenFaucet.json");

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
	
	constructor() { }

	public async initWeb3(): Promise<any> {
		return new Promise((resolve, reject) => {
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
		}) as Promise<any>;
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

	private async getWandFromFaucet(): Promise<boolean> {		
		
		var faucet = new this._web3.eth.Contract(wandxfaucet.abi, wandxfaucet.networks[this._useNetwork].address);
		
		// var getTokenObj = await new Promise((resolve, reject) => {
		// 	faucet.methods.getTokens("10000000000000000000000", this._web3.eth.defaultAccount).send({from: this._web3.eth.defaultAccount}, function(error, result){
		// 		console.log(error, result);
		// 		resolve(result);
		// 	});
		// }) as any;

		var getTokenObj = await new Promise((resolve, reject) => {
			faucet.methods.approve(derivativeFactory.networks[this._useNetwork].address, "10000000000000000000000").send({from: this._web3.eth.defaultAccount}, function(error, result){
				console.log(error, result);
				resolve(result);
			});
		}) as any;
		return Promise.resolve(true);
	}

	
	public async createNewOption(baseToken, quoteToken, baseTokenDecimal, quoteTokenDecimal, strikePrice, blockTimestamp): Promise<string> {
		let account = await this.getAccount();
		// let getWandFromFaucet = await this.getWandFromFaucet();

		// await new Promise((resolve, reject) => {
		// 	let options = {
		// 		from: this._web3.eth.defaultAccount,
		// 		gas: 40000
		// 	}
		// 	var optionInst = new this._web3.eth.Contract(option.abi, option);
		// 	console.log(optionInst);

		// 	optionInst.deploy({
		// 		data: option.deployedBytecode,
		// 		arguments: [baseToken, quoteToken, baseTokenDecimal, quoteTokenDecimal, strikePrice, blockTimestamp, this._web3.eth.defaultAccount]
		// 	}).send({
		// 		from: this._web3.eth.defaultAccount,
		// 		gas: 1500000,
		// 		gasPrice: '30000000000000'
		// 	}, function(error, transactionHash){ 
		// 		console.log(transactionHash);
		// 	 }).on('error', function(error){ 
		// 		console.log(error);
		// 	}).on('transactionHash', function(transactionHash){ 
		// 		console.log(transactionHash);
		// 	}).on('receipt', function(receipt){
		// 	   console.log(receipt.contractAddress) // contains the new contract address
		// 	}).on('confirmation', function(confirmationNumber, receipt){ 
		// 		console.log(receipt);
		// 	}).then(function(newContractInstance){
		// 		console.log(newContractInstance.options.address) // instance with the new contract address
		// 	});

		var optionAddress = await new Promise((resolve, reject) => {			
			var derivativeFactoryObj = new this._web3.eth.Contract(derivativeFactory.abi, derivativeFactory.networks[this._useNetwork].address);
			//derivativeFactoryObj.options.from = this._web3.eth.defaultAccount; // default from address
			// derivativeFactoryObj.options.gasPrice = '1000000000000'; // default gas price in wei
			// derivativeFactoryObj.options.gas = 300000;
			console.log(`baseToken:${baseToken}\n
						quoteToken:${quoteToken}\n
						baseTokenDecimal:${baseTokenDecimal}\n
						quoteTokenDecimal:${quoteTokenDecimal}\n
						strikePrice:${strikePrice}\n
						blocktimestamp:${blockTimestamp}\n`);
			derivativeFactoryObj.methods.createNewOption(
				baseToken,
				quoteToken,
				baseTokenDecimal,
				quoteTokenDecimal,
				strikePrice,
				blockTimestamp
			).send({
				from: this._web3.eth.defaultAccount,
				gas: 4000000
			}).then(function(receipt){
				console.log(receipt);
			}).catch(function(error) {
				console.log(error);
			});
			// }, function(error, result){
			// 	console.log("create txn hash", result);
			// 	if(error){
			// 		reject(error);
			// 	}
			// })
			// .on('OptionCreated', function(baseToken, quoteToken, blockTimestamp, optionAddress, creator){
			// 	console.log('Result of createNewOption', optionAddress);
			// 	resolve(optionAddress);
			// });
		}) as string;
		return Promise.resolve("optionAddress");
		// return Promise.resolve("dfdf");
	}

	// public async issueOption(optionAddress, assetsOffered, premium, expiry): Promise<any> {
	// 	var response = await new Promise((resolve, reject) => {			
	// 		var optionObj = new this._web3.eth.Contract(option.abi, optionAddress);
	// 		optionObj.methods.issueOption(
	// 			assetsOffered,
	// 			premium,
	// 			expiry
	// 		).send({from: this._web3.eth.defaultAccount }, function(error, result){
	// 			if (error){
	// 				console.error('Error in issueOption', error);
	// 				reject(null);
	// 			}
	// 			else{
	// 				console.log('Result of issueOption', result);
	// 				resolve(result);
	// 			}
	// 		});			
	// 	}) as any;
	// 	return Promise.resolve(response);
	// }
	
	// public async getUserBalance(): Promise<number> {
	// 	let account = await this.getAccount();
	// 	console.log(account);
	// 	return new Promise((resolve, reject) => {
	// 		let _web3 = this._web3;
	// 		//console.log(this._tokenContract.methods.owner.call())
	// 		/* this._tokenContract.methods.owner(account, function (err, result) {
	// 			if (err != null) {
	// 				reject(err);
	// 			}
	// 			resolve(_web3.fromWei(result));
	// 		});*/
	// 	}) as Promise<number>;
	// }
}
