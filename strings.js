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
var MSG_GULP = 30;
var MSG_GREEN_POTION = 31;
var MSG_RED_POTION = 32;
var MSG_BLUE_POTION = 33;
var MSG_PURPLE_POTION = 34;
var MSG_YELLOW_POTION = 35;
var MSG_ORANGE_POTION = 36;
var MSG_PINK_POTION = 37;
var MSG_WHITE_POTION = 38;
var MSG_BLACK_POTION = 39;
var MSG_BROWN_POTION = 40;
var MSG_HEALING_POTION = 46;
var MSG_POISON_POTION = 47;
var MSG_STR_BOOST_POTION = 48;
var MSG_DEF_BOOST_POTION = 49;
var MSG_HP_BOOST_POTION = 50;
var MSG_STR_ABUSE_POTION = 51;
var MSG_DEF_ABUSE_POTION = 52;
var MSG_HP_ABUSE_POTION = 53;

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
Nevertheless, no one has ever reached the top.</p><p>\
Click on things to look at them.</p>\
";
var J_INTRO =
"\
<p>「シーカーの古い死語から『エンドレスなタワー』は雑な翻訳だよ」と学者が早く言います。\
より良い翻訳は、「終焉へのタワー」だというのです。\
</p><p>\
しかし、誰一人タワーの頂上に到達した者はいません。</p><p>\
クリックすると説明が出ます。</p>\
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
	var e = this.language === MessageLanguage.ENGLISH;
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
	case MSG_NO_WALK: return (e ? "You cannot walk there." : "あなたはそこに歩けない。");
	case MSG_LANGUAGE: return e ? "Language" : "言語";
	case MSG_CURRENTLANGUAGE: return !e ? "日本語" : "English";
	case MSG_OPPOSITELANGUAGE: return !e ? "English" : "日本語";
	case MSG_RETURNTOINDEX: return e ? "Return to index." : "インデックスへ戻る。";
	case MSG_FAIL_DOGROUND: return e ? "There's nothing here." : "ここにない。";
	case MSG_CLIMB: return e ? "You climb the stairs." : "あなたは階段に上る。"
	case MSG_INTRO: return e ? E_INTRO : J_INTRO;
	case MSG_SEEKERDESC: return e ? E_SEEKER : J_SEEKER;
	case MSG_PLAYERDESC: return e ? "Who are you?" : "あなたは誰ですか？";
	case MSG_A_MOANS: return e ? cap(this.get(a)) + " moans." : this.get(a) + "が唸る。";
	case MSG_SEEKER: return e ? "the Seeker" : "シーカー";
	case MSG_FLOOR: return e ? "Floor" : "階段";
	case MSG_HP: return e ? "Vitality" : "体力";
	case MSG_STR: return e ? "Strength" : "筋力";
	case MSG_DEF: return e ? "Defence" : "防御力";
	case MSG_A_ATTACKS_B: return e ? cap(this.get(a)) + verb("attack") + this.get(b) + "." : this.get(a) + "が" + this.get(b) + "を攻撃する。"
	case MSG_YOU: return e ? "you" : "あなた";
	case MSG_A_RECEIVES_B_DMG:
		var dmg = span(b, (a === MSG_YOU) ? "playerdmg" : "enemydmg");
		return e ?
			cap(this.get(a)) + verb("receive") + dmg + " damage." :
			this.get(a) + "が" + dmg + "のダメージを受ける。";
	case MSG_A_DODGES: return e ? "But " + this.get(a) + verb("dodge", ".") : "でも、" + this.get(a) + "がかわす。";
	case MSG_A_DIES: return (a == MSG_YOU ? '<span id="playerdeath">' : '<span>') + (e ? cap(this.get(a)) + verb("die", ".") :　this.get(a) + "が死ぬ。") + "</span>";
	case MSG_OAKEN_HEART: return e ? "oaken heart" : "オークの心臓";
	case MSG_A_IS_HERE: return e ? (cap(an(this.get(a))) + " is here.") : this.get(a) + "がここにある。";
	case MSG_A_PICKS_UP_B: return e ? cap(this.get(a)) + " " + verb("pick") + " up " + an(this.get(b)) + "." : this.get(a) + "は" + this.get(b) + "を拾う。";
	case MSG_EMPTY: return e ? "The inventory is empty." : "インベントリが空だよ。";
	case MSG_CHOOSE_ITEM: return e ? "Choose an item: " : "アイテムを選んでください：　";
	case MSG_LETTER_PLEASE: return e ? "Please enter a letter." : "英文字を入力してください。";
	case MSG_NO_ITEM: return e ? "No item with that letter." : "その文字はアイテムが無い。";
	case MSG_CANNOT_USE: return e ? "Cannot use that." : "使わない。";
	case MSG_WIN: return e ? "Victory!" : "勝ち！";
	case MSG_GULP: return e ? "Gulp!" : "ごくごく！";
	case MSG_GREEN_POTION: return e ? "green potion" : "緑のポーション";
	case MSG_RED_POTION: return e ? "red potion" : "赤いポーション";
	case MSG_BLUE_POTION: return e ? "blue potion" : "青いポーション";
	case MSG_PURPLE_POTION: return e ? "purple potion" : "紫のポーション";
	case MSG_YELLOW_POTION: return e ? "yellow potion" : "黄色いポーション";
	case MSG_ORANGE_POTION: return e ? "orange potion" : "オレンジのポーション";
	case MSG_PINK_POTION: return e ? "pink potion" : "ピンクのポーション";
	case MSG_WHITE_POTION: return e ? "white potion" : "白いポーション";
	case MSG_BLACK_POTION: return e ? "black potion" : "黒いポーション";
	case MSG_BROWN_POTION: return e ? "brown potion" : "茶色のポーション";
	case MSG_HEALING_POTION: return e ? "healing potion" : "治癒のポーション";
	case MSG_POISON_POTION: return e ? "poison potion" : "毒のポーション";
	case MSG_STR_BOOST_POTION: return e ? "strength boost potion" : "筋力+のポーション";
	case MSG_DEF_BOOST_POTION: return e ? "defence boost potion" : "防御力+のポーション";
	case MSG_HP_BOOST_POTION: return e ? "hp boost potion" : "体力+のポーション";
	case MSG_STR_ABUSE_POTION: return e ? "strength abuse potion" : "筋力-のポーション";
	case MSG_DEF_ABUSE_POTION: return e ? "defence abuse potion" : "防御力-のポーション";
	case MSG_HP_ABUSE_POTION: return e ? "hp abuse potion" : "体力-のポーション";
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
