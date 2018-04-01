import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";

@Injectable()
export class ApicallsService {
	
	constructor(private http: Http) { }

	public async getUserProfile(address): Promise<any> {
		let userProfile = await new Promise((resolve, reject) => {
			this.http.get("http://localhost:1414/getUserDetails", "14142369").subscribe(
				data => {
					resolve(data);
				},
				err => {
					reject(null);
				}
			);
		}) as any;
		return Promise.resolve(userProfile);
	}

	public async updateUserProfile(userProfile): Promise<boolean> {
		let result = await new Promise((resolve, reject) => {
			this.http.put("http://localhost:1414/updateUserProfile", userProfile).subscribe(
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
}
