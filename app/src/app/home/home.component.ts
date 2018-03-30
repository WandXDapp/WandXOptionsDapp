// import { ContractsService } from './../services/contracts.service';
import { ContractsService } from '../services/contracts.service';
import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { LegendItem, ChartType } from '../lbd/lbd-chart/lbd-chart.component';
import { NgForm } from '@angular/forms';
import Web3 from 'web3';

var BigNumber = require('bignumber.js');

declare interface TokenData {
    tokenData: string[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ContractsService]
})
export class HomeComponent implements OnInit {
  demo: string;
  value1: any;
  value2: any;
  web3: any = [];
  public tableData1: TokenData;
  public tableData2: TokenData;
  base_token: any = '';
  base_tokenJSON: any;
  baseTokenAddress: any = '';
  quote_token: any = '';
  quote_tokenJSON: any = '';
  qouteTokenAddress: any = '';
  expiry_date_1: any = '';
  alloance: any = '';
  assets_offered: any = '';
  premium: any = '';
  blockNumber: any;
  minBlockNumber: any;
  blockdata: any = '';
  newdate: any;
  date: number;
  month: any;
  year: number;
  validdate: any;
  token: any;
  eth: any;
  contractsService:any;
  public UserBalance: any;
  public CurrentAllowance: any;
  public ContractFee: any;
  public optionAddress: any;
  baseTokenDecimal: any;
  quoteTokenDecimal: any;
  strikePrice: any;
  blockTimestamp: any;
  assetsOffered: any;
  assetValue: any;
  multiplyFactor: any;
  display: any;
  popupAllowanceInput: number;
  wandxTokenAddress: any;
  flag: number;
  tokenList: any;
//    abi_Derivative_Factory: any = json_Derivative_Factory.abi[0];
  constructor( _contractsService: ContractsService) {
    this.display = 'none';

    // this.demo = demoMethod();


    var day = new Date();
    // console.log(day); // Apr 30 2000

    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    this.date = nextDay.getDate();
    this.month = nextDay.getMonth();
    this.month = this.month + 1;
    if (this.month.toString().length === 1) {
      this.month = this.month;
    }
    this.year = nextDay.getFullYear();

    this.validdate = this.year + '-0' + this.month + '-' + this.date;
    // console.log(this.validdate);

    // this.token = _contractsService.getUserBalance();
    this.contractsService = _contractsService;


    // this.base_token = this.contractsService.getBaseTokenAddress();
    // this.quote_token = this.contractsService.getQuoteTokenAddress();

    this.strikePrice = 1;
    this.blockTimestamp = Date.now() + 86400000;

    this.assetsOffered = 50;
    this.premium = 10;
    this.expiry_date_1 = 5000;

    this.contractsService.initWeb3().then((result) => {

      this.wandxTokenAddress = _contractsService.getWandxTokenAddress();

      this.tokenList = _contractsService.getTokenList();
      // console.log(this.tokenList[0].name);
      // console.log(Object.values(this.tokenList));

      _contractsService.getBalance(this.wandxTokenAddress).then((balance: number) => {
        // console.log(balance);
        this.UserBalance = balance;


      });

      _contractsService.getWandxAllowance().then((allowance: number) => {
        // console.log(allowance);
        this.CurrentAllowance = allowance;

      });

      _contractsService.getContractFee().then((contractFee: number) => {
        // console.log(contractFee);
        this.ContractFee = contractFee;
      });

      this.contractsService.getBlockNumber().then((blockNumber: number) => {
        // console.log(contractFee);
        this.blockNumber = blockNumber;
        // console.log(blockNumber);
        this.minBlockNumber = blockNumber + 50;
        // console.log(this.minBlockNumber);

      });
// *************************** to get faucets******************** //

      // let tokenCount = '10000000000000000000000';
      // this.contractsService.faucetGetTokens(tokenCount).then((result) => {
      //   if (result) {
      //     this.contractsService.faucetApprove(tokenCount).then(function (result) {

      //     })
      //   }
      // });
    });
   }

  take_special_char(event){
      var l;
      l = event.charCode;  //         k = event.keyCode;  (Both can be used)
      return((l > 64 && l < 91) || (l > 96 && l < 123) || l == 8 || l == 32 || (l >= 48 && l <= 57) || l==46);
    }

    // form:any;

