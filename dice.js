/*
 * Creates an object that returns a random number.
 *   '4' returns 4.
 *   '10-15' returns a value from 10 to 15 inclusive.
 *   'd6' or '1d6'  one six sided die, 1-6
 *   '2d3' two three sided dice 1-3 + 1-3
 *   '1d20+2' one twenty sided die, +2 to the result.
 *   '3d6-5' three six sided dice, -5 to the result. (1-6 + 1-6 + 1-6) - 5
 */
function Dice(str) {
	var strs = str.split("d");
	if (strs.length === 1) {
		dashes = str.split("-");
		if (dashes.length <= 1) {
			this.val = parseInt(dashes[0], 10);
			this.roll = function() { return this.val; };
			return;
		} else {
			this.lower = parseInt(dashes[0], 10);
			this.upper = parseInt(dashes[1], 10);
			this.roll = simpleRoll;
			return;
		}
	}
	if (strs[0].length === 0) {
		strs[0] = "1";
	}
	this.numberOfDice = parseInt(strs[0], 10);
	if (strs[1].indexOf("+") != -1) {
		this.modifier = parseInt(strs[1].substr(strs[1].indexOf("+")+1), 10);
	} else if (strs[1].indexOf("-") != -1) {
		this.modifier = parseInt(strs[1].substr(strs[1].indexOf("-")), 10);
	} else {
		this.modifier = 0;
	}
	this.sides = parseInt(strs[1], 10);

	this.roll = diceRoll;
}

function simpleRoll() {
	return getRandomInt(this.lower, this.upper + 1);
}

function diceRoll() {
	var sum = 0;
	for (var i = 0, len = this.numberOfDice; i < len; ++i) {
		sum += getRandomInt(1, this.sides + 1);
	}
	return sum + this.modifier;
}
