function simpleDungeonGenerator() {
	this.tiles = new Array(this.width * this.height);
	for (var y = 0; y < this.height; y++) {
		for (var x = 0; x < this.width; x++) {
			this.tiles[y * this.width + x] = new Tile("floor", x, y);
		}
	}
}

function dungeonDraw() {
	var s = "<div class=\"dungeon\">";
	var lastname = "";
	for (var y = 0; y < this.height; y++) {
		// So we can roll the </span> into every opening without outputting garbage HTML.
		s += "<span class\"rowstart\">";
		for (var x = 0; x < this.width; x++) {
			var tile = this.tiles[y * this.width + x];
			if (tile.creature === null) {
				var tname = tile.tilename;
				if (lastname === "" || lastname != tname) {
					s += "</span><span class=\"" + tname + "\">";
					lastname = tname;
				}
				s += TileAttrs[tname].c;
			} else {
				var cname = tile.creature.creaturename;
				if (lastname === "" || lastname != cname) {
					s += "</span><span class=\"" + cname + "\">";
					lastname = cname;
				}
				s += CreatureAttrs[cname].c;
			}
		}
		s += "</span><br>";
		lastname = "";
	}
	document.getElementById("content").innerHTML += s;
}

function dungeonTileAt(x, y) {
	return this.tiles[y * this.width + x];
}

function DungeonFloor(width, height, generator) {
	this.width = width;
	this.height = height;

	// Methods.
	this.generate = generator;
	this.draw = dungeonDraw;
	this.tileAt = dungeonTileAt;

	this.generate();
}
