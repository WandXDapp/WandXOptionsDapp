import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";

@Injectable()
export class ApicallsService {
	
	constructor(private http: Http) { }

	public async insertAddress(address): Promise<boolean> {
		let result = await new Promise((resolve, reject) => {
			var headers = new Headers();
			headers.append("Access-Control-Allow-Origin", '*');
			this.http.put("http://localhost:1414/insertAddress", { "address": address}, { headers: headers }).subscribe(
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
			this.http.get("http://localhost:1414/isAddressPresent", { headers: headers}).subscribe(
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
			this.http.get("http://localhost:1414/getUserDetails", { headers: headers}).subscribe(
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
			this.http.put("http://localhost:1414/updateUserProfile", userProfile, { headers: headers }).subscribe(
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
			this.http.get("http://localhost:1414/getActiveOptions", { headers: headers}).subscribe(
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
			this.http.get("http://localhost:1414/getUserOptions", { headers: headers}).subscribe(
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
