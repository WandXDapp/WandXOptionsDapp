import { Injectable } from '@angular/core';
import * as Web3 from 'web3';

declare let require: any;
declare let window: any;

let tokenAbi = require('../assets/json/DerivativeFactory_abi.json');

@Injectable()
export class ContractsService {
  private _account: string = null;
  private _web3: any;
 test_version: any;

  private _tokenContract: any;
  private _tokenContractAddress: string = '0x9fb1b0e43c0a632dea3eeaf4ef624895cf28ae1c';

  constructor() {
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider

      this._web3 = new Web3(window.web3.currentProvider);
      this._web3.eth.net.getId((err, version) => {
        // console.log(version);
        this.test_version = version;
        if (this.test_version !== 3) {
          alert('Please connect to the Ropsten network');
        }
      });
    } else {
      console.warn(
        'Please use a dapp browser like mist or MetaMask plugin for chrome'
      );
    }

    this._tokenContract = new this._web3.eth.Contract(tokenAbi, this._tokenContractAddress);
    // console.log(this._tokenContract.methods);
  }

  private async getAccount(): Promise<string> {
    if (this._account == null) {
      this._account = await new Promise((resolve, reject) => {
        this._web3.eth.getAccounts((err, accs) => {
          if (err != null) {
            alert('There was an error fetching your accounts.');
            return;
          }

          if (accs.length === 0) {
            alert(
              'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
            );
            return;
          }
          resolve(accs[0]);
        })
      }) as string;

      this._web3.eth.defaultAccount = this._account;
    }

    return Promise.resolve(this._account);
  }

  public async getUserBalance(): Promise<number> {
    let account = await this.getAccount();
    return new Promise((resolve, reject) => {
      let _web3 = this._web3;
      //console.log(this._tokenContract.methods.owner.call())
     /* this._tokenContract.methods.owner(account, function (err, result) {
        if (err != null) {
          reject(err);
        }

        resolve(_web3.fromWei(result));
      });*/
    }) as Promise<number>;
  }
}
