import { Injectable, Inject, OnInit } from "@angular/core";

declare global {
    interface Window { web3: any; }
}
window.web3 = window.web3 || undefined;

declare namespace web3Functions {
    export function initializeWeb3();
}
@Injectable()
export class Web3Service {
    web3: any;
    constructor() {
        web3Functions.initializeWeb3();
        this.web3 = window.web3;
    }
    getWeb3() {
        return this.web3;
    }

    checkWeb3(): boolean{
        if(this.getWeb3() === null || this.getWeb3() === undefined)
            return false;
        var userAccount = this.getWeb3().eth.coinbase;
        if(userAccount === null || userAccount === undefined || userAccount.length === 0)
            return false;
        return true;
    }
}
