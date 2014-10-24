// Return a random integer in the range min .. max.
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

/*
 * Call fn(x, y) for every point in (x0, y0) to (x1, y1).
 * If fn returns false, no more calls will be made.
 */
function line(x0, y0, x1, y1, fn) {
	var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
	var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
	var err = (dx > dy ? dx : -dy) / 2;

	while (fn(x0, y0)) {
		if (x0 === x1 && y0 === y1) {
			break;
		}
		var e2 = err;
		if (e2 > -dx) {
			err -= dy;
			x0 += sx;
		}
		if (e2 < dy) {
			err += dx;
			y0 += sy;
		}
	}
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
