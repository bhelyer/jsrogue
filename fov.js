var FOV_UNKNOWN = 0;
var FOV_KNOWN = 1;
var FOV_SEEN = 2;

function fovUpdate(p) {
	var d = this.dungeon;
	function index(x, y) {
		return y * d.width + x;
	}
	function isSeen(x, y) {
		return x >= (p.x - r) && x <= (p.x + r) && y >= (p.y - r) && y <= (p.y + r);
	}
	var r = CreatureAttrs.player.sightRange;
	for (var x = 0, w = d.width; x < w; ++x) {
		for (var y = 0, h = d.height; y < h; ++y) {
			var i = index(x, y);
			var v = this.fovMap[i];
			this.fovMap[i] = isSeen(x, y) ? FOV_SEEN : (v !== FOV_UNKNOWN) ? FOV_KNOWN : FOV_UNKNOWN;
		}
	}
}

function FovMap(dungeon) {
	this.dungeon = dungeon;
	this.fovMap = new Array(dungeon.width * dungeon.height);
	for (var i = 0, len = this.fovMap.length; i < len; ++i) {
		this.fovMap[i] = FOV_UNKNOWN;
	}

	this.update = fovUpdate;
}
