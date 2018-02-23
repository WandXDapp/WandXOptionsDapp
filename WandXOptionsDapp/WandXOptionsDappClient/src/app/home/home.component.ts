import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { LegendItem, ChartType } from '../lbd/lbd-chart/lbd-chart.component';


declare interface TokenData {
    tokenData: string[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    public tableData1: TokenData;
    public tableData2: TokenData;
  constructor() { }

  take_special_char(event){
      var l;
      l = event.charCode;  //         k = event.keyCode;  (Both can be used)
      return((l > 64 && l < 91) || (l > 96 && l < 123) || l == 8 || l == 32 || (l >= 48 && l <= 57) || l==46);
    }

  ngOnInit() {

      this.tableData1 = {tokenData: ['ETH','WINGS','DNT','MTL','APPC','KNC','PFR','ICN','GUP','BAR','FDX','REQ','CRED','DRGN','POWR','FYN','DICE','VSL','BNTY','IND'],};
      this.tableData2 = {tokenData: ['ETH','WINGS','DNT','MTL','APPC','KNC','PFR','ICN','GUP','BAR','FDX','REQ','CRED','DRGN','POWR','FYN','DICE','VSL','BNTY','IND'],};

    }

}
