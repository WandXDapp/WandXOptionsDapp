import { Injectable } from '@angular/core';
import * as Web3 from 'web3';

const BigNumber = require('bignumber.js');

const ierc20 = require("wandx-options/build/contracts/IERC20.json");
const derivativeFactory = require("wandx-options/build/contracts/DerivativeFactory.json");
const option = require("wandx-options/build/contracts/Option.json");
const wandxfaucet = require("wandx-options/build/contracts/WandXTokenFaucet.json");

const dummyTokenInfo = require("wandx-options/build/dummyTokenInfo.json");

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

	private _optionWrapper: OptionWrapper = null;
	
	constructor() { }

	/*
	 * COMMON FUNCTIONS TO INTERACT WITH WEB3 OR METAMASK
	 * LIKE GET CONNECTION STATE OR ADDRESS
	 */

	// Initialise web3 object with metamask
	public async initWeb3(): Promise<boolean> {
		let response = false;
		if(await this._initWeb3() == 'success')
			response = true;
		return Promise.resolve(response);
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
		let address = null;
		dummyTokenInfo.forEach(element => {
			if(element.name == 'WANDX'){
				address = element.address[this._useNetwork];
				return;
			}
		});
		return address;
	}

	// Get list of all the tokens currently active for wandx dapp
	public getTokenList(): any {
		return dummyTokenInfo;
	}

	// Get any perticular object of token
	public getTokenObj(tokenName): any {
		let retToken = {
			address: '',
			decimals: '',
			deployed: '',
			name: '',
			symbol: ''
		};
		dummyTokenInfo.forEach(element => {
			if(element.name == tokenName){
				retToken.address = element.address[this._useNetwork];
				retToken.decimals = element.decimals;
				retToken.deployed = element.deployed;
				retToken.name = element.name;
				retToken.symbol = element.symbol;
				return;
			}
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

	// This is not IERC20 function, but will be used in faucet page
	public async getTokens(tokenAddress, tokenCount): Promise<boolean> {
		var getTokens = await new Promise((resolve, reject) => {
			var tokenObj = this.createContractObj(wandxfaucet.abi, tokenAddress);
			tokenObj.methods.getTokens(
				tokenCount, 
				this._web3.eth.defaultAccount
			)
			.send()
			.on('receipt', function(receipt){ 
				resolve(true);
			})
			.catch(function(error) {
				console.log("error", error);
				resolve(false);
			});;
		}) as boolean;
		return Promise.resolve(getTokens);
	}

	/*
	 * END COMMON FUNCTIONS FOR ANY IERC20 CONTRACT
	 */

	/*
	 * FUNCTIONS FOR CREATING AND UTILISING OPTIONS
	 */

	// Init optionwarraper with given option address
	public async initWithOptionAddress(optionAddress): Promise<boolean> {
		return Promise.resolve(this._optionWrapper.initWithOptionAddress(optionAddress));
	}
	
	// Create a new option
	public async createNewOption(baseToken, quoteToken, baseTokenDecimal, quoteTokenDecimal, strikePrice, blockTimestamp): Promise<string> {
		this._optionWrapper.setBaseToken(baseToken);
		this._optionWrapper.setQuoteToken(quoteToken);
		this._optionWrapper.setBaseTokenDecimal(baseTokenDecimal);
		this._optionWrapper.setQuoteTokenDecimal(quoteTokenDecimal);
		this._optionWrapper.setStrikePrice(strikePrice);
		this._optionWrapper.setBlockTimestamp(blockTimestamp);
		return Promise.resolve(this._optionWrapper.createNewOption());
	}

	// Issue option
	public async issueOption(assetsOffered, premium, expiry): Promise<any> {
		this._optionWrapper.setAssetsOffered(assetsOffered);
		this._optionWrapper.setPremium(premium);
		this._optionWrapper.setExpiry(expiry);
		return Promise.resolve(await this._optionWrapper.issueOption());
	}

	// Trade Option
	public async tradeOption(amount): Promise<any> {
		this._optionWrapper.setTradeOptionAmount(amount);
		return Promise.resolve(await this._optionWrapper.tradeOption());
	}

	// Excersise Option
	public async exerciseOption(amount): Promise<any> {
		this._optionWrapper.setExerciseOptionAmount(amount);
		return Promise.resolve(await this._optionWrapper.exerciseOption());
	}

	// Get premium of option
	public getOptionPremium(): number {
		return this._optionWrapper.getPremium();
	}

	/*
	 * END FUNCTIONS FOR CREATING AND UTILISING OPTIONS
	 */

	/*
	 * PRIVATE FUNCTIONS USED BY OTHER FUNCTIONS OF THIS SERVICE
	 */

	// Initialise web3 object with metamask
	private async _initWeb3(): Promise<string> {

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
			this._optionWrapper = new OptionWrapper(this._web3, this._gas, this._gasPrice, this._derivativeFactoryObj);
		}
		
		return Promise.resolve(initStatus);
	}

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

class OptionWrapper {

	private web3: any = null;
	private gas: number = 4000000;
	private gasPrice: number = 21000000000;
	
	private derivativeFactoryObj: any = null;
	
	private baseToken: string = null;
	private quoteToken: string = null;
	private baseTokenDecimal: number = 0;
	private quoteTokenDecimal: number = 0;
	private strikePrice: number = 0;
	private blockTimestamp: number = 0;

	private assetsOffered: number = 0;
	private premium: number = 0;
	private expiry: number = 0;

	private tradeOptionAmount: number = 0;
	private exerciseOptionAmount: number = 0;

	private optionAddress: string = null;
	private issueOptionTokenProxy: string = null;
	private tradeOptionTimestamp: number = 0;
	private exerciseOptionTimestamp: number = 0;

	constructor(web3, gas, gasPrice, derivativeFactoryObj){
		this.web3 = web3;
		this.gas = gas;
		this.gasPrice = gasPrice;
		this.derivativeFactoryObj = derivativeFactoryObj;
	}

	public getBaseToken(): string {
		return this.baseToken;
	}
	public setBaseToken(baseToken) {
		this.baseToken = baseToken;
	}
	public getQuoteToken(): string {
		return this.quoteToken;
	}
	public setQuoteToken(quoteToken) {
		this.quoteToken = quoteToken;
	}
	public getBaseTokenDecimal(): number {
		return this.baseTokenDecimal;
	}
	public setBaseTokenDecimal(baseTokenDecimal) {
		this.baseTokenDecimal = baseTokenDecimal;
	}
	public getQuoteTokenDecimal(): number {
		return this.quoteTokenDecimal;
	}
	public setQuoteTokenDecimal(quoteTokenDecimal) {
		this.quoteTokenDecimal = quoteTokenDecimal;
	}
	public getStrikePrice(): number {
		return this.strikePrice;
	}
	public setStrikePrice(strikePrice) {
		this.strikePrice = strikePrice;
	}
	public getBlockTimestamp(): number {
		return this.blockTimestamp;
	}
	public setBlockTimestamp(blockTimestamp) {
		this.blockTimestamp = blockTimestamp;
	}
	public getAssetsOffered(): number {
		return this.assetsOffered;
	}
	public setAssetsOffered(assetsOffered) {
		this.assetsOffered = assetsOffered;
	}
	public getPremium(): number {
		return this.premium;
	}
	public setPremium(premium) {
		this.premium = premium;
	}
	public getExpiry(): number {
		return this.expiry;
	}
	public setExpiry(expiry) {
		this.expiry = expiry;
	}
	public getTradeOptionAmount(): number {
		return this.tradeOptionAmount;
	}
	public setTradeOptionAmount(tradeOptionAmount) {
		this.tradeOptionAmount = tradeOptionAmount;
	}
	public getExerciseOptionAmount(): number {
		return this.exerciseOptionAmount;
	}
	public setExerciseOptionAmount(exerciseOptionAmount) {
		this.exerciseOptionAmount = exerciseOptionAmount;
	}
	public getOptionAddress(): string {
		return this.optionAddress;
	}
	public getIssueOptionTokenProxy(): string {
		return this.issueOptionTokenProxy;
	}
	public getTradeOptionTimestamp(): number {
		return this.tradeOptionTimestamp
	}
	public getExerciseOptionTimestamp(): number {
		return this.exerciseOptionTimestamp;
	}
	
	public async initWithOptionAddress(optionAddress): Promise<boolean> {
		let result = await new Promise((resolve, reject) => {
			var optionObj = this.createContractObj(option.abi, optionAddress);
			optionObj.methods.getOptionDetails().call((error, result) => {
				if(error == null){
					this.optionAddress = optionAddress;
					this.baseToken = result[1];
					this.quoteToken = result[2];
					this.issueOptionTokenProxy = result[3];
					this.strikePrice = result[4];
					this.expiry = result[5];
					this.premium = result[6];

					optionObj.methods.B_DECIMAL_FACTOR().call((error, result) => {
						this.baseTokenDecimal = result;
					});

					optionObj.methods.Q_DECIMAL_FACTOR().call((error, result) => {
						this.quoteTokenDecimal = result;
					});
					resolve(true);
				}
				else {
					resolve(false);
				}
			});
		}) as boolean;
		return Promise.resolve(result);
	}
	
	public async createNewOption(): Promise<string> {
		this.optionAddress = await new Promise((resolve, reject) => {
			this.derivativeFactoryObj.methods.createNewOption(
				this.baseToken,
				this.quoteToken,
				this.baseTokenDecimal,
				this.quoteTokenDecimal,
				this.strikePrice,
				this.blockTimestamp
			)
			.send()
			.on('receipt', function(receipt){ 
				resolve(receipt.events.LogOptionCreated.returnValues._optionAddress);
			})
			.catch(function(error) {
				console.log("error", error);
				resolve(null);
			});
		}) as string;
		return Promise.resolve(this.optionAddress);
	}

	public async issueOption(): Promise<string> {
		let multiplyFactor = new BigNumber(10).pow(this.quoteTokenDecimal).toNumber();
		let assetValue = this.assetsOffered * this.strikePrice * multiplyFactor;
		let approve = await this.approveToken(this.quoteToken, this.optionAddress, assetValue);
		if(!approve)
			return Promise.resolve(null);
		var response = await new Promise((resolve, reject) => {
			var optionObj = this.createContractObj(option.abi, this.optionAddress);
			optionObj.methods.issueOption(
				this.assetsOffered,
				this.premium,
				this.expiry
			)
			.send()
			.on('receipt', (receipt) => {
				this.issueOptionTokenProxy = receipt.events.LogOptionsIssued.returnValues._tokenProxy;
				resolve(this.issueOptionTokenProxy);
			})
			.catch(function(error) {
				console.error('Error in issueOption', error);
				resolve(null);
			});
		}) as any;
		return Promise.resolve(response);
	}

	// Trade Option
	public async tradeOption(): Promise<any> {
		let multiplyFactor = new BigNumber(10).pow(parseInt(this.quoteTokenDecimal.toString())).toNumber();
		let assetValue = this.tradeOptionAmount * this.premium * multiplyFactor;
		let approve = await this.approveToken(this.quoteToken, this.optionAddress, assetValue);
		if(!approve)
			return Promise.resolve(null);
		var response = await new Promise((resolve, reject) => {			
			var optionObj = this.createContractObj(option.abi, this.optionAddress);
			optionObj.methods.tradeOption(
				this.web3.eth.defaultAccount, 
				this.tradeOptionAmount
			)
			.send()
			.on('receipt', function(receipt){
				this.trandOptionTimestamp = receipt.events.LogOptionsTrade.returnValues._timestamp;
				resolve(this.trandOptionTimestamp);
			})
			.catch(function(error) {
				console.error('Error in issuetradeOptionOption', error);
				resolve(null);
			});
		}) as any;
		return Promise.resolve(response);
	}

	// Excersise Option
	public async exerciseOption(): Promise<any> {
		let approveAssets = await this.approveToken(this.optionAddress, this.optionAddress, this.exerciseOptionAmount);
		if(!approveAssets)
			return Promise.resolve(null);
		let multiplyFactor = new BigNumber(10).pow(parseInt(this.baseTokenDecimal.toString())).toNumber();
		let assetValue = this.exerciseOptionAmount * this.premium * multiplyFactor;
		let approveBaseToken = await this.approveToken(this.baseToken, this.issueOptionTokenProxy, assetValue);
		if(!approveBaseToken)
			return Promise.resolve(null);
		var response = await new Promise((resolve, reject) => {
			var optionObj = this.createContractObj(option.abi, this.optionAddress);
			optionObj.methods.exerciseOption(
				this.exerciseOptionAmount
			)
			.send()
			.on('receipt', function(receipt){
				this.exerciseOptionTimestamp = receipt.events.LogOptionsExcercised.returnValues._timestamp;
				resolve(this.exerciseOptionTimestamp);
			})
			.catch(function(error) {
				console.error('Error in exerciseOption', error);
				resolve(null);
			});
		}) as boolean;
		return Promise.resolve(response);
	}

	// Create an object of contract from abi and address
	private createContractObj(abi, address): any {
		var contractObj = new this.web3.eth.Contract(abi, address);
		contractObj.options.from = this.web3.eth.defaultAccount;
		contractObj.options.gas = this.gas;
		contractObj.options.gasPrice = this.gasPrice;
		return contractObj;
	}

	// To approve use of token to a perticular contract
	private async approveToken(tokenAddress, contractAddress, tokenCount): Promise<boolean> {
		let balance = await this.getBalance(tokenAddress);
		if(balance < tokenCount)
			return Promise.reject(false);
		var approve = await new Promise((resolve, reject) => {
			let tokenObj = this.createContractObj(ierc20.abi, tokenAddress);
			tokenObj.methods.approve(
				contractAddress, 
				tokenCount
			)
			.send()
			.on('receipt', function(receipt){
				resolve(true);
			})
			.catch(function(error) {
				reject(false);
			});
		}) as boolean;
		return Promise.resolve(approve);
	}

	// To Get Token Balance
	private async getBalance(tokenAddress): Promise<number> {
		let balance = await new Promise((resolve, reject) => {
			let tokenObj = this.createContractObj(ierc20.abi, tokenAddress);
			tokenObj.methods.balanceOf(this.web3.eth.defaultAccount).call().then(function(result){
				resolve(result);
			});
		}) as number;
		return Promise.resolve(balance);
	}
}