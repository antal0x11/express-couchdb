const express = require("express");
const router = express.Router();
const Server = require("../../config/Server");

async function updatePost(req,res,next) {

	const { id, rev, msg } = req.body;

	if (typeof(id) !== "string" || id === undefined) {
			res.status(400).json({
				"info" : "Invalid Request body or parameters",
				"internal_error_code" : "UP0"
			});
			return;
		}

	if (typeof(rev) !== "string" || id === undefined) {
		res.status(400).json({
			"info" : "Invalid Request body or parameters",
			"internal_error_code" : "UP0"
		});
		return;
	}

	if (typeof(msg) !== "string" || msg === undefined) {
		res.status(400).json({
			"info" : "Invalid Request body or parameters",
			"internal_error_code" : "UP0"
		});
		return;
	}


	try {

		const db = new Server(process.env.DB,process.env.CREDENTIALS);

		const data = await db.updateMsg(msg, id, rev);

		res.status(data.status_code).json(data);

	} catch(e) {
		console.error(e);
		res.status(500).json(
		{
			"info" : "something broke",
			"internal_error_code" : "UP01"
		});
	}
}

router.put("/update_post", updatePost);
module.exports=router;