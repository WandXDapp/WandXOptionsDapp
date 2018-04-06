import { Component, OnInit } from '@angular/core';
import { ContractsService } from '../services/contracts.service';
import { ApicallsService } from '../services/apicalls.service';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.css'],
	providers: [ContractsService, ApicallsService]
})
export class UserComponent implements OnInit {
	
	private userAddress: String = null;
	private userProfile: any = null;
	
	private displaySuccess: any;
	private displayFail: any;
	private displayGif: any;
	
	constructor(
		private contractsService:ContractsService,
		private apiCalls:ApicallsService) {
		this.displaySuccess = 'none';
		this.displayFail = 'none';
		this.displayGif = 'none';

		this.userAddress = '';
		this.userProfile = {
			"aboutMe": '',
			"address": '',
			"city": "",
			"company": "",
			"country": "",
			"email": "",
			"firstName": "",
			"lastName": "",
			"pincode": "",
			"residential_address": "",
			"username": "",
			"_id": ""
		};
	}
	
	ngOnInit() {
		this.contractsService.initWeb3().then((result) => {
			this.userAddress = this.contractsService.getUserAddress();
			this.apiCalls.isAddressPresent(this.userAddress).then((result) => {
				if(result){
					this.apiCalls.getUserProfile(this.userAddress).then((userProfile) => {
						this.userProfile = userProfile;
					});
				}
				else {
					this.apiCalls.insertAddress(this.userAddress).then((result) => {
						if(result){
							this.apiCalls.getUserProfile(this.userAddress).then((userProfile) => {
								this.userProfile = userProfile;
							});
						}
					});
				}
			})
		});;
	}

	updateUserProfile(form: HTMLFormElement) {
		this.displayGif = 'block';
		this.apiCalls.updateUserProfile(form.value, this.userAddress).then((result) => {
			this.displayGif = 'none';
			if (result === undefined || result === null) {
				this.displayFail = 'block';
			} else {
				this.displaySuccess = 'block';
			}
		});
	}

	cancel_btn() {
		this.displaySuccess = 'none';
		this.displayFail = 'none';
	}
}