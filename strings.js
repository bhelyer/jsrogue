var MSG_NO_WALK  = 0;
var MSG_LANGUAGE = 1;
var MSG_CURRENTLANGUAGE = 2;
var MSG_RETURNTOINDEX = 3;

var MessageLanguage = {
	ENGLISH:0,
	JAPANESE:1
}

var MessageStrings = {
	language:MessageLanguage.ENGLISH
}

MessageStrings.toggleLanguage = function() {
	var oldLanguage = this.get(MSG_CURRENTLANGUAGE);
	if (this.language === MessageLanguage.ENGLISH) {
		this.language = MessageLanguage.JAPANESE;
	} else {
		this.language = MessageLanguage.ENGLISH;
	}
	document.getElementById("langbutton").innerHTML = oldLanguage;
	document.getElementById("return").innerHTML = this.get(MSG_RETURNTOINDEX);
}

MessageStrings.get = function(id) {
	switch (id) {
	case MSG_NO_WALK: return this.cannotWalkMsg();
	case MSG_LANGUAGE: return this.languageMsg();
	case MSG_CURRENTLANGUAGE: return this.currentLanguageMsg();
	case MSG_RETURNTOINDEX: return this.returnToIndexMsg();
	}
}

MessageStrings.currentLanguageMsg = function() {
	switch (this.language) {
	case MessageLanguage.ENGLISH:  return "English";
	case MessageLanguage.JAPANESE: return "日本語";
	}
}

MessageStrings.languageMsg = function() {
	switch (this.language) {
	case MessageLanguage.ENGLISH:  return "Language";
	case MessageLanguage.JAPANESE: return "言語";
	}
}

MessageStrings.cannotWalkMsg = function() {
	switch (this.language) {
	case MessageLanguage.ENGLISH:  return "You cannot walk there.";
	case MessageLanguage.JAPANESE: return "あなたはそこに歩けない。";
	}
}

MessageStrings.returnToIndexMsg = function() {
	switch (this.language) {
	case MessageLanguage.ENGLISH:  return "Return to index.";
	case MessageLanguage.JAPANESE: return "インデックスへ戻る。";
	}
}
