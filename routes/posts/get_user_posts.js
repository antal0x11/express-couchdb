const express = require("express");
const router = express.Router();
const Server = require("../../config/Server");

async function getUserPosts(req,res,next) {

	const { user } = req.query;

	if (typeof(user) !== "string" || user === undefined) {
		res.status(400).json(
			{
				"info" : "invalid body or parameters",
				"internal_error_code" : "GUP07"
			});
		return;
	}

	const db = new Server(process.env.DB, process.env.CREDENTIALS);

	try {

		const data = await db.getUserPosts(user);

		if (data.status_code === 200) {
			res.status(200).json(data);
		} else {
			res.status(data.status_code).json(data);
		}

	} catch(e) {
		console.error(e);
		res.status(500).json(
		{
			"info" : "something broke",
			"internal_error_code": "GUP00"
		})
	}

}

router.get("/get_user_posts", getUserPosts);
module.exports = router;