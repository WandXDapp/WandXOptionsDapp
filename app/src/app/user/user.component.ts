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
	
	constructor( 
		private contractsService:ContractsService,
		private apiCalls:ApicallsService) {
		
	}
	
	ngOnInit() {
		this.contractsService.initWeb3().then((result) => {
			this.userAddress = this.contractsService.getUserAddress();
			this.apiCalls.getUserProfile(this.userAddress).then((userProfile) => {
				this.userProfile = userProfile;
			});
		});;
	}

	updateUserProfile(form: HTMLFormElement) {
		this.apiCalls.updateUserProfile(form.value).then((result) => {
			console.log(result);
		});
	}
}