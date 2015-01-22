var CreatureAttrs = {
	player: { c:"@", name:MSG_YOU, sightRange:25, initialMaxHP:"20", initialStrength:"5", initialDefence:"3" },
	seeker: { c:"s", name:MSG_SEEKER, sightRange:7, initialMaxHP:"8",  initialStrength:"3", initialDefence:"2" }
}

function seekAi() {
	var t = this;
	var tile = this.dungeon.tileAt(this.x, this.y);
	if (tile.items.length > 0) {
			this.actions.push(new Action("doground", this.x, this.y));
			return;
	}
	var seen = this.canSee(Game.player);
	if (seen && !this.seenPlayer) {
		Log.add(function() { return MessageStrings.get(MSG_A_MOANS, t.name); });
	}
	if (seen) {
		var c = this
		var firstStep = true;
		function moveTowardsPlayer(x, y) {
			if (firstStep) {
				firstStep = false;
				return true;
			}
			c.actions.push(new Action("move", c.x, c.y, x, y));
			return false;
		}
		line(c.x, c.y, Game.player.x, Game.player.y, moveTowardsPlayer);
	}
	this.seenPlayer = seen;
}

function creatureCanSee(location) {
	var result = true;
	var c = this;
	var range = CreatureAttrs[c.id].sightRange;
	function fn(x, y) {
		range--;
		if (range < 0) {
			return result = false;
		}
		var t = c.dungeon.tileAt(x, y);
		if (!TileAttrs[t.id].transparent) {
			if (x === location.x && y === location.y) {
				result = true;
				return false;
			} else {
				return result = false;
			}
		}
		return true;
	}

	line(this.x, this.y, location.x, location.y, fn);
	return result;
}

function creatureDie() {
	if (this.hp <= 0) {
		if (Game.player.canSee(this)) {
			var deathMessage = function(name) { return function() { return MessageStrings.get(MSG_A_DIES, name); } }(this.name);
			Log.add(deathMessage);
		}
		var t = this.dungeon.tileAt(this.x, this.y);
		while (this.inventory.length > 0) {  // Drop entire inventory to the ground on death.
			t.items.push(this.inventory.pop());
		}
		if (t.creature !== this) {
			throw new Error("creatureDie: Dungeon and creature disagree on location upon death.");
		}
		t.creature = null;
		if (this === Game.player) {
			Game.player.hp = 0;
			Game.over = true;
			return;
		}
	}
}

function creatureHasItem(id) {
	for (var i = 0, len = this.inventory.length; i < len; ++i) {
		if (this.inventory[i].id === id) {
			return true;
		}
	}
	return false;
}

function Creature(id) {
	this.id = id;
	this.actions = new Array();
	this.inventory = new Array();
	this.canSee = creatureCanSee;
	this.dieIfNeeded = creatureDie;
	this.hasItem = creatureHasItem;
	var attr = CreatureAttrs[id];
	this.name = attr.name;
	this.hp = this.maxHp = new Dice(attr.initialMaxHP).roll();
	this.str = new Dice(attr.initialStrength).roll();
	this.def = new Dice(attr.initialDefence).roll();
	switch (id) {
	case "player":
		this.waitingForItemChoice = false;
		break;
	case "seeker":
		this.ai = seekAi;
		this.seenPlayer = false;
		break;
	default:
		break;
	}
}

function Action(id, a, b, c, d) {
	this.id = id;
	this.a = a;
	this.b = b;
	this.c = c;
	this.d = d;
}
