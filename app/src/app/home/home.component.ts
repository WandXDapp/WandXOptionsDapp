// import { ContractsService } from './../services/contracts.service';
import { ContractsService } from '../services/contracts.service';
import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { LegendItem, ChartType } from '../lbd/lbd-chart/lbd-chart.component';
import { NgForm} from '@angular/forms';
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
  onSectionDisplay: String = 'display';
  base_token: any = '';
  quote_token: any = '';
  expiry_date_1: any = '';
  alloance: any = '';
  assets_offered: any = '';
  premium: any = '';
  blockdata: any = '';
  newdate: any;
  date: number;
  month: number;
  year:number;
  validdate:any;
  token:any;
  eth:any;
  contractsService:any;
  public UserBalance: any;
  public CurrentAllowance: any;
  public ContractFee:any; 
  public optionAddress:any;
  baseTokenDecimal:any;
  quoteTokenDecimal:any;
  strikePrice:any;
  blockTimestamp:any;
  assetsOffered:any;
  assetValue:any;
  multiplyFactor:any;
//    abi_Derivative_Factory: any = json_Derivative_Factory.abi[0];
  constructor( _contractsService: ContractsService) {

    // this.demo = demoMethod();


    this.newdate = new Date();
    this.date = this.newdate.getDate();
    this.date = this.date + 1;
    this.month = this.newdate.getMonth();
    this.month = this.month + 1;
    this.year = this.newdate.getFullYear();

    this.validdate = this.year + '-0' + this.month + '-' + this.date;
    // console.log(this.validdate);

    // this.token = _contractsService.getUserBalance();
    this.contractsService = _contractsService;


    this.base_token = this.contractsService.getBaseTokenAddress();
    this.quote_token = this.contractsService.getQuoteTokenAddress();
    this.baseTokenDecimal = 18;
    this.quoteTokenDecimal = 18;
    this.strikePrice = 1;
    this.blockTimestamp = Date.now() + 86400000;

    this.assetsOffered = 50;
    this.premium = 10;
    this.expiry_date_1 = 5000;

    this.contractsService.initWeb3().then((result) => {

      _contractsService.getUserBalance().then((balance: number) => {
        // console.log(balance);
        this.UserBalance = balance;


      });

      _contractsService.getCurrentAllowance().then((allowance:number) => {
        // console.log(allowance);
        this.CurrentAllowance = allowance;

      });

      _contractsService.getContractFee().then((contractFee: number) => {
        // console.log(contractFee);
        this.ContractFee = contractFee;
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

  ngOnInit() {

    // while (this.contractsService.getweb3Status() != null){}




//    this.demo = this._contractsService.demoMethod();

    this.tableData1 = {tokenData: ['ETH','WINGS','DNT','MTL', 'APPC','KNC','PFR','ICN','GUP','BAR','FDX','REQ','CRED','DRGN','POWR','FYN','DICE','VSL', 'BNTY', 'IND'], };
    this.tableData2 = {tokenData: ['ETH', 'WINGS', 'DNT', 'MTL', 'APPC', 'KNC', 'PFR', 'ICN', 'GUP', 'BAR', 'FDX', 'REQ', 'CRED', 'DRGN', 'POWR', 'FYN', 'DICE', 'VSL', 'BNTY', 'IND'], };

  }

  getDisplay() {
    // var abc = await _contractsService.getAccput();
    // _contractsService.getAccount().the(function (abc) {

    // }))
    return this.onSectionDisplay === 'display' ? 'none' : 'block';
  }

  displayBlock(){
    this.onSectionDisplay = 'notDisplay';
  }

  onSubmit1(form: HTMLFormElement) {
    this.value1 = form;
    // console.log(form.value.base_token);
    this.base_token = form.value.base_token;
    this.quote_token = form.value.quote_token;
    this.expiry_date_1 = form.value.expiry_date_1;
    this.alloance = form.value.alloance;
    // console.log(this.alloance);
//    this.quote_token = this.contractsService.getQuoteTokenAddress();

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

  connectMeta() {
    let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    this.web3.isConnected();
  }

  onStepOne() {
    if (this.CurrentAllowance > this.ContractFee){

      this.contractsService.createNewOption(
        this.base_token,
        this.quote_token,
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
      // this.CurrentAllowance <= this.UserBalance --> confirm on Ok
      // faucetApprove()
      // optionCreate();
    }
    // console.log(this.UserBalance);

  }

  onStepTwo() {
    this.multiplyFactor = new BigNumber(10).pow(this.quoteTokenDecimal).toNumber();
    this.assetValue = this.assetsOffered * this.strikePrice * this.multiplyFactor;
    // console.log(this.optionAddress);
    console.log(this.quote_token);
    
    this.contractsService.approveAssets(this.quote_token, this.optionAddress, this.assetValue).then(function (result) {
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


}
