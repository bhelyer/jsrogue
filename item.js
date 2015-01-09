var ItemAttrs = {
	oaken_heart: { c:";", name:MSG_OAKEN_HEART },
	potion: { c:"!", name:MSG_POTION }
}

function itemNoUse(creature) {
	Log.add(MSG_CANNOT_USE);
	return false;  // Do not consume the item.
}

function itemPotion(creature) {
	creature.hp += 20;
	if (creature.hp >= creature.maxHp) {
		creature.hp = creature.maxHp;
	}
	if (creature === Game.player) {
		Log.add(MSG_GULP);
	}
	return true;  // Consume the item.
}

function Item(id) {
	if (ItemAttrs[id] === undefined) {
		throw new Error("Item(): Unknown item id: " + id);
	}
	this.id = id;
	this.name = ItemAttrs[id].name;
	switch (id) {
	case "oaken_heart": this.use = itemNoUse; break;
	case "potion": this.use = itemPotion; break;
	default: throw new Error("Item(): unknown item");
	}
}
