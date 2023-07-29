const express = require("express");
const router = express.Router();
const Server = require("../../config/Server");

async function deletePost(req,res,next) {

	const db = new Server(process.env.DB,process.env.CREDENTIALS);

	try {

		const { id, rev } = req.query;

		if (typeof(id) !== "string" || id === undefined) {
			res.status(400).json({
				"info" : "Invalid Request body or parameters",
				"internal_error_code" : "DEL0"
			});
			return;
		}

		if (typeof(rev) !== "string" || id === undefined) {
			res.status(400).json({
				"info" : "Invalid Request body or parameters",
				"internal_error_code" : "DEL0"
			});
			return;
		}

		const data = await db.deletePost(id, rev);

		if (data.status_code === 200 || data.status_code === 202) {
			res.status(200).json(data);
		} else {

			switch(data.status_code) {
			
				case 400: 
					res.status(400).json({
						"info" : "Invalid Request body or parameters",
						"internal_error_code" : "DEL02"
					});
				break;

				case 401:
					res.status(401).json({
						"info" : "Write privileges required",
						"internal_error_code" : "DEL02"
					});
				break;

				case 404:
					res.status(404).json({
						"info" : "Specified Document ID does not exist",
						"internal_error_code" : "DEL02"
					});
				break;

				case 409:
					res.status(409).json({
						"info" : "Specified revision is not the latest for target document.",
						"internal_error_code" : "DEL02"
					});
				break;

			}
		}



	} catch(e) {
		console.error(e);
		res.status(500).json(
		{
			"info" : "something broke",
			"internal_error_code" : "DEL01" 
		});
	}

}

router.delete("/delete_post", deletePost);
module.exports = router;