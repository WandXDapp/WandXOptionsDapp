import { Component, OnInit } from '@angular/core';

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

declare interface TokenData {
    tokenData: string[];
}

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {
    public tableData1: TableData;
    public tableData2: TableData;
    public tableData3: TokenData;

  constructor() { }

  ngOnInit() {

      this.tableData3 = {tokenData: ['ETH','WINGS','DNT','MTL','APPC','KNC','PFR','ICN','GUP','BAR','FDX','REQ','CRED','DRGN','POWR','FYN','DICE','VSL','BNTY','IND'],};
      this.tableData1 = {
          headerRow: [ 'No', '%Change', 'Strikeprice', 'Expiry', 'Expired Block', 'Assets Offered'],
          dataRows: [
              ['1', 'WANDX/ETH', '2', '123', '123', '123'],
              ['2', 'WANDX/ETH', '2', '123', '123', '123'],
              ['3', 'WANDX/ETH', '2', '123', '123', '123'],
              ['4', 'WANDX/ETH', '2', '123', '123', '123'],
              ['5', 'WANDX/ETH', '2', '123', '123', '123'],
              ['6', 'WANDX/ETH', '2', '123', '123', '123']
          ]
      };
      this.tableData2 = {
          headerRow: [ 'ID', 'Name',  'Salary', 'Country', 'City' ],
          dataRows: [
              ['1', 'Dakota Rice','$36,738', 'Niger', 'Oud-Turnhout' ],
              ['2', 'Minerva Hooper', '$23,789', 'Curaçao', 'Sinaai-Waas'],
              ['3', 'Sage Rodriguez', '$56,142', 'Netherlands', 'Baileux' ],
              ['4', 'Philip Chaney', '$38,735', 'Korea, South', 'Overland Park' ],
              ['5', 'Doris Greene', '$63,542', 'Malawi', 'Feldkirchen in Kärnten', ],
              ['6', 'Mason Porter', '$78,615', 'Chile', 'Gloucester' ]
          ]
      };
  }

}
