class Server {
	
	constructor(host,credentials) {

		this.host = (typeof(host) === "string" && host !== undefined) ? host : null;
		this.credentials = (typeof(credentials) === "string" && credentials !== undefined) ? Buffer.from(credentials).toString("base64") : null;
	
	}

	async getAllPosts() {
		
		const url = `${this.host}/_all_docs?include_docs=true`;

		if (this.host === null || this.credentials === null) {
			throw new Error("missing host or credentials");
		}

		try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization" : `Basic ${this.credentials}`
				}
			});

			if (response.ok) {
				const data = await response.json();
				return data;
			} 

			if (response.status === 404) {
				return {};
			} else {
				const _object = {
					info: "something unexpected occured",
					status: response.status
				};

				return _object;
			}

		} catch(e) {
			throw new Error(e);
		}
	}

	async createPost(postObject) {

		const url = this.host;
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Basic ${this.credentials}`
			},
			body: JSON.stringify(postObject)
		};

		try {
			const response = await fetch(url,options);

			if (response.status === 201 || response.status === 202) {
				
				return {
					"info" : "new post crafted",
					"status_code" : 200
				};

			} else {
				return {
					"info" : "bad request",
					"status_code" : response.status,
					"internal_error_code" : "CP02"
				}
			}
		} catch(e) {
			console.error(e);
			return {
				"info" : "something broke",
				"status_code" : 500,
				"internal_error_code" : "CP01"
			}
		}

	}

	async deletePost(postID, revID) {

		const url = `${this.host}/${postID}?rev=${revID}`;

		if (this.host === null || this.credentials === null) {
			throw new Error("missing host or credentials");
		}

		const options = {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Basic ${this.credentials}`
			} 
		};

		try {
			const response = await fetch(url, options);

			if (response.ok) {
				return {
					"info" : "success",
					"status_code" : response.status
				};
			} else {
				return {
					"info": "fail",
					"status_code": response.status
				};
			}
		} catch(e) {
			throw new Error(e);
		}
	}

	async getUserPosts(user) {

		const url = `${this.host}/_find`;

		if (this.host === null || this.credentials === null) {
			throw new Error("missing host or credentials");
		}

		const parameters = {
			"selector" : {
				"username" : user
			},
			"fields" : ["_id", "_rev", "username", "first_name", "last_name", "date", "msg"]
		};

		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Basic ${this.credentials}`
			},
			body : JSON.stringify(parameters)
		};

		try {

			const response = await fetch(url, options);

			const data = await response.json();

			switch(response.status) {
				
				case 200:

					if (data.docs.length === 0) {
						return {
							"info" : "nothing found",
							"status_code" : 404,
							"internal_error_code" : "GUP04"
						};
					}

					return {
						"status_code" : 200,
						"data" : data.docs
					};
				break;

				case 400:
					return {
						"info" : "invalid request",
						"status_code" : 400,
						"internal_error_code" : "GUP02"
					}
				break;

				case 401:
					return {
						"info" : "Read permission required",
						"status_code" : 401,
						"internal_error_code" : "GUP03"
					};
				break;

				case 404:
					return {
						"info" : "nothing found",
						"status_code" : 404,
						"internal_error_code" : "GUP04"
					}
				break;
			}

		} catch(e) {
			console.error(e);
			return {
				"info" : "something broke",
				"internal_error_code" : "GUP01",
				"status_code" : 500
			}
		}

	}

}

module.exports = Server;