/*
 * The message log displays battle messages and the like.
 */

var Log = {
	display_height:10,  // How many messages to show in the log at once.
	messages:[]
}

Log.draw = function() {
	var str = "<div class=\"log\">"
	for (var i = Log.messages.length - (Log.display_height + 1); i < Log.messages.length; i++) {
		var last = i === Log.messages.length - 1;
		if (last) {
			str += "<span class=\"mostrecentlog\">";
		}
		if (i < 0) {
			str += "<br>";
		} else {
			str += MessageStrings.get(Log.messages[i]) + "<br>";
		}
		if (last) {
			str += "</span>";
		}
	}
	document.getElementById("log").innerHTML = str;
}

Log.add = function(msg) {
	Log.messages.push(msg);
}