  ngOnInit() {

    // this.form = new FormGroup({
    //   blockdata = new FormControl(22);
    // });

    // while (this.contractsService.getweb3Status() != null){}




//    this.demo = this._contractsService.demoMethod();

    this.tableData1 = {tokenData: ['ETH','WINGS','DNT','MTL', 'APPC','KNC','PFR','ICN','GUP','BAR','FDX','REQ','CRED','DRGN','POWR','FYN','DICE','VSL', 'BNTY', 'IND'], };
    this.tableData2 = {tokenData: ['ETH', 'WINGS', 'DNT', 'MTL', 'APPC', 'KNC', 'PFR', 'ICN', 'GUP', 'BAR', 'FDX', 'REQ', 'CRED', 'DRGN', 'POWR', 'FYN', 'DICE', 'VSL', 'BNTY', 'IND'], };

  }


  onSubmit1(form: HTMLFormElement) {
    this.value1 = form;
    // console.log(form.value.base_token);
    this.base_token = form.value.base_token;
    this.quote_token = form.value.quote_token;
    this.expiry_date_1 = form.value.expiry_date_1;
    this.alloance = form.value.alloance;
    this.base_tokenJSON = this.contractsService.getTokenObj(this.base_token);
    this.baseTokenDecimal = this.base_tokenJSON.decimals;
    this.baseTokenAddress = this.base_tokenJSON.address;
    this.quote_tokenJSON = this.contractsService.getTokenObj(this.quote_token);
    this.quoteTokenDecimal = this.quote_tokenJSON.decimals;
    this.qouteTokenAddress = this.quote_tokenJSON.address;

  }

  onSubmit2(form2: HTMLFormElement) {
    this.value2 = form2;
    this.assets_offered = form2.value.assets_offered;
    this.premium = form2.value.premium;
    this.blockdata = form2.value.blockdata;
  }

  onSubmit3(form3: HTMLFormElement) {
    console.log(form3);
  }

  onSubmitAllowance(form: HTMLFormElement) {
    // console.log(form.value.popupAllowanceInput);
    this.popupAllowanceInput = form.value.popupAllowanceInput;
    this.popupAllowanceInput = this.popupAllowanceInput * 1000000000000000000;
  }

  connectMeta() {
    let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    this.web3.isConnected();
  }

  onStepOne() {
    // console.log(this.UserBalance);
    // console.log(this.CurrentAllowance);

    if (this.UserBalance > this.CurrentAllowance) {

      this.contractsService.createNewOption(
        this.baseTokenAddress,
        this.qouteTokenAddress,
        this.baseTokenDecimal,
        this.quoteTokenDecimal,
        this.strikePrice,
        this.blockTimestamp
      ).then((optionAddress) => {
        // console.log(allowance);
        this.optionAddress = optionAddress;
        console.log(this.optionAddress);
      });

      // optionCreate();
    }else {
      // popup
      this.display = 'block';
      // console.log(this.popupAllowanceInput + 'popup balce');
      // console.log(this.UserBalance + 'user bal');

      if (this.popupAllowanceInput < this.UserBalance ) {
      //  this.flag = 2;
        this.display = 'none';
        console.log(this.display);
      }

      // this.CurrentAllowance < = this.UserBalance --> confirm on Ok
      // approvewandx()
      // optionCreate();
    }
  }

  onStepTwo() {
    if (this.blockdata >= this.minBlockNumber) {

    this.multiplyFactor = new BigNumber(10).pow(this.quoteTokenDecimal).toNumber();
    this.assetValue = this.assetsOffered * this.strikePrice * this.multiplyFactor;
    // console.log(this.optionAddress);
    // console.log(this.quote_token);

    this.contractsService.approveAssets(this.qouteTokenAddress, this.optionAddress, this.assetValue).then(function (result) { // approvetoken
        if(!result){
          console.log(' Unable to approce assets ');
          return;
        }
        console.log(this.optionAddress);

        this.contractsService.issueOption(this.optionAddress, this.assetsOffered, this.premium, this.expiry_date_1).then(function(result) {
          console.log('issue' + result);
        }, function(err) {
          console.log(err);
        });
      });
    }else{
      alert("Block Number is low");
      var error_block = 1;
    }
  }

  minDate() {
    this.newdate = Date();
  }


  getBalance() {
    this.contractsService.getUserBalance().then(function (balance: number) {
      return balance;
    });
  }

  getAllowance() {
    this.contractsService.getCurrentAllowance().then(function (allowance: number) {
      return allowance;
    });
  }

  optionCreate() {

  }

  approveAllowance() {
    if (this.popupAllowanceInput < this.UserBalance) {
      // this.display = 'none';
    }
  }

  cancel_btn() {
    this.display = 'none';
    // this.flag = 1;
  }

}

// list of faucet
// dropdown
// web3.h.default()