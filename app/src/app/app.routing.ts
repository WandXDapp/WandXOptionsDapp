import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { TablesComponent } from './tables/tables.component';
import { TypographyComponent } from './typography/typography.component';
import { NotificationsComponent } from './notifications/notifications.component';

import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';
import { FaucetComponent } from './faucet/faucet.component';

const routes: Routes = [
	{ path: 'createoptions',	component: HomeComponent },
	{ path: 'user',				component: UserComponent },
	{ path: 'activeoptions',	component: TablesComponent },
  { path: 'statistics', component: TypographyComponent },
	{ path: 'statistics/:name',		component: TypographyComponent },
	{ path: 'expiredoptions',	component: NotificationsComponent },
	{ path: 'faucet',			component:  FaucetComponent},
	{ path: '',					redirectTo: 'createoptions', pathMatch: 'full' }
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