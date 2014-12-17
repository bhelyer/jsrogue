var MSG_NONE = -1;
var MSG_NO_WALK  = 0;
var MSG_LANGUAGE = 1;
var MSG_CURRENTLANGUAGE = 2;
var MSG_RETURNTOINDEX = 3;
var MSG_OPPOSITELANGUAGE = 4;
var MSG_FAIL_DOGROUND = 5;
var MSG_CLIMB = 6;
var MSG_INTRO = 7;
var MSG_SEEKERDESC = 8;
var MSG_PLAYERDESC = 9;
var MSG_A_MOANS = 10;
var MSG_SEEKER = 11;
var MSG_FLOOR = 12;
var MSG_HP = 13;
var MSG_STR = 14;
var MSG_DEF = 15;
var MSG_A_ATTACKS_B = 16;
var MSG_YOU = 17;
var MSG_A_RECEIVES_B_DMG = 18;
var MSG_A_DODGES = 19;
var MSG_A_DIES = 20;
var MSG_OAKEN_HEART = 21;
var MSG_A_IS_HERE = 22;  // Inanimate.
var MSG_A_PICKS_UP_B = 23;
var MSG_EMPTY = 24;
var MSG_CHOOSE_ITEM = 25;
var MSG_LETTER_PLEASE = 26;
var MSG_NO_ITEM = 27;
var MSG_CANNOT_USE = 28;
var MSG_WIN = 29;

var MessageLanguage = {
	ENGLISH:0,
	JAPANESE:1
}

var MessageStrings = {
	language:MessageLanguage.ENGLISH
}

var E_INTRO =
"\
<p>'Endless Tower', scholars are quick to point out, is a crude rendering \
from the Seekers' long dead language. \
A better translation, they say, would be 'Tower to the Endless'. \
</p><p>\
Nevertheless, no one has ever reached the top.</p>\
";
var J_INTRO =
"\
<p>「シーカーの古い死語から『エンドレスなタワー』は雑な翻訳だよ」と学者が早く言います。\
より良い翻訳は、「終焉へのタワー」だというのです。\
</p><p>\
しかし、誰一人タワーの頂上に到達した者はいません。</p>\
";

var E_SEEKER =
"\
<p>Robed in white, face shrouded. It shuffles towards you. \
This is a Seeker. Like you they sought answers. Now they are \
mere thralls to the tower, and see you as an infection to be purged.</p>\
";
var J_SEEKER =
"\
<p>顔まで覆われたローブを着た人が近づいてきりました。\
これはシーカーです。あなたごとき、答えを探しました。\
今タワーに捕らわれます。シーカーが感染とする。</p>\
";

MessageStrings.toggleLanguage = function() {
	if (this.language === MessageLanguage.ENGLISH) {
		this.language = MessageLanguage.JAPANESE;
	} else {
		this.language = MessageLanguage.ENGLISH;
	}
	Game.draw();
}

MessageStrings.drawOptions = function() {
	document.getElementById("langbutton").innerHTML = this.get(MSG_OPPOSITELANGUAGE);
	document.getElementById("return").innerHTML = this.get(MSG_RETURNTOINDEX);
}

