import $ from "jquery";

class Api {
	static url = 'http://localhost:1337/api/';

	static async executeGetMethod(name, params) {
		return fetch(Api.url + name + ((params !== undefined && Object.keys(params).length > 0) ? ('?' + new URLSearchParams(params)) : ''), {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		});
	}

	static async executePostMethod(name, params) {
		if (params instanceof FormData) {
			return fetch(Api.url + name, {
				method: 'POST',
				body: params,
			});
		}

		let postData = JSON.stringify(params);
		return fetch(Api.url + name, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: postData,
		});
	}
};

export default Api;