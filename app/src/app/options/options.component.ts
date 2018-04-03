import { Component, OnInit } from '@angular/core';
import { ApicallsService } from '../services/apicalls.service';
import { ContractsService } from '../services/contracts.service';

@Component({
	selector: 'app-options',
	templateUrl: './options.component.html',
	styleUrls: ['./options.component.css'],
	providers: [ ApicallsService, ContractsService ]
})

export class OptionsComponent implements OnInit {
	
	private tokenList: any;
	private tokenname: string;

	private activeOptions: any;
	private myOptions: any;
	private expiredOptions: any;

	constructor( private apiCalls:ApicallsService, private contractsService: ContractsService ) { }
	
	ngOnInit() {
		
		this.tokenList = [];
		this.activeOptions = [];
		this.myOptions = [];
		this.expiredOptions = [];

		this.contractsService.initWeb3().then((result) => {
			this.tokenList = this.contractsService.getTokenList();
			this.tokenname = this.tokenList[0].name;
			this.getOptionsForToken();
		});
	}

	getOptionsForToken() {

		this.contractsService.getBlockNumber().then((currentBlockNumber) => {
			this.apiCalls.getActiveOptions(this.tokenname, currentBlockNumber).then((optionList) => {
				this.activeOptions = optionList;
			});

			this.apiCalls.getUserOptions(this.contractsService.getUserAddress(), this.tokenname, currentBlockNumber).then((optionList) => {
				optionList.forEach(element => {
					if(element.isActive){
						this.myOptions.push(element);
					}
					else {
						this.expiredOptions.push(element);
					}
				});
			});
		})
		
	}
}