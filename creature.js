var CreatureAttrs = {
	player: { c:"@", sightRange:5 },
	seeker: { c:"s", sightRange:7 }
}

function seekAi() {
	if (this.canSee(Game.player)) {
		Log.add(function() { return MessageStrings.get(MSG_X_MOANS, MSG_SEEKER); });
	}
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
	switch (id) {
	case "seeker":
		this.ai = seekAi;
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
