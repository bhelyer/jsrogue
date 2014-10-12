var MSG_NO_WALK  = 0;
var MSG_LANGUAGE = 1;
var MSG_CURRENTLANGUAGE = 2;
var MSG_RETURNTOINDEX = 3;
var MSG_OPPOSITELANGUAGE = 4;

var MessageLanguage = {
	ENGLISH:0,
	JAPANESE:1
}

var MessageStrings = {
	language:MessageLanguage.ENGLISH
}

MessageStrings.toggleLanguage = function() {
	if (this.language === MessageLanguage.ENGLISH) {
		this.language = MessageLanguage.JAPANESE;
	} else {
		this.language = MessageLanguage.ENGLISH;
	}
}

MessageStrings.drawOptions = function() {
	document.getElementById("langbutton").innerHTML = this.get(MSG_OPPOSITELANGUAGE);
	document.getElementById("return").innerHTML = this.get(MSG_RETURNTOINDEX);
}

MessageStrings.get = function(id) {
	var l = this.language;
	var e = MessageLanguage.ENGLISH;
	var j = MessageLanguage.JAPANESE;
	switch (id) {
	case MSG_NO_WALK: return ((l == e) ? "You cannot walk there." : "あなたはそこに歩けない。");
	case MSG_LANGUAGE: return (l == e) ? "Language" : "言語";
	case MSG_CURRENTLANGUAGE: return (l == j) ? "日本語" : "English";
	case MSG_OPPOSITELANGUAGE: return (l == j) ? "English" : "日本語";
	case MSG_RETURNTOINDEX: return (l == e) ? "Return to index." : "インデックスへ戻る。";
	}
}

MessageStrings.getStatus = function(floor) {
	switch (this.language) {
	case MessageLanguage.ENGLISH:  return '<span class="unit">Floor</span>: ' + ((floor == 0) ? "G" : floor);
	case MessageLanguage.JAPANESE: return (floor + 1) + '<span class="unit">階</span>';
	}
}
