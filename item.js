var ItemAttrs = {
	oaken_heart: { c:";", name:MSG_OAKEN_HEART }
}

function itemNoUse(creature) {
	Log.add(MSG_CANNOT_USE);
	return false;  // Do not consume the item.
}

function Item(id) {
	if (ItemAttrs[id] === undefined) {
		throw new Error("Item(): Unknown item id: " + id);
	}
	this.id = id;
	this.name = ItemAttrs[id].name;
	switch (id) {
	case "oaken_heart": this.use = itemNoUse; break;
	default: throw new Error("Item(): unknown item");
	}
}
