var Game = {
	floor:0,
	info:MSG_INTRO,
	over:false
}

function populateDungeon() {
	addCreature(Game.dungeon, Game.dungeon.getEmptyTile(), Game.player);
	var thingsToAdd = 10;
	while (thingsToAdd-- > 0) {
		var t = Game.dungeon.getEmptyTile();
		addCreature(Game.dungeon, t, new Creature("seeker"));
	}
}

function onTileClick(c) {
	switch (c) {
	case "#":
	case ".": Game.info = MSG_INTRO; break;
	case "@": Game.info = MSG_PLAYERDESC; break;
	case "s": Game.info = MSG_SEEKERDESC; break;
	default: break;
	}
	Game.draw();
}

Game.doAction = function(action) {
	switch (action.id) {
	/*
	 * "move"
	 * Move the creature on the current dungeons (a, b) tile to (c, d).
	 */
	case "move":
		var fromTile = this.dungeon.tileAt(action.a, action.b);
		var xMove = action.c - action.a;
		var yMove = action.d - action.b;
		moveCreature(this.dungeon, fromTile, xMove, yMove);
		break;
	case "doground":
		var tile = this.dungeon.tileAt(action.a, action.b);
		var creature = tile.creature;
		if (creature === null) {
			throw new Error("doAction: doground empty tile");
		}
		if (tile.items.length > 0) {
			while (tile.items.length > 0) {
				creature.inventory.push(tile.items.pop());
				if (Game.player.canSee(creature)) {
					function msgfunc(iname) { return function() { return MessageStrings.get(MSG_A_PICKS_UP_B, creature.name, iname)} }
					Log.add(msgfunc(creature.inventory[creature.inventory.length - 1].name));
				}
			}
			if (Game.player.hasItem("oaken_heart")) {
				Log.add(MSG_WIN);
				Game.over = true;
			}
		} else if (tile.id === "stairsup") {
			Game.floor++;
			Game.dungeon = new DungeonFloor(80, 25, simpleDungeonGenerator);
			populateDungeon();
			Log.add(MSG_CLIMB);
			if (creature === Game.player) {
				Game.player.fov.update(Game.player);
			}
		} else {
			Log.add(MSG_FAIL_DOGROUND);
		}
		break;
	case "use":
		var tile = this.dungeon.tileAt(action.a, action.b);
		var creature = tile.creature;
		if (creature === null) {
			throw new Error("doAction: use empty tile");
		}
		if (creature !== Game.player) {
			throw new Error("doAction: don't give AI creatures use actions, just set creature.itemToUse.");
		}
		if (creature.inventory.length === 0) {
			Log.add(MSG_EMPTY);
			break;
		}
		Log.add(MSG_CHOOSE_ITEM);
		creature.waitingForItemChoice = "use";
		break;
	case "drop":
		var tile = this.dungeon.tileAt(action.a, action.b);
		var creature = tile.creature;
		if (creature === null) {
			throw new Error("doAction: empty tile");
		}
		if (creature !== Game.player) {
			throw new Error("doAction: just use creature.itemToDrop for AI.");
		}
		if (creature.inventory.length === 0) {
			Log.add(MSG_EMPTY);
			break;
		}
		Log.add(MSG_CHOOSE_ITEM);
		creature.waitingForItemChoice = "drop";
		break;
	case "wait":
		break;
	default:
		throw new Error("Game.doAction(): unknown id: " + action.id);
	}
}

// For debugging purposes.
function spawnItem(id) {
	var tile = Game.dungeon.tileAt(Game.player.x, Game.player.y);
	tile.items.push(new Item(id));
}

Game.update = function() {
	if (Game.player.actions.length == 0 || Game.over) {
		return;
	}
	for (var i = 0; i < Game.dungeon.creatures.length; i++) {
		var c = Game.dungeon.creatures[i];
		if (c.hp <= 0) {
			Game.dungeon.creatures.splice(i--, 1);
			continue;
		}
		if (typeof c.ai === "function") {
			c.ai();
		}
		if (c.itemToUse !== undefined && c.itemToUse !== null) {
			remove = c.itemToUse.use(c);
			if (remove) for (var i = 0, len = c.inventory.length; i < len; ++i) {
				if (c.itemToUse === c.inventory[i]) {
					c.inventory.splice(i, 1);
					break;
				}
			}
			c.itemToUse = null;
			Game.draw();
			Game.update();
		} else if (c.itemToDrop !== undefined && c.itemToDrop !== null) {
			var tile = Game.dungeon.tileAt(c.x, c.y);
			for (var i = 0, len = c.inventory.length; i < len; ++i) {
				if (c.itemToDrop === c.inventory[i]) {
					c.inventory.splice(i, 1);
					tile.items.push(c.itemToDrop);
					break;
				}
			}
			c.itemToDrop = null;
			Game.draw();
			Game.update();
		} else if (c.actions.length > 0) {
			this.doAction(c.actions[0]);
			c.actions = c.actions.slice(1);
		}
	}
}

function drawInventory() {
	if (Game.player.inventory.length == 0) {
		return MessageStrings.get(MSG_EMPTY);
	}
	var s = new String();
	for (var i = 0, len = Game.player.inventory.length; i < len; ++i) {
		var item = Game.player.inventory[i];
		s += "<span class=\"inventoryitem\">" + String.fromCharCode("A".charCodeAt(0) + i) + "</span>: " + MessageStrings.get(ItemAttrs[item.id].name) + "<br>"
	}
	return s;
}

