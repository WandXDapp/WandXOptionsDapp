import { Injectable } from '@angular/core';
import * as Web3 from 'web3';

const ierc20 = require("wandx-options/build/contracts/IERC20.json");
const derivativeFactory = require("wandx-options/build/contracts/DerivativeFactory.json");
const option = require("wandx-options/build/contracts/Option.json");
const wandxfaucet = require("wandx-options/build/contracts/WandXTokenFaucet.json");

const dummyTokens = require("wandx-options/build/dummyTokenInfo.json");

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
declare namespace web3Functions{
    export function initializeWeb3();
}
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

	/*
	 * COMMON FUNCTIONS TO INTERACT WITH WEB3 OR METAMASK
	 * LIKE GET CONNECTION STATE OR ADDRESS
	 */

	// Initialise web3 object with metamask
public async initWeb3(): Promise<string> {

this._web3Status = null;
		
let initStatus = await new Promise((resolve, reject) => {
let web3 = window.web3;
let response = null;

			// Checking if Web3 has been injected by the browser (Mist/MetaMask)
			if (typeof web3 !== 'undefined' && web3.currentProvider && web3.currentProvider.isMetaMask) {
				console.log("Mist/MetaMask's detected!");

				if (!web3.eth.defaultAccount) {
					response = "Please unlock MetaMask!";
					console.log(response);
					this._web3Status = response;
					reject(response);
				}

				web3 = web3Functions.initializeWeb3();
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
	
	// Get current status of connection
	public getweb3Status(): string {
		return this._web3Status;
	}

	// Get the network number on which metamask is connected at present
	public getNetworkVersion(): number {
		return this._useNetworkNumber;
	}

	// Get latest block number
	public async getBlockNumber(): Promise<number> {		
		let blockNumber = await new Promise((resolve, reject) => {
			this._web3.eth.getBlockNumber((err, blockNumber) => {
				if (err != null) {
					reject(0);
				}
				resolve(blockNumber);
			})
		}) as number;
		return Promise.resolve(blockNumber);
	}

	// Get address of logged in user
	public getUserAddress(): string {
		return this._web3.eth.defaultAccount;
	}

	/*
	 *  END COMMON FUNCTIONS TO INTERACT WITH WEB3 OR METAMASK
	 */

	/*
	 * FUNCTIONS RELATED TO WORKING OF WANDX
	 */

	// Get wandx token address
	public getWandxTokenAddress(): string {
		return wandxfaucet.networks[this._useNetwork].address;
	}

	// Get list of all the tokens currently active for wandx dapp
	public getTokenList(): any {
		return dummyTokens;
	}

	// Get any perticular object of token
	public getTokenObj(tokenName): any {
		let retToken = {};
		dummyTokens.forEach(function(token){
			if(token.name == tokenName)
				retToken = token;
		});
		return retToken;
	}

	// Get current allowance of wandx token
	public async getWandxAllowance(): Promise<number> {		
		var allowance = await this.getAllowance(
			wandxfaucet.networks[this._useNetwork].address, 
			derivativeFactory.networks[this._useNetwork].address
		);
		return Promise.resolve(allowance);
	}

	// Approve wandx tokens
	public async approveWandx(tokenCount): Promise<boolean> {	
		var approve = await this.approveToken(
			wandxfaucet.networks[this._useNetwork].address, 
			derivativeFactory.networks[this._useNetwork].address, 
			tokenCount);
		return Promise.resolve(approve);
	}

	// Get the fee utilsed in creating an option
	public async getContractFee(): Promise<number> {
		let fee = await new Promise((resolve, reject) => {
			this._derivativeFactoryObj.methods.getOptionFee().call().then(function(result){
				resolve(result);
			});
		}) as number;
		return Promise.resolve(fee);
	}

	/*
	 * END FUNCTIONS RELATED TO WORKING OF WANDX
	 */

	/*
	 * COMMON FUNCTIONS FOR ANY IERC20 CONTRACT
	 */

	// To Get Token Balance
	public async getBalance(tokenAddress): Promise<number> {
		let balance = await new Promise((resolve, reject) => {
			let tokenObj = this.createContractObj(ierc20.abi, tokenAddress);
			tokenObj.methods.balanceOf(this._web3.eth.defaultAccount).call().then(function(result){
				resolve(result);
			});
		}) as number;
		return Promise.resolve(balance);
	}

	// To check if any contract has allowance of the token
	public async getAllowance(tokenAddress, contractAddress): Promise<number> {		
		var allowance = await new Promise((resolve, reject) => {
			var tokenObj = this.createContractObj(ierc20.abi, tokenAddress);
			tokenObj.methods.allowance(this._web3.eth.defaultAccount,  contractAddress).call().then(function(result){
				resolve(result);
			});
		}) as any;
		return Promise.resolve(allowance);
	}

	// To approve use of token to a perticular contract
	public async approveToken(tokenAddress, contractAddress, tokenCount): Promise<boolean> {
		var approve = await new Promise((resolve, reject) => {
			var tokenObj = this.createContractObj(ierc20.abi, tokenAddress);
			tokenObj.methods.approve(contractAddress, tokenCount).send({}, function(error, result){
				if(error){
					console.log("approveContract erorr", error);
					resolve(false);
				}
				resolve(true);
			});
		}) as boolean;
		return Promise.resolve(approve);
	}

	/*
	 * END COMMON FUNCTIONS FOR ANY IERC20 CONTRACT
	 */

	/*
	 * FUNCTIONS FOR CREATING AND UTILISING OPTIONS
	 */

	// Create a new option
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

	// Issue option
	public async issueOption(optionAddress, assetsOffered, premium, expiry): Promise<any> {
		var response = await new Promise((resolve, reject) => {
			var optionObj = this.createContractObj(option.abi, optionAddress);
			optionObj.methods.issueOption(
				assetsOffered,
				premium,
				expiry
			)
			.send()
			.on('receipt', function(receipt){
				resolve(receipt.events.LogOptionsIssued.returnValues._tokenProxy);
			})
			.catch(function(error) {
				console.error('Error in issueOption', error);
				reject(null);
			});
		}) as any;
		return Promise.resolve(response);
	}

	// Trade Option
	public async tradeOption(optionAddress, amount): Promise<any> {
		var response = await new Promise((resolve, reject) => {			
			var optionObj = this.createContractObj(option.abi, optionAddress);
			optionObj.methods.tradeOption(
				this._web3.eth.defaultAccount, 
				amount
			)
			.send()
			.on('receipt', function(receipt){
				resolve(receipt.events.LogOptionsTrade.returnValues._timestamp);
			})
			.catch(function(error) {
				console.error('Error in issuetradeOptionOption', error);
				reject(null);
			});
		}) as any;
		return Promise.resolve(response);
	}

	// Excersise Option
	public async exerciseOption(optionAddress, amount): Promise<any> {
		var response = await new Promise((resolve, reject) => {
			var optionObj = this.createContractObj(option.abi, optionAddress);
			optionObj.methods.exerciseOption(
				amount
			)
			.send()
			.on('receipt', function(receipt){
				resolve(receipt.events.LogOptionsExcercised.returnValues._timestamp);
			})
			.catch(function(error) {
				console.error('Error in exerciseOption', error);
				reject(null);
			});
		}) as boolean;
		return Promise.resolve(response);
	}

	/*
	 * END FUNCTIONS FOR CREATING AND UTILISING OPTIONS
	 */

	/*
	 * PRIVATE FUNCTIONS USED BY OTHER FUNCTIONS OF THIS SERVICE
	 */

	// Get user account form web3
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

	// Create an object of contract from abi and address
	private createContractObj(abi, address): any {
		var contractObj = new this._web3.eth.Contract(abi, address);
		contractObj.options.from = this._web3.eth.defaultAccount;
		contractObj.options.gas = this._gas;
		contractObj.options.gasPrice = this._gasPrice;
		return contractObj;
	}

	// For testing only, have to remove before final version
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
}
