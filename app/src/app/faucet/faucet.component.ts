import { Component, OnInit, Type, Directive } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContractsService } from '../services/contracts.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-faucet',
  templateUrl: './faucet.component.html',
  styleUrls: ['./faucet.component.scss']
})
export class FaucetComponent implements OnInit {

  tokenList: any;
  tokenListJSON: any;
  values: any;
  result: any;
  tokenListArray = [''];
  i = 0;
  length: any;
  showDropDown = false;

  tokenForm: FormGroup;

  constructor(_contractsService: ContractsService, private fb: FormBuilder) {

    // var tokenListArray = new Array();
	// tslint:disable-next-line:indent
  this.tokenList = _contractsService.getTokenList();
    // this.tokenListJSON = JSONparse(this.tokenList);
    // console.log(this.tokenList);
    // console.log(this.tokenList[0].name.length);
    // this.length = this.tokenList[0].name.length;
    // // console.log(this.length);
    this.i = 0;
    while (this.tokenList[this.i] !== undefined) {
      // this.tokenListArray[this.i] = this.tokenList[this.i].name;
      // console.log(this.tokenList[this.i].name);
      this.tokenListArray[this.i] = this.tokenList[this.i].name;
      // console.log(this.tokenListArray);
      this.i++;
    }
    // console.log(this.tokenListArray);
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
  }

  closeDropDown() {
    this.showDropDown = !this.showDropDown;
  }

  openDropDown() {
    this.showDropDown = false;
  }

  getSearchValue() {
    return this.tokenForm.value.search;
  }
}
