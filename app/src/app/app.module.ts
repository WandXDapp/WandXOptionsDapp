import {LetterBoldPipe} from './pipe/letter-bold.pipe';
import {SearchFilterPipe} from './pipe/filter-pipe';
import {ClickOutsideDirective} from './directive/dropdown.directive';

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';

import {AppRoutingModule} from './app.routing';
import {NavbarModule} from './shared/navbar/navbar.module';
import {FooterModule} from './shared/footer/footer.module';
import {SidebarModule} from './sidebar/sidebar.module';

import {AppComponent} from './app.component';

import {HomeComponent} from './home/home.component';
import {UserComponent} from './user/user.component';
import {OptionsComponent} from './options/options.component';
import {OptionDetailsComponent} from './optiondetails/optiondetails.component';
import {FaucetComponent} from './faucet/faucet.component';
import {ChartComponent} from './chart/chart.component';

// New Components addition for OAuth
import {ValidateService} from './services/validate.service';
import {AuthService} from './services/auth.service';
import {CryptocompareService} from './services/cryptocompare.service';
import {ChartService} from './services/chart.service';
import {FlashMessagesModule} from 'angular2-flash-messages';
import {AuthGuard} from './guards/auth.guard';
import { AmChartsModule } from "@amcharts/amcharts3-angular";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        UserComponent,
        OptionsComponent,
        OptionDetailsComponent,
        FaucetComponent,
        ClickOutsideDirective,
        SearchFilterPipe,
        LetterBoldPipe,
        ChartComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        NavbarModule,
        FooterModule,
        SidebarModule,
        RouterModule,
        AppRoutingModule,
        FlashMessagesModule.forRoot(),
        AmChartsModule
    ],
    providers: [ValidateService, AuthService, AuthGuard, CryptocompareService,ChartService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
