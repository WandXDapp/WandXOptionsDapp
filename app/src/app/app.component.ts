import { Component, OnInit, ElementRef } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { NgForm } from '@angular/forms';

import { AuthService } from './services/auth.service';
import { ContractsService } from './services/contracts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public balance: number;

  constructor(cs: ContractsService) {
    cs.getUserBalance().then(balance => this.balance = balance);
  }

    ngOnInit(){
    }

    /*isMap(path){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.slice( 1 );
      if(path == titlee){
        return false;
      }
      else {
        return true;
      }
    }*/

    suggestUserName() {
      const suggestedName = 'Superuser';
    }

  
}
