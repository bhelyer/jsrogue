var ItemAttrs = {
	oaken_heart: { c:";", name:MSG_OAKEN_HEART, true_name:MSG_OAKEN_HEART, cname:"oaken_heart" },
	healing_potion: { c:"!", name:MSG_NONE, true_name:MSG_HEALING_POTION, cname:"" },
	poison_potion: { c:"!", name:MSG_NONE, true_name:MSG_POISON_POTION, cname:"" }
};

function randomPotion() {
	var potions = ["healing_potion", "poison_potion"];
	return potions[getRandomInt(0, potions.length)];
}

function identifyItem(id) {
	ItemAttrs[id].name = ItemAttrs[id].true_name;
}

function initItems() {
	var healthColour = randomColour();
	ItemAttrs.healing_potion.name = healthColour.msg;
	ItemAttrs.healing_potion.cname = healthColour.str;
	var poisonColour = randomColour();
	ItemAttrs.poison_potion.name = poisonColour.msg;
	ItemAttrs.poison_potion.cname = poisonColour.str;
}

var Colours = [
	{ id:0, str:"green_potion", msg:MSG_GREEN_POTION },
	{ id:1, str:"red_potion", msg:MSG_RED_POTION },
	{ id:2, str:"blue_potion", msg:MSG_BLUE_POTION },
	{ id:3, str:"purple_potion", msg:MSG_PURPLE_POTION },
	{ id:4, str:"yellow_potion", msg:MSG_YELLOW_POTION }
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

function itemHealingPotion(creature) {
	var originalHP = creature.hp;
	creature.hp += 20;
	if (creature.hp >= creature.maxHp) {
		creature.hp = creature.maxHp;
	}
	if (creature === Game.player) {
		Log.add(MSG_GULP);
	}
	if (originalHP < creature.hp) {
		identifyItem(this.id);
	}
	return true;  // Consume the item.
}

function itemPoisonPotion(creature) {
	creature.hp -= 15;
	if (creature === Game.player) {
		Log.add(MSG_GULP);
	}
	creature.dieIfNeeded();
	identifyItem(this.id);
	return true;
}

function Item(id) {
	if (ItemAttrs[id] === undefined) {
		throw new Error("Item(): Unknown item id: " + id);
	}
	this.id = id;
	this.name = ItemAttrs[id].name;
	this.cname = ItemAttrs[id].cname;
	switch (id) {
	case "oaken_heart": this.use = itemNoUse; break;
	case "healing_potion": this.use = itemHealingPotion; break;
	case "poison_potion": this.use = itemPoisonPotion; break;
	default: throw new Error("Item(): unknown item");
	}
}
