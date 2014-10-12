// Return a random integer in the range min .. max.
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

// Get parameters from the URL. Taken from StackOverflow, naturally.
function getQueryParams(qs) {
	qs = qs.split("+").join(" ");

	var params = {}, tokens,
		re = /[?&]?([^=]+)=([^&]*)/g;

	while (tokens = re.exec(qs)) {
		params[decodeURIComponent(tokens[1])]
			= decodeURIComponent(tokens[2]);
	}

	return params;
}
