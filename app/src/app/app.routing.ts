import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { OptionsComponent } from './options/options.component';
import { OptionDetailsComponent } from './optiondetails/optiondetails.component';

import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';
import { FaucetComponent } from './faucet/faucet.component';

const routes: Routes = [
	{ path: 'createoptions',		component: HomeComponent },
	{ path: 'user',					component: UserComponent },
	{ path: 'activeoptions',		component: OptionsComponent },
	{ path: 'optiondetails',		component: OptionDetailsComponent },
	{ path: 'optiondetails/:name',	component: OptionDetailsComponent },
	{ path: 'faucet',				component:  FaucetComponent},
	{ path: '',						redirectTo: 'createoptions', pathMatch: 'full' }
];

@NgModule({
	imports: [
		CommonModule,
		BrowserModule,
		RouterModule.forRoot(routes),
	],
	exports: [ ],
})

export class AppRoutingModule { }