Game.draw = function() {
	MessageStrings.drawOptions();
	Log.draw();
	Game.dungeon.draw();
	document.getElementById("status").innerHTML = MessageStrings.getStatus(this.floor, this.player);
	document.getElementById("info").innerHTML = MessageStrings.get(Game.info);
	document.getElementById("inventory").innerHTML = drawInventory();
}

function moveCreature(floor, fromTile, xMove, yMove) {
	if (fromTile.creature === null) {
		throw new Error("moveCreature(): tried to move creature from empty tile.");
	}
	var newX = fromTile.x + xMove;
	var newY = fromTile.y + yMove;
	if (newX < 0 || newX >= floor.width || newY < 0 || newY >= floor.height) {
		Log.add(MSG_NO_WALK);
		return;
	}
	var toTile = floor.tileAt(newX, newY);
	if (toTile.creature != null) {
		attackCreature(fromTile.creature, toTile.creature);
		return;
	}
	if (!TileAttrs[toTile.id].walkable) {
		Log.add(MSG_NO_WALK);
		return;
	}
	if (toTile.items.length > 0 && fromTile.creature === Game.player) {
		for (var i = 0, len = toTile.items.length; i < len; ++i) {
			var name = ItemAttrs[toTile.items[i].id].name;
			Log.add(function() { return MessageStrings.get(MSG_A_IS_HERE, name); });
		}
	}
	toTile.creature = fromTile.creature;
	fromTile.creature = null;
	toTile.creature.x = toTile.x;
	toTile.creature.y = toTile.y;
	if (toTile.creature	 === Game.player) {
		toTile.creature.fov.update(Game.player);
	}
	return;
}

function attackCreature(attacker, defender) {
	Log.add(function() { return MessageStrings.get(MSG_A_ATTACKS_B, attacker.name, defender.name); } );
	var halfStr = Math.floor(attacker.str / 2);
	var halfDef = Math.floor(defender.def / 2);
	var atk = getRandomInt(attacker.str - halfStr, attacker.str + halfStr);
	var def = getRandomInt(defender.def - halfDef, defender.str + halfDef);
	var damage = atk - def;
	if (damage <= 0) {
		Log.add(function() { return MessageStrings.get(MSG_A_DODGES, defender.name); });
	} else {
		defender.hp -= damage;
		Log.add(function() { return MessageStrings.get(MSG_A_RECEIVES_B_DMG, defender.name, damage); });
		defender.dieIfNeeded();
	}
}

Game.input = function(event) {
	if (Game.player.waitingForItemChoice != false) {
		var type = Game.player.waitingForItemChoice;
		Game.player.waitingForItemChoice = false;
		var kc = event.keyCode;
		if (kc < 65 || kc > 90) {
			Log.add(MSG_LETTER_PLEASE);
			return;
		}
		var i = kc - 65;
		if (i >= Game.player.inventory.length) {
			Log.add(MSG_NO_ITEM);
			return;
		}
		if (type === "use") {
			Game.player.itemToUse = Game.player.inventory[i];
		} else if (type === "drop") {
			Game.player.itemToDrop = Game.player.inventory[i];
		} else {
			throw new Error("Game.input");
		}
		return;
	}
	if (Game.player.actions.length > 0 || event.altKey || event.metaKey || event.ctrlKey) {
		return;
	}
	var px = Game.player.x, py = Game.player.y;
	switch (event.keyCode) {
	case 37:																				   // Left arrow
	case 72: Game.player.actions.push(new Action("move", px, py, px - 1, py)); break;      // h
	case 40:                                                                               // Down arrow
	case 74: Game.player.actions.push(new Action("move", px, py, px, py + 1)); break;      // j
	case 38:                                                                               // Up arrow
	case 75: Game.player.actions.push(new Action("move", px, py, px, py - 1)); break;      // k
	case 39:                                                                               // Right arrow
	case 76: Game.player.actions.push(new Action("move", px, py, px + 1, py)); break;      // l
	case 89: Game.player.actions.push(new Action("move", px, py, px - 1, py - 1)); break;  // y
	case 85: Game.player.actions.push(new Action("move", px, py, px + 1, py - 1)); break;  // u
	case 66: Game.player.actions.push(new Action("move", px, py, px - 1, py + 1)); break;  // b
	case 78: Game.player.actions.push(new Action("move", px, py, px + 1, py + 1)); break;  // n
	case 188:                                                                              // ,
	case 71: Game.player.actions.push(new Action("doground", px, py)); break;              // g
	case 73:                                                                               // i
	case 65: Game.player.actions.push(new Action("use", px, py)); break;                   // a
	case 68: Game.player.actions.push(new Action("drop", px, py)); break;                  // d
	case 190:                                                                              // .
		if (event.shiftKey) {
			Game.player.actions.push(new Action("doground", px, py));
		} else {
			Game.player.actions.push(new Action("wait"));
		}
		break;
	default:
		return;
	}
	event.preventDefault();
}

Game.run = function(event) {
	Game.input(event);
	Game.update();
	Game.draw();
}

window.onload = function() {
	initItems();
	Game.dungeon = new DungeonFloor(80, 25, simpleDungeonGenerator);
	Game.player = new Creature("player");
	populateDungeon();
	Game.player.fov.update(Game.player);
	if (getQueryParams(document.location.search).lang == "japanese") {
		MessageStrings.toggleLanguage();
	}
	Game.draw();
	document.addEventListener("keydown", Game.run);
	document.addEventListener("keyrepeat", Game.run);
}
