import { Component, OnInit, Type, Directive } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContractsService } from '../services/contracts.service';
import { FormGroup, FormBuilder } from '@angular/forms';

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

  tokenForm: FormGroup;

	constructor(public contractsService: ContractsService, private fb: FormBuilder) {

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
}
