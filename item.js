var ItemAttrs = {
	oaken_heart: { c:";", name:MSG_OAKEN_HEART }
}

function Item(id) {
	if (ItemAttrs[id] === undefined) {
		throw new Error("Item(): Unknown item id: " + id);
	}
	this.id = id;
}
