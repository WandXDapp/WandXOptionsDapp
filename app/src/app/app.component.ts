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
    // cs.initWeb3().then(function(result) {
    //   cs.getWandFromFaucet().then(function(result) {
    //     console.log("Tokens Successfully transferred from faucet" + result);
    //   })
    // })
    
    cs.initWeb3().then(function(result) {
      cs.createNewOption(
        '0xD8d9020237eDE2C0d89403900D7aFC57E5b3DA3b',
        '0xE9bD8515a3D09Ac5b56dFBa6c4244A26cad81A7E',
        18,
        18,
        1,
        1526342400
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
