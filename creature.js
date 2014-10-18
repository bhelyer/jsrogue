var CreatureAttrs = {
	player: { c:"@" },
	seeker: { c:"s" }
}

function seekAi() {
	console.log("SEEK AI");
}

function Creature(creaturename) {
	this.creaturename = creaturename;
	this.actions = new Array();
	switch (creaturename) {
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
