import { Component, OnInit, ElementRef } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { NgForm } from '@angular/forms';

import { AuthService } from './services/auth.service';
import { ContractsService } from './services/contracts.service';

var BigNumber = require('bignumber.js');

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	public balance: number;
	
	constructor() { }

    ngOnInit(){ 
      
    }

    suggestUserName() {
		const suggestedName = 'Superuser';
    } 
}
