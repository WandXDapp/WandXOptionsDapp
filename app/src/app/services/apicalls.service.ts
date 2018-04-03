import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";

@Injectable()
export class ApicallsService {

	private backendUrl = "http://localhost:1414/";

	private urlList: any;

	constructor(private http: Http) {
		this.urlList = {
			insertAddress: this.backendUrl + "insertAddress",
			isAddressPresent: this.backendUrl + "isAddressPresent",
			getUserDetails: this.backendUrl + "getUserDetails",
			updateUserProfile: this.backendUrl + "updateUserProfile",
			getActiveOptions: this.backendUrl + "getActiveOptions",
			getUserOptions: this.backendUrl + "getUserOptions"
		}
	}

	public async insertAddress(address): Promise<boolean> {
		let result = await new Promise((resolve, reject) => {
			var headers = new Headers();
			headers.append("Access-Control-Allow-Origin", '*');
			this.http.put(this.urlList['insertAddress'], { "address": address}, { headers: headers }).subscribe(
				data => {
					resolve(JSON.parse(data['_body']).result);
				},
				err => {
					reject(false);
				}
			);
		}) as any;
		return Promise.resolve(result);
	}

	public async isAddressPresent(address): Promise<any> {
		let isPresent = await new Promise((resolve, reject) => {
			var headers = new Headers();
			headers.append("address", address);
			this.http.get(this.urlList['insertAddress'], { headers: headers}).subscribe(
				data => {
					resolve(JSON.parse(data['_body']).result);
				},
				err => {
					reject(false);
				}
			);
		}) as any;
		return Promise.resolve(isPresent);
	}

	public async getUserProfile(address): Promise<any> {
		let userProfile = await new Promise((resolve, reject) => {
			var headers = new Headers();
			headers.append("address", address);
			this.http.get(this.urlList['getUserDetails'], { headers: headers}).subscribe(
				data => {
					resolve(JSON.parse(data['_body']).user);
				},
				err => {
					reject(null);
				}
			);
		}) as any;
		return Promise.resolve(userProfile);
	}

	public async updateUserProfile(userProfile, address): Promise<boolean> {
		let result = await new Promise((resolve, reject) => {
			var headers = new Headers();
			headers.append("Access-Control-Allow-Origin", '*');
			userProfile.address = address;
			this.http.put(this.urlList['updateUserProfile'], userProfile, { headers: headers }).subscribe(
				data => {
					resolve(data);
				},
				err => {
					reject(null);
				}
			);
		}) as any;
		return Promise.resolve(result);
	}

	public async getActiveOptions(tokenName, currentBlockNumber): Promise<any> {
		let optionList = await new Promise((resolve, reject) => {
			var headers = new Headers();
			headers.append("tokenName", tokenName);
			headers.append("currentBlockNumber", currentBlockNumber);
			this.http.get(this.urlList['getActiveOptions'], { headers: headers}).subscribe(
				data => {
					resolve(JSON.parse(data['_body']).optionList);
				},
				err => {
					reject([]);
				}
			);
		}) as any;
		return Promise.resolve(optionList);
	}

	public async getUserOptions(address, tokenName, currentBlockNumber): Promise<any> {
		let optionList = await new Promise((resolve, reject) => {
			var headers = new Headers();
			headers.append("address", address);
			headers.append("tokenName", tokenName);
			headers.append("currentBlockNumber", currentBlockNumber);
			this.http.get(this.urlList['getUserOptions'], { headers: headers}).subscribe(
				data => {
					resolve(JSON.parse(data['_body']).optionList);
				},
				err => {
					reject([]);
				}
			);
		}) as any;
		return Promise.resolve(optionList);
	}
}
