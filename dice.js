/*
 * Creates a die or dice with a given die string.
 *   'd6' or '1d6'  one six sided die, 1-6
 *   '2d3' two three sided dice 1-3 + 1-3
 *   '1d20+2' one twenty sided die, +2 to the result.
 *   '3d6-5' three six sided dice, -5 to the result. (1-6 + 1-6 + 1-6) - 5
 */
function Dice(str) {
	var d = new Object();
	var strs = str.split("d");
	if (strs[0].length === 0) {
		strs[0] = "1";
	}
	d.numberOfDice = parseInt(strs[0], 10);
	if (strs[1].indexOf("+") != -1) {
		d.modifier = parseInt(strs[1].substr(strs[1].indexOf("+")+1), 10);
	} else if (strs[1].indexOf("-") != -1) {
		d.modifier = parseInt(strs[1].substr(strs[1].indexOf("-")), 10);
	} else {
		d.modifier = 0;
	}
	d.sides = parseInt(strs[1], 10);

	d.roll = diceRoll;

	return d;
}

function diceRoll() {
	var sum = 0;
	for (var i = 0, len = this.numberOfDice; i < len; ++i) {
		sum += getRandomInt(1, this.sides + 1);
	}
	return sum + this.modifier;
}
