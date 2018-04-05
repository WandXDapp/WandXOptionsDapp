
import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

var BigNumber = require('bignumber.js');

@Component({
	selector: 'navbar-cmp',
	templateUrl: 'navbar.component.html',
})

export class NavbarComponent implements OnInit{
	
	private listTitles: any[];
	private toggleButton: any;
	private sidebarVisible: boolean;
	
	constructor(
		private location: Location, 
		private element: ElementRef, 
		private authService: AuthService,
		private router: Router,
		private flashMessagesServie: FlashMessagesService
	) {
		this.sidebarVisible = false;
	}

	ngOnInit(){
		this.listTitles = ROUTES.filter(listTitle => listTitle);
		const navbar: HTMLElement = this.element.nativeElement;
		this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
	}

	sidebarOpen() {
		const toggleButton = this.toggleButton;
		const body = document.getElementsByTagName('body')[0];
		setTimeout(function(){
			toggleButton.classList.add('toggled');
		}, 500);
		body.classList.add('nav-open');
		this.sidebarVisible = true;
	}

	sidebarClose() {
		const body = document.getElementsByTagName('body')[0];
		this.toggleButton.classList.remove('toggled');
		this.sidebarVisible = false;
		body.classList.remove('nav-open');
	}

	sidebarToggle() {
		if (this.sidebarVisible === false) {
			this.sidebarOpen();
		} else {
			this.sidebarClose();
		}
	}

	getTitle(){
        let mainTitle = this.location.prepareExternalUrl(this.location.path());        
		
		// Check name in last part
		let title = mainTitle.split('/').pop();
		for(var item = 0; item < this.listTitles.length; item++){
			if(this.listTitles[item].path === title){
				return this.listTitles[item].title;
			}
		}
		
		// Check name in second last part
		let titleSplit = mainTitle.split("/");
		let pageName = titleSplit[titleSplit.length - 2];
		if(pageName == 'optiondetails')
			return 'Option Details';
		
		// Default
		return "Dashboard";
	}
}
