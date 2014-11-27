var Game = {
	fps:12,
	floor:0,
	info:MSG_INTRO,
	over:false
}

Game.dungeon = new DungeonFloor(80, 25, simpleDungeonGenerator);
Game.player = new Creature("player");
populateDungeon();

function populateDungeon() {
	addCreature(Game.dungeon, Game.dungeon.getEmptyTile(), Game.player);
	var thingsToAdd = 10;
	while (thingsToAdd-- > 0) {
		var t = Game.dungeon.getEmptyTile();
		addCreature(Game.dungeon, t, new Creature("seeker"));
	}
}

function onMouseOver(id) {
	switch (id) {
	case "wall":
	case "floor": Game.info = MSG_INTRO; break;
	case "player": Game.info = MSG_PLAYERDESC; break;
	case "seeker": Game.info = MSG_SEEKERDESC; break;
	default: break;
	}
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
					Log.add(function() { return MessageStrings.get(MSG_A_PICKS_UP_B, creature.name, creature.inventory[creature.inventory.length - 1].name)});
				}
			}
		} else if (tile.id === "stairsup") {
			Game.floor++;
			Game.dungeon = new DungeonFloor(80, 25, simpleDungeonGenerator);
			populateDungeon();
			Log.add(MSG_CLIMB);
		} else {
			Log.add(MSG_FAIL_DOGROUND);
		}
		break;
	case "wait":
		break;
	default:
		throw new Error("Game.doAction(): unknown id: " + action.id);
	}
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
		if (c.actions.length > 0) {
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
		s += "<span class=\"inventoryitem\">" + String.fromCharCode("A".charCodeAt(0) + i) + "</span>: " + MessageStrings.get(item.name) + "<br>"
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
	if (Game.player.actions.length > 0 || event.altKey) {
		return;
	}
	var px = Game.player.x, py = Game.player.y;
	switch (event.keyCode) {
	case 72: Game.player.actions.push(new Action("move", px, py, px - 1, py)); break;      // h
	case 74: Game.player.actions.push(new Action("move", px, py, px, py + 1)); break;      // j
	case 75: Game.player.actions.push(new Action("move", px, py, px, py - 1)); break;      // k
	case 76: Game.player.actions.push(new Action("move", px, py, px + 1, py)); break;      // l
	case 89: Game.player.actions.push(new Action("move", px, py, px - 1, py - 1)); break;  // y
	case 85: Game.player.actions.push(new Action("move", px, py, px + 1, py - 1)); break;  // u
	case 66: Game.player.actions.push(new Action("move", px, py, px - 1, py + 1)); break;  // b
	case 78: Game.player.actions.push(new Action("move", px, py, px + 1, py + 1)); break;  // n
	case 71: Game.player.actions.push(new Action("doground", px, py)); break;                      // g
	case 190:  // .
		if (event.shiftKey) {
			Game.player.actions.push(new Action("doground", px, py));
		} else {
			Game.player.actions.push(new Action("wait"));
		}
		break;
	case 188:  // ,
		if (event.shiftKey) {
			Game.player.actions.push(new Action("doground", px, py));
		}
		break;
	default:
		return;
	}
	event.preventDefault();
}

Game.run = function() {
	Game.update();
	Game.draw();
}

Game._intervalId = setInterval(Game.run, 1000 / Game.fps);
document.addEventListener("keydown", Game.input);
document.addEventListener("keyrepeat", Game.input);
if (getQueryParams(document.location.search).lang == "japanese") {
	MessageStrings.toggleLanguage();
}
