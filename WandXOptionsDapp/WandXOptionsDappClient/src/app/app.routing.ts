import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { TablesComponent } from './tables/tables.component';
import { TypographyComponent } from './typography/typography.component';
import { NotificationsComponent } from './notifications/notifications.component';

//import { DashboardComponent } from './dashboard/dashboard.component';

import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';



const routes: Routes =[
    { path: 'createoptions',      component: HomeComponent },
    { path: 'user',           component: UserComponent },
    { path: 'activeoptions',          component: TablesComponent },
    { path: 'statistics',     component: TypographyComponent },
    { path: 'expiredoptions',  component: NotificationsComponent },
    { path: '',          redirectTo: 'createoptions', pathMatch: 'full' },
    // { path: 'notifications',  component: NotificationsComponent, canActivate: [AuthGuard] },
    // { path: 'dashboard',      component: HomeComponent, canActivate: [AuthGuard] },
    // { path: 'user',           component: UserComponent, canActivate: [AuthGuard] },
    // { path: 'table',          component: TablesComponent, canActivate: [AuthGuard] },
    // { path: 'typography',     component: TypographyComponent, canActivate: [AuthGuard] },
    // { path: 'notifications',  component: NotificationsComponent, canActivate: [AuthGuard] },
    //{ path: '',  component: DashboardComponent, canActivate: [AuthGuard] },
    //{ path: '',          redirectTo: 'dashboard', pathMatch: 'full' },
    //{ path: 'register', component: RegisterComponent },
    //{ path: 'login', component: LoginComponent },
    //{ path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes),
    //FlashMessagesModule.forRoot()
  ],
  exports: [
  ],
  //providers: [ValidateService, AuthService, AuthGuard],
})
export class AppRoutingModule { }
