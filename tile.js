/*
 * Attributes of tiles that don't change.
 * Colours are handled in the CSS.
 */
var TileAttrs = {
	floor: { walkable:true, transparent: true, c: "." },
	wall: { walkable:false, transparent: false, c: "#" },
	stairsup: { walkable:true, transparent: true, c: "<" }
}

function Tile(tilename, x, y) {
	this.tilename = tilename;
	this.creature = null;
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
