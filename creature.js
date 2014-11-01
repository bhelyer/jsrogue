var CreatureAttrs = {
	player: { c:"@", name:MSG_YOU, sightRange:5, initialMaxHP:"3d10+2", initialStrength:"2d6", initialDefence:"d6" },
	seeker: { c:"s", name:MSG_SEEKER, sightRange:7, initialMaxHP:"2d6+2",  initialStrength:"d6+1", initialDefence:"d4" }
}

function seekAi() {
	var t = this;
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
			return result = false;
		}
		return true;
	}

	line(this.x, this.y, location.x, location.y, fn);
	return result;
}

function Creature(id) {
	this.id = id;
	this.actions = new Array();
	this.canSee = creatureCanSee;
	var attr = CreatureAttrs[id];
	this.name = attr.name;
	this.hp = this.maxHp = new Dice(attr.initialMaxHP).roll();
	this.str = new Dice(attr.initialStrength).roll();
	this.def = new Dice(attr.initialDefence).roll();
	switch (id) {
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
