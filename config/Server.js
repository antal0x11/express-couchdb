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

}

module.exports = Server;