MessageStrings.get = function(id, a, b) {
	var l = this.language;
	var e = MessageLanguage.ENGLISH;
	var j = MessageLanguage.JAPANESE;
	function verb(s, ch) {
		if (typeof(ch) === "undefined") {
			ch = " ";
		}
		return " " + s + (a === MSG_YOU ? ch : "s" + ch);
	}
	function an(s) {
		if (s[0] === "a" || s[0] === "e" || s[0] === "i" || s[0] === "o" || s[0] == "u") {
			return "an " + s;
		} else {
			return "a " + s;
		}
	}
	function span(str, className) {
		return "<span class=\"" + className + "\">" + str + "</span>";
	}
	switch (id) {
	case MSG_NONE: throw new Error("MessageStrings.get: Tried to retrieve MSG_NONE.");
	case MSG_NO_WALK: return ((l == e) ? "You cannot walk there." : "あなたはそこに歩けない。");
	case MSG_LANGUAGE: return (l == e) ? "Language" : "言語";
	case MSG_CURRENTLANGUAGE: return (l == j) ? "日本語" : "English";
	case MSG_OPPOSITELANGUAGE: return (l == j) ? "English" : "日本語";
	case MSG_RETURNTOINDEX: return (l == e) ? "Return to index." : "インデックスへ戻る。";
	case MSG_FAIL_DOGROUND: return (l == e) ? "There's nothing here." : "ここにない。";
	case MSG_CLIMB: return (l == e) ? "You climb the stairs." : "あなたは階段に上る。"
	case MSG_INTRO: return (l == e) ? E_INTRO : J_INTRO;
	case MSG_SEEKERDESC: return (l == e) ? E_SEEKER : J_SEEKER;
	case MSG_PLAYERDESC: return (l == e) ? "Who are you?" : "あなたは誰ですか？";
	case MSG_A_MOANS: return (l == e) ? cap(this.get(a)) + " moans." : this.get(a) + "が唸る。";
	case MSG_SEEKER: return (l == e) ? "the Seeker" : "シーカー";
	case MSG_FLOOR: return (l == e) ? "Floor" : "階段";
	case MSG_HP: return (l == e) ? "Vitality" : "体力";
	case MSG_STR: return (l == e) ? "Strength" : "筋力";
	case MSG_DEF: return (l == e) ? "Defence" : "防御力";
	case MSG_A_ATTACKS_B: return (l == e) ? cap(this.get(a)) + verb("attack") + this.get(b) + "." : this.get(a) + "が" + this.get(b) + "を攻撃する。"
	case MSG_YOU: return (l == e) ? "you" : "あなた";
	case MSG_A_RECEIVES_B_DMG:
		var dmg = span(b, (a === MSG_YOU) ? "playerdmg" : "enemydmg");
		return (l == e) ?
			cap(this.get(a)) + verb("receive") + dmg + " damage." :
			this.get(a) + "が" + dmg + "のダメージを受ける。";
	case MSG_A_DODGES: return (l == e) ? "But " + this.get(a) + verb("dodge", ".") : "でも、" + this.get(a) + "がかわす。";
	case MSG_A_DIES: return (a == MSG_YOU ? '<span id="playerdeath">' : '<span>') + ((l == e) ? cap(this.get(a)) + verb("die", ".") :　this.get(a) + "が死ぬ。") + "</span>";
	case MSG_OAKEN_HEART: return (l == e) ? "oaken heart" : "オークの心臓";
	case MSG_A_IS_HERE: return (l == e) ? (cap(an(this.get(a))) + " is here.") : this.get(a) + "がここにある。";
	case MSG_A_PICKS_UP_B: return (l == e) ? cap(this.get(a)) + " " + verb("pick") + " up " + an(this.get(b)) + "." : this.get(a) + "は" + this.get(b) + "を拾う。";
	case MSG_EMPTY: return (l == e) ? "The inventory is empty." : "インベントリが空だよ。";
	case MSG_CHOOSE_ITEM: return (l === e) ? "Choose an item: " : "アイテムを選んでください：　";
	case MSG_LETTER_PLEASE: return (l === e) ? "Please enter a letter." : "英文字を入力してください。";
	case MSG_NO_ITEM: return (l === e) ? "No item with that letter." : "その文字はアイテムが無い。";
	case MSG_CANNOT_USE: return (l === e) ? "Cannot use that." : "使わない。";
	case MSG_WIN: return (l === e) ? "Victory!" : "勝ち！"
	}
}

MessageStrings.getStatus = function(floor, p) {
	var l = this.language;
	function getFloor() {
		if (l === MessageLanguage.JAPANESE) {
			return floor + 1;
		} else {
			if (floor === 0) {
				return "G";
			} else {
				return floor;
			}
		}
	}
	return '<span class="unit">' + this.get(MSG_FLOOR) + '</span>:' + getFloor() +
			' <span class="unit">' + this.get(MSG_HP) + '</span>:' + p.hp + "/" + p.maxHp +
			' <span class="unit">' + this.get(MSG_STR) + '</span>:' + p.str +
			' <span class="unit">' + this.get(MSG_DEF) + '</span>:' + p.def;
	var t = this;
}
