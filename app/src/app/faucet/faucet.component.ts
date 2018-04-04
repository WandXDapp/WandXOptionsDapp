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
  tokenListJSON: any;
  values: any;
  result: any;
  tokenListArray = [''];
  i = 0;
  length: any;
  showDropDown = false;
  filterdStatus = '';
  displayDropDown: any;
  selectedValue: any;
  noOfDesiredTokens: number;
  selectedTokenJSON: any;
  selectedTokenAddress: any;
  selectedTokenDecimals: any;


  tokenForm: FormGroup;

  constructor(public contractsService: ContractsService, private fb: FormBuilder, private cdRef: ChangeDetectorRef) {

  this.faucetTokenList = contractsService.getTokenList();
    this.displayDropDown = 'none';

    this.i = 0;
		while (this.faucetTokenList[this.i] !== undefined) {
			this.tokenListArray[this.i] = this.faucetTokenList[this.i].name;
      this.i++;
    }
    this.initForm();


   }

  initForm(): FormGroup {
    return this.tokenForm = this.fb.group({
      search: [null]
    })
  }

  ngOnInit() {
  }

  selectValue(value) {
    this.tokenForm.patchValue({ 'search': value });
    this.showDropDown = false;
    this.displayDropDown = 'none';
    this.selectedValue = value;
  }

  closeDropDown() {
    this.showDropDown = !this.showDropDown;
  }

  openDropDown() {
    this.showDropDown = false;
  }

  getSearchValue() {
    this.displayDropDown = 'block';
    return this.tokenForm.value.search;
  }

  onSubmit_token(form: HTMLFormElement) {
    this.noOfDesiredTokens = form.value.noOfTokens;
    console.log(this.selectedValue);
    this.selectedTokenJSON = this.contractsService.getTokenObj(this.selectedValue);
    this.selectedTokenAddress = this.selectedTokenJSON.address;
    this.selectedTokenDecimals = this.selectedTokenJSON.decimals;
    let multiplyFactor = new BigNumber(10).pow(this.selectedTokenDecimals).toNumber();
    this.selectedTokenDecimals = multiplyFactor * this.noOfDesiredTokens;
  }
}
