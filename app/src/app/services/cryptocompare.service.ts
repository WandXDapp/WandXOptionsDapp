import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
@Injectable()
export class CryptocompareService {

    constructor(private http: Http) { }
    getPriceDetail(token) {
        return new Promise((resolve, reject)=> {
           this.http.get('https://min-api.cryptocompare.com/data/price?fsym='+token+'&tsyms=ETH,USD')
                .subscribe(
                    data => {
                        resolve(data.json())
                    }, err => {
                        console.log("errror", err);
                        reject(err)
                    });
        });
    }
}
