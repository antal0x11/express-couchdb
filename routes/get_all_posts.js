const express = require("express");
const router = express.Router();
const Server = require("../config/Server.js");

async function get_all_posts(req,res,next) {

	const host = process.env.DB;
	const credentials = process.env.CREDENTIALS;

	const db = new Server(host,credentials);

	try {
		const data = await db.getAllPosts();

		if (isEmpty(data)) {
			res.status(404).json(
			{
				info: "nothing found",
				status: 404
			});

		} else {
			if (Object.keys(data).length === 2 && data.status !== 200) {
				res.status(data.status).json(data);
			}
		}

		res.status(200).json(data);
	} catch(e) {
		console.error(e);
	}
}

function isEmpty(objectEmpty) {
	return (objectEmpty && Object.keys(objectEmpty).length === 0 && objectEmpty.constructor === Object);
}

router.get("/get-posts", get_all_posts);
module.exports = get_all_posts;