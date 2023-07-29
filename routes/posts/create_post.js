const express = require("express");
const router = express.Router();
const Server = require("../../config/Server");
const Post = require("../../models/Post");


async function createPost(req,res,next) {

	const db = new Server(process.env.DB,process.env.CREDENTIALS);

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

			const data = await db.createPost(usersPost);

			if (data.status_code === 200) {
				res.status(200).json(data);
			} else {
				res.status(data.status_code).json(data);
			}
			
		} catch(e) {
			console.error(e);
			res.status(500).json({
				"info" : "something broke",
				"internal_error_code" : "CP03"
			});
		}
	}
}

router.post("/create_post", createPost);
module.exports = router;