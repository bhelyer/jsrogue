function simpleDungeonGenerator() {
	this.fill("wall");

	var midx = Math.floor(this.width / 2);
	var midy = Math.floor(this.height / 2);

	var x1 = getRandomInt(midx - 8, midx + 5);
	var x2 = getRandomInt(x1 + 3, x1 + 8);
	var y1 = getRandomInt(midy - 3, midy + 3);
	var y2 = getRandomInt(y1 + 3, y1 + 6);
	this.digRoom(x1, y1, x2, y2, "floor");

	var rx, ry;
	var d = this;
	function randomSpot() {
		rx = getRandomInt(1, d.width - 1);
		ry = getRandomInt(1, d.height - 1);
	}
	function randomSpotUntil(dg) {
		do {
			randomSpot();
		} while (!dg(rx, ry));
	}
	function wallAdjacentToFloor(x, y) {
		var tile = d.tileAt(x, y);
		if (tile.id != "wall") {
			return false;
		}
		var left = d.tileAt(x - 1, y);
		var right = d.tileAt(x + 1, y);
		var top = d.tileAt(x, y - 1);
		var bottom = d.tileAt(x, y + 1);
		return (left && left.id === "floor") || (right && right.id === "floor") || (top && top.id === "floor") || (bottom && bottom.id === "floor");
	}
	// Dig a simple corridor.
	function digCorridor() {
		randomSpotUntil(wallAdjacentToFloor);
		var directions = new Array(4);
		directions[0] = d.tileAt(rx - 1, ry);
		directions[1] = d.tileAt(rx + 1, ry);
		directions[2] = d.tileAt(rx, ry - 1);
		directions[3] = d.tileAt(rx, ry + 1);
		var length = getRandomInt(6, 12);
		DIRECTIONS: for (var i = 0, len = directions.length; i < len; i++) {
			var t = directions[i];
			var lengthToGo = length;
			while (lengthToGo > 0) {
				function outOfBounds(tile) {
					return t.x <= 0 || t.x >= d.width || t.y <= 0 || t.y >= d.height;
				}
				if (!t || t.id != "wall" || outOfBounds(t)) {
					break;
				}
				switch (i) {
				case 0: 
					var a = d.tileAt(t.x, t.y - 1);
					var b = d.tileAt(t.x, t.y + 1);
					if ((!a || a.id == "floor") || (!b || b.id == "floor")) {
						break DIRECTIONS;
					}
					t = d.tileAt(t.x - 1, t.y); 
					break;
				case 1:
					var a = d.tileAt(t.x, t.y - 1);
					var b = d.tileAt(t.x, t.y + 1);
					if ((!a || a.id == "floor") || (!b || b.id == "floor")) {
						break DIRECTIONS;
					}
					t = d.tileAt(t.x + 1, t.y);
					break;
				case 2:
					var a = d.tileAt(t.x - 1, t.y);
					var b = d.tileAt(t.x + 1, t.y);
					if ((!a || a.id == "floor") || (!b || b.id == "floor")) {
						break DIRECTIONS;
					}
					t = d.tileAt(t.x, t.y - 1);
					break;
				case 3:
					var a = d.tileAt(t.x - 1, t.y);
					var b = d.tileAt(t.x + 1, t.y);
					if ((!a || a.id == "floor") || (!b || b.id == "floor")) {
						break DIRECTIONS;
					}
					t = d.tileAt(t.x, t.y + 1);
					break;
				}
				lengthToGo--;
			}
			if (lengthToGo == 0) {
				// Room to dig, so do it.
				lengthToGo = length;
				while (lengthToGo > 0) {
					d.tiles[ry * d.width + rx].id = "floor";
					switch (i) {
					case 0:	rx--; break;
					case 1: rx++; break;
					case 2: ry--; break;
					case 3: ry++; break;
					}
					lengthToGo--;
				}
				return 1;
			}
		}
		return 0;
	}
	// Dig a simple room.
	function spaceForRoom(x1, y1, x2, y2) {
		if (x2 < x1) {
			var tmp = x1;
			x1 = x2;
			x2 = tmp;
		}
		if (y2 < y1) {
			var tmp = y1;
			y1 = y2;
			y2 = tmp;
		}
		for (var y = y1; y <= y2; y++) {
			for (var x = x1; x <= x2; x++) {
				if (x <= 0 || x >= d.width || y <= 0 || y >= d.height) {
					return false;
				}
				if (d.tiles[y * d.width + x].id == "floor") {
					return false;
				}
			}
		}
		return true;
	}
	function getRoomCoords(direction, rw, rh) {
		var rect = new Object();
		switch (direction) {
		case 0:
			rect.x1 = rx - (Math.floor(rw / 2) + 1);
			rect.x2 = rx - 1;
			rect.y1 = ry - Math.floor(rh / 2);
			rect.y2 = ry;
			break;
		case 1:
			rect.x1 = rx - 1;
			rect.x2 = rx - (Math.floor(rw / 2) + 1);
			rect.y1 = ry - Math.floor(rh / 2);
			rect.y2 = ry - 1;
			break;
		case 2:
			rect.x1 = rx - Math.floor(rw / 2);
			rect.x2 = rx - 1;
			rect.y1 = ry - (Math.floor(rh / 2) + 1);
			rect.y2 = ry - 1;
			break;
		case 3:
			rect.x1 = rx - Math.floor(rw / 2);
			rect.x2 = rx - 1;
			rect.y1 = ry - 1;
			rect.y2 = ry - (Math.floor(rh / 2) + 1);
			break;
		}
		return rect;
	}
	function digRoom() {
		randomSpotUntil(wallAdjacentToFloor);
		var roomWidth = getRandomInt(5, 8);
		var roomHeight = getRandomInt(4, 6);
		for (var i = 0; i < 4; i++) {
			var r = getRoomCoords(i, roomWidth, roomHeight);
			if (spaceForRoom(r.x1, r.y1, r.x2, r.y2)) {
				d.digRoom(r.x1, r.y1, r.x2, r.y2, "floor");
				d.tiles[ry * d.width + rx].id = "floor";  // The door-way.
				return 1;
			}
		}
		return 0;
	}
	// Select a random feature to build. Returns how many features were added.
	function digFeature() {
		var n = getRandomInt(1, 101)
		switch (true) {
		case n >= 1 && n < 83:   return digCorridor();
		default: return digRoom();
		}
		return 0;
	}

	var featuresToAdd = 60;
	while (featuresToAdd > 0) {
		featuresToAdd -= digFeature();
	}

	var t = this.getEmptyTile();
	t.id = "stairsup";

	var itemsToAdd = getRandomInt(0, 20);
	while (itemsToAdd > 0) {
		itemsToAdd--;
		var itemTile = this.getEmptyTile();
		addItem(this, itemTile, new Item(randomPotion()));
	}

	if (Game.floor >= 24) {
		var heartTile = this.getEmptyTile();
		addItem(this, heartTile, new Item("oaken_heart"));
	}
}

