var Game = {
	fps:12,
}

Game.dungeon = new DungeonFloor(80, 25, simpleDungeonGenerator);
Game.playerTile = Game.dungeon.getEmptyTile();
Game.playerTile.creature = new Creature("player");

Game.update = function() {
}

Game.draw = function() {
	document.getElementById("content").innerHTML = "";
	Log.draw();
	Game.dungeon.draw();
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
	if (!TileAttrs[toTile.tilename].walkable) {
		Log.add(MSG_NO_WALK);
		return fromTile;
	}
	toTile.creature = fromTile.creature;
	fromTile.creature = null;
	return toTile;
}

Game.input = function(event) {
	switch (event.keyCode) {
	case 72: Game.playerTile = moveCreature(Game.dungeon, Game.playerTile, -1, 0); break;  // h
	case 74: Game.playerTile = moveCreature(Game.dungeon, Game.playerTile, 0, 1); break;   // j
	case 75: Game.playerTile = moveCreature(Game.dungeon, Game.playerTile, 0, -1); break;  // k
	case 76: Game.playerTile = moveCreature(Game.dungeon, Game.playerTile, 1, 0); break;   // l
	break;
	}
}

Game.run = function() {
	Game.update();
	Game.draw();
}

Game._intervalId = setInterval(Game.run, 1000 / Game.fps);
document.addEventListener("keydown", Game.input);
