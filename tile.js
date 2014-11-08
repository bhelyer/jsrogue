/*
 * Attributes of tiles that don't change.
 * Colours are handled in the CSS.
 */
var TileAttrs = {
	floor: { walkable:true, transparent: true, c: "." },
	wall: { walkable:false, transparent: false, c: "#" },
	stairsup: { walkable:true, transparent: true, c: "<" }
}

function Tile(id, x, y) {
	this.id = id;
	this.creature = null;
	this.items = new Array();
	this.x = x;
	this.y = y;
}

function addCreature(dungeon, tile, creature) {
	dungeon.creatures.push(creature);
	tile.creature = creature;
	creature.x = tile.x;
	creature.y = tile.y;
	creature.dungeon = dungeon;
}