function dungeonDraw() {
	var s = "<div class=\"dungeon\">";
	var lastname = "";
	for (var y = 0; y < this.height; y++) {
		// So we can roll the </span> into every opening without outputting garbage HTML.
		s += "<span class=\"rowstart\">";
		for (var x = 0; x < this.width; x++) {
			var i = y * this.width + x;
			var tile = this.tiles[i];
			var cname = "";
			if (Game.player.fov.fovMap[i] === FOV_KNOWN) {
				cname = "remembered";
			} else if (Game.player.fov.fovMap[i] === FOV_UNKNOWN) {
				if (lastname != "") {
					s += "</span><span>"
					lastname = "";
				}
				s += "&nbsp;";
				continue;
			}

			if (tile.creature !== null) {
				if (cname.length === 0) {
					cname = tile.creature.id;
				}
				var c = CreatureAttrs[tile.creature.id].c;
				if (lastname === "" || lastname != cname) {
					s += "</span><span class=\"" + cname + "\" onclick=\"onTileClick('" + c + "'); return false;\">";
				}
				s += c;
			} else if (tile.items.length > 0) {
				if (cname.length === 0) {
					cname = tile.items[tile.items.length - 1].cname;
				}
				var c = ItemAttrs[tile.items[tile.items.length - 1].id].c;
				if (lastname === "" || lastname != cname) {
					s += "</span><span class=\"" + cname + "\" onclick=\"onTileClick('" + c + "'); return false;\">";
				}
				s += c;
			} else {
				if (cname.length === 0) {
					cname = tile.id;
				}
				var c = TileAttrs[tile.id].c;
				if (lastname === "" || lastname != cname) {
					s += "</span><span class=\"" + cname + "\" onclick=\"onTileClick('" + c + "'); return false;\">";
				}
				s += c;
			}
			lastname = cname;
		}
		s += "</span><br>";
		lastname = "";
	}
	document.getElementById("dungeon").innerHTML = s;
}

function dungeonTileAt(x, y) {
	if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
		return undefined;
	}
	return this.tiles[y * this.width + x];
}

function dungeonDigRoom(x1, y1, x2, y2, id) {
	if (x2 < x1) {
		var tmp = x1;
		x1 = x2;
		x2 = tmp;
	}
	if (y2 < y1) {
		var tmp = y1;
		y1 = y2;
		y2 = tmp;
	}
	for (var y = y1; y <= y2; y++) {
		for (var x = x1; x <= x2; x++) {
			this.tiles[y * this.width + x] = new Tile(id, x, y);
		}
	}
}

function dungeonFill(id) {
	this.tiles = new Array(this.width * this.height);
	this.digRoom(0, 0, this.width - 1, this.height - 1, id);
}

function dungeonGetEmptyTile() {
	var d = this;
	function e(x, y) {
		var t = d.tileAt(x, y);
		return t.id === "floor" && t.creature == null;
	}
	do {
		var x = getRandomInt(1, this.width - 1);
		var y = getRandomInt(1, this.height - 1);
		var empty = e(x-1,y-1) && e(x,y-1) && e(x+1,y-1) && e(x-1,y) && e(x,y) && e(x+1,y) && e(x-1,y+1) && e(x,y+1) && e(x+1,y+1);
	} while (!empty);
	return d.tileAt(x, y);
}

function DungeonFloor(width, height, generator) {
	this.width = width;
	this.height = height;
	this.creatures = new Array();

	// Methods.
	this.generate = generator;
	this.draw = dungeonDraw;
	this.tileAt = dungeonTileAt;
	this.digRoom = dungeonDigRoom;
	this.fill = dungeonFill;
	this.getEmptyTile = dungeonGetEmptyTile;

	this.generate();
}
