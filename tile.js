/*
 * Attributes of tiles that don't change.
 * Colours are handled in the CSS.
 */
var TileAttrs = {
	floor: { walkable:true, transparent: true, c: "." },
	wall: { walkable:false, transparent: false, c: "#" }
}

function Tile(tilename, x, y) {
	this.tilename = tilename;
	this.creature = null;
	this.x = x;
	this.y = y;
}
