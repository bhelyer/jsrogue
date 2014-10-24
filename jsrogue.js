var Game = {
	fps:12,
	floor:0,
	info:MSG_INTRO
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
		var playerTile = this.dungeon.tileAt(Game.player.x, Game.player.y);
		if (playerTile.id != "stairsup") {
			Log.add(MSG_FAIL_DOGROUND);
		} else {
			Game.floor++;
			Game.dungeon = new DungeonFloor(80, 25, simpleDungeonGenerator);
			populateDungeon();
			Log.add(MSG_CLIMB);
		}
		break;
	default:
		throw new Error("Game.doAction(): unknown id: " + action.id);
	}
}

Game.update = function() {
	if (Game.player.actions.length == 0) {
		return;
	}
	for (var i = 0; i < Game.dungeon.creatures.length; i++) {
		var c = Game.dungeon.creatures[i];
		if (typeof c.ai === "function") {
			c.ai();
		}
		if (c.actions.length > 0) {
			this.doAction(c.actions[0]);
			c.actions = c.actions.slice(1);
		}
	}
}

Game.draw = function() {
	MessageStrings.drawOptions();
	Log.draw();
	Game.dungeon.draw();
	document.getElementById("status").innerHTML = MessageStrings.getStatus(this.floor);
	document.getElementById("info").innerHTML = MessageStrings.get(Game.info);
}

function moveCreature(floor, fromTile, xMove, yMove) {
	if (fromTile.creature === null) {
		throw new Error("moveCreature(): tried to move creature from empty tile.");
	}
	var newX = fromTile.x + xMove;
	var newY = fromTile.y + yMove;
	if (newX < 0 || newX >= floor.width || newY < 0 || newY >= floor.height) {
		Log.add(MSG_NO_WALK);
		return fromTile;
	}
	var toTile = floor.tileAt(newX, newY);
	if (toTile.creature != null) {
		// attack code goes here
		throw new Error("moveCreature(): implement attack.");
	}
	if (!TileAttrs[toTile.id].walkable) {
		Log.add(MSG_NO_WALK);
		return fromTile;
	}
	toTile.creature = fromTile.creature;
	fromTile.creature = null;
	toTile.creature.x = toTile.x;
	toTile.creature.y = toTile.y;
	return toTile;
}

Game.input = function(event) {
	if (Game.player.actions.length > 0) {
		return;
	}
	var px = Game.player.x, py = Game.player.y;
	switch (event.keyCode) {
	case 72: Game.player.actions.push(new Action("move", px, py, px - 1, py)); break;
	case 74: Game.player.actions.push(new Action("move", px, py, px, py + 1)); break;
	case 75: Game.player.actions.push(new Action("move", px, py, px, py - 1)); break;
	case 76: Game.player.actions.push(new Action("move", px, py, px + 1, py)); break;
	case 190:
		if (!event.shiftKey) {
			break;
		}
		Game.player.actions.push(new Action("doground"));
		break;
	}
}

Game.run = function() {
	Game.update();
	Game.draw();
}

Game._intervalId = setInterval(Game.run, 1000 / Game.fps);
document.addEventListener("keydown", Game.input);
if (getQueryParams(document.location.search).lang == "japanese") {
	MessageStrings.toggleLanguage();
}
