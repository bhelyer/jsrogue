var ItemAttrs = {
	oaken_heart: { c:";", name:MSG_OAKEN_HEART, true_name:MSG_OAKEN_HEART, cname:"oaken_heart", use:itemNoUse },
	healing_potion: { c:"!", name:MSG_NONE, true_name:MSG_HEALING_POTION, cname:"", use:itemHealingPotion },
	poison_potion: { c:"!", name:MSG_NONE, true_name:MSG_POISON_POTION, cname:"", use:itemPoisonPotion },
	strength_boost_potion: { c:"!", name:MSG_NONE, true_name:MSG_STR_BOOST_POTION, cname:"", use:itemStrBoost },
	defence_boost_potion: { c:"!", name:MSG_NONE, true_name:MSG_DEF_BOOST_POTION, cname:"", use:itemDefBoost },
	hp_boost_potion: { c:"!", name:MSG_NONE, true_name:MSG_HP_BOOST_POTION, cname:"", use:itemHpBoost },
	strength_abuse_potion: { c:"!", name:MSG_NONE, true_name:MSG_STR_ABUSE_POTION, cname:"", use:itemStrAbuse },
	defence_abuse_potion: { c:"!", name:MSG_NONE, true_name:MSG_DEF_ABUSE_POTION, cname:"", use:itemDefAbuse },
	hp_abuse_potion: { c:"!", name:MSG_NONE, true_name:MSG_HP_ABUSE_POTION, cname:"", use:itemHpAbuse }
};

var Potions = [
"healing_potion",
"poison_potion",
"strength_boost_potion",
"defence_boost_potion",
"hp_boost_potion",
"strength_abuse_potion",
"defence_abuse_potion",
"hp_abuse_potion"
];

function randomPotion() {
	return Potions[getRandomInt(0, Potions.length)];
}

function identifyItem(id) {
	ItemAttrs[id].name = ItemAttrs[id].true_name;
}

function initItems() {
	function randomise(id) {
		var colour = randomColour();
		ItemAttrs[id].name = colour.msg;
		ItemAttrs[id].cname = colour.str;
	}
	for (var i = 0, len = Potions.length; i < len; ++i) {
		randomise(Potions[i]);
	}
}

var Colours = [
	{ id:0, str:"green_potion", msg:MSG_GREEN_POTION },
	{ id:1, str:"red_potion", msg:MSG_RED_POTION },
	{ id:2, str:"blue_potion", msg:MSG_BLUE_POTION },
	{ id:3, str:"purple_potion", msg:MSG_PURPLE_POTION },
	{ id:4, str:"yellow_potion", msg:MSG_YELLOW_POTION },
	{ id:5, str:"orange_potion", msg:MSG_ORANGE_POTION },
	{ id:6, str:"pink_potion", msg:MSG_PINK_POTION },
	{ id:7, str:"white_potion", msg:MSG_WHITE_POTION },
	{ id:8, str:"black_potion", msg:MSG_BLACK_POTION },
	{ id:9, str:"brown_potion", msg:MSG_BROWN_POTION }
];

function randomColour() {
	var colour = Colours[getRandomInt(0, Colours.length)];
	Colours.splice(colour.id, 1);
	return colour;
}

function itemNoUse(creature) {
	Log.add(MSG_CANNOT_USE);
	return false;  // Do not consume the item.
}

function gulp(creature) {
	if (creature === Game.player) {
		Log.add(MSG_GULP);
	}
}

function itemHealingPotion(creature) {
	var originalHP = creature.hp;
	creature.hp += 20;
	if (creature.hp >= creature.maxHp) {
		creature.hp = creature.maxHp;
	}
	gulp(creature);
	if (originalHP < creature.hp) {
		identifyItem(this.id);
	}
	return true;  // Consume the item.
}

function itemPoisonPotion(creature) {
	creature.hp -= 15;
	gulp(creature);
	creature.dieIfNeeded();
	identifyItem(this.id);
	return true;
}

function itemModify(id, creature, property, val) {
	creature[property] += val;
	gulp(creature);
	identifyItem(id);
	return true;
}

function itemStrBoost(creature) {
	return itemModify(this.id, creature, "str", 1);
}

function itemDefBoost(creature) {
	return itemModify(this.id, creature, "def", 1);
}

function itemHpBoost(creature) {
	return itemModify(this.id, creature, "maxHp", 3);
}

function itemStrAbuse(creature) {
	return itemModify(this.id, creature, "str", -1);
}

function itemDefAbuse(creature) {
	return itemModify(this.id, creature, "def", -1);
}

function itemHpAbuse(creature) {
	return itemModify(this.id, creature, "maxHp", -3);
}

function Item(id) {
	if (ItemAttrs[id] === undefined) {
		throw new Error("Item(): Unknown item id: " + id);
	}
	this.id = id;
	this.name = ItemAttrs[id].name;
	this.cname = ItemAttrs[id].cname;
	this.use = ItemAttrs[id].use;
}

