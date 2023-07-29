const express = require("express");
const app = express();
const Post = require("./models/Post.js");
const figlet = require("figlet");
require("dotenv").config();

app.use(express.json());

const credentials = process.env.CREDENTIALS;
const baseUrl = process.env.DB;
const port = process.env.PORT;

const get_all_posts = require("./routes/posts/get_all_posts");
const delete_post = require("./routes/posts/delete_post");
const create_post = require("./routes/posts/create_post");
const get_user_posts = require("./routes/posts/get_user_posts");
const update_post = require("./routes/posts/update_post");

app.use("/", get_all_posts);
app.use("/", delete_post);
app.use("/", create_post);
app.use("/", get_user_posts);
app.use("/", update_post);

app.listen(port, () => {

	figlet("Express-CouchDB", (err,data) => {
		if (err) {
			console.log("[+] Something is wrong with figlet.");
			console.error(err);
		} 
		console.log(data);
		console.log(`[+] Server is up and running on port ${port}.`);
	});

});