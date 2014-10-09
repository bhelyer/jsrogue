/*
 * The message log displays battle messages and the like.
 */

var Log = {
	display_height:10,  // How many messages to show in the log at once.
	messages:[]
}

Log.draw = function() {
	str = "<div class=\"log\">"
	for (var i = Log.messages.length - (Log.display_height + 1); i < Log.messages.length; i++) {
		if (i < 0) {
			str += "<br>";
		} else {
			str += MessageStrings.get(Log.messages[i]) + "<br>";
		}
	}
	document.getElementById("content").innerHTML += str;
}

Log.add = function(msg) {
	Log.messages.push(msg);
}
