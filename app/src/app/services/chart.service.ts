import {Injectable, Inject, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Http, RequestOptions, Headers} from '@angular/http';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class ChartService {
    private temp: any;
    USD: any;
    private lowAndHigh: any;
    private selectedToken: any;
    private _tokenBaseName = new BehaviorSubject<string>(null);
    private _tokenQuoteName = new BehaviorSubject<string>(null);
    private _chartBaseData = new BehaviorSubject<Object>(null);
    private _chartQuoteData = new BehaviorSubject<Object>(null);
    chartBaseData$ = this._chartBaseData.asObservable();
    chartQuoteData$ = this._chartQuoteData.asObservable();
    tokenBaseName$ = this._tokenBaseName.asObservable();
    tokenQuoteName$ = this._tokenQuoteName.asObservable();
    subscription: Subscription;
    private tokenData = [];
    private graph: string;
    public changeGraph: any;

    constructor(private http: Http) {
        this.tokenData = [];
    }

    getData(token: any, type: string) {
        var reqURL = 'https://min-api.cryptocompare.com/data/histohour?aggregate=6&e=CCCAGG&extraParams=CryptoCompare&fsym=' + token + '&limit=120&tryConversion=false&tsym=ETH';
        return this.http.get(reqURL)
            .subscribe(
                data => {
                    if (type == 'base') {
                        this._tokenBaseName.next(token);
                        this._chartBaseData.next(data.json());
                    } else {
                        this._tokenQuoteName.next(token);
                        this._chartQuoteData.next(data.json());
                    }

                });
    }

    getMinData(token: any, type: string) {
        var reqURL = 'https://min-api.cryptocompare.com/data/histominute?aggregate=1&e=CCCAGG&extraParams=CryptoCompare&fsym=' + token + '&limit=120&tryConversion=false&tsym=ETH';
        return this.http.get(reqURL)
            .subscribe(
                data => {
                    if (type == 'base') {
                        this._tokenBaseName.next(token);
                        this._chartBaseData.next(data.json());
                    } else {
                        this._tokenQuoteName.next(token);
                        this._chartQuoteData.next(data.json());
                    }

                });
    }

    gethoursData(token: any, type: string) {
        var reqURL = 'https://min-api.cryptocompare.com/data/histominute?aggregate=6&e=CCCAGG&extraParams=CryptoCompare&fsym=' + token + '&limit=120&tryConversion=false&tsym=ETH';
        return this.http.get(reqURL)
            .subscribe(
                data => {
                    if (type == 'base') {
                        this._tokenBaseName.next(token);
                        this._chartBaseData.next(data.json());
                    } else {
                        this._tokenQuoteName.next(token);
                        this._chartQuoteData.next(data.json());
                    }

                });
    }
}
