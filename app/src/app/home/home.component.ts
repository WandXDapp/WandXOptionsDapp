import { ContractsService } from '../services/contracts.service';
import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { LegendItem, ChartType } from '../lbd/lbd-chart/lbd-chart.component';
import { NgForm } from '@angular/forms';
import Web3 from 'web3';
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
  demo : string;
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
//    abi_Derivative_Factory: any = json_Derivative_Factory.abi[0];
  constructor(private _contractsService: ContractsService) {
    function Ctrl($scope) {
      $scope.date = new Date();
    }
   }

  take_special_char(event){
      var l;
      l = event.charCode;  //         k = event.keyCode;  (Both can be used)
      return((l > 64 && l < 91) || (l > 96 && l < 123) || l == 8 || l == 32 || (l >= 48 && l <= 57) || l==46);
    }

  ngOnInit() {

//    this.demo = this._contractsService.demoMethod();

    this.tableData1 = {tokenData: ['ETH','WINGS','DNT','MTL', 'APPC','KNC','PFR','ICN','GUP','BAR','FDX','REQ','CRED','DRGN','POWR','FYN','DICE','VSL', 'BNTY', 'IND'], };
    this.tableData2 = {tokenData: ['ETH', 'WINGS', 'DNT', 'MTL', 'APPC', 'KNC', 'PFR', 'ICN', 'GUP', 'BAR', 'FDX', 'REQ', 'CRED', 'DRGN', 'POWR', 'FYN', 'DICE', 'VSL', 'BNTY', 'IND'], };

  }

  getDisplay() {
    return this.onSectionDisplay === 'display' ? 'none' : 'block';
  }

  displayBlock(){
    this.onSectionDisplay = 'notDisplay';
  }

  onSubmit1(form: HTMLFormElement) {
    this.value1 = form;
    console.log(this.value1);
    // console.log(form.value.base_token);
    this.base_token = form.value.base_token;
    this.quote_token = form.value.quote_token;
    this.expiry_date_1 = form.value.expiry_date_1;
    this.alloance = form.value.alloance;
    console.log(this.base_token);
    // console.log(this.alloance);

  }

  onSubmit2(form2: HTMLFormElement) {
    this.value2 = form2;
    console.log(this.value2);
    this.assets_offered = form2.value.assets_offered;
    this.premium = form2.value.premium;
    this.blockdata = form2.value.blockdata;
    console.log(this.premium);
  }

  onSubmit3(form3: HTMLFormElement) {
    console.log(form3);
  }

  connectMeta() {
    let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    this.web3.isConnected();
  }

  onStepOne() {
  }

  minDate() {
    this.newdate = Date();
    return this.newdate;
  }
}
