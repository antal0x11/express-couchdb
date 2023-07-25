const express = require("express");
const app = express();
const Post = require("./models/Post.js");
const figlet = require("figlet");
require("dotenv").config();

app.use(express.json());

const credentials = process.env.CREDENTIALS;
const baseUrl = process.env.DB;
const port = process.env.PORT;


app.get("/get-posts", async function(req,res,next) {

	const url = `${baseUrl}/_all_docs?include_docs=true`;

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization" : "Basic " + Buffer.from(credentials).toString("base64")
			}
		});

		if (response.ok) {
			const data = await response.json();
			res.status(200).json({data: data});
		} else {
			res.status(404).json({info : "nothing found"});
		}
	} catch(e) {
		console.error(e);
		res.status(500).json({info: "something broke"});
	}

});

app.post("/create-post", async function(req,res,next) {
	
	const url = `${baseUrl}`;

	const { username, first_name, last_name, msg } = req.body; 

	const usersPost = new Post({
		username: (typeof(username) === "string" && username !== undefined) ? username : null,
		first_name: (typeof(first_name) === "string" && first_name !== undefined) ? first_name : null,
		last_name: (typeof(last_name) === "string" && last_name !== undefined) ? last_name : null,
		date: new Date().toString(),
		msg: (typeof(msg) === "string" && msg !== undefined) ? msg : null
	});

	if (!usersPost.valid_post) {
		res.status(400).json(
		{
			status: "request fail",
			reason: "missing arguments"
		});

	} else {
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type" : "application/json",
					"Authorization" : "Basic " + Buffer.from(credentials).toString("base64")
				},
				body: JSON.stringify(usersPost)
			});

			if (response.ok) {
				const data = await response.json();
				res.status(200).json(data);
			} else {
				res.status(400).json(usersPost);
			}
		} catch(e) {
			console.error(e);
			res.status(500).json({info: "something broke"});
		}
	}

});

app.listen(port, () => {

	figlet("Express-CouchDB", (err,data) => {
		if (err) {
			console.log("[+] Something is wrong with figlet.");
			console.error(err);
		} 
		console.log(data);
		console.log(`[+] Server is up and running on port ${port}.`);
	});
})