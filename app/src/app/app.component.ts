import { Component, OnInit, ElementRef } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { NgForm } from '@angular/forms';

import { AuthService } from './services/auth.service';
import { ContractsService } from "./contracts.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public balance: number;

  constructor(cs: ContractsService) {
    
    cs.initWeb3().then(function(result) {
      cs.createNewOption(
        '0x65D8e109fB9F8e58162A8301FD15FEc27Cc64603',
        '0xb747DC80634274C03447A188eB30496B2D422977',
        18,
        18,
        1,
        1522797631
      ).then(function(result) {
        console.log("createoption " + result)

        // cs.issueOption(result, 10, 10, 10).then(function(result) {
        //   console.log("issue" + result);
        // }, function(err) {
        //     console.log(err);
        // }); 

      }, function(err) {
          console.log(err);
      });
    }, function(err) {
      console.log(err);
    });
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
