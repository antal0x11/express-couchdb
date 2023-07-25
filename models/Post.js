
/*

	Post -> {
				username : string,
				first_name : string,
				last_name : string,
				date : string,
				msg : string,
				valid_post : boolean	
			}
*/


function Post(props) {
	const { username, first_name, last_name, date, msg} = props;

	if (username === null || first_name === null || last_name === null || msg === null) {
		this.valid_post = false;
	} else {
		this.valid_post = true;
	}

	this.username = username;
	this.first_name = first_name;
	this.last_name = last_name;
	this.date = date;
	this.msg = msg;
}

module.exports = Post;