module.exports = async (args, msg, env, commands) => {
	const regex = /\d{0,2}d\d{1,2}/gi;
	const matches = getMatches(msg, regex);

	if (matches.length === 0) {
		msg.reply('you did not tell me which dice to roll. Try **1d6** to roll one 6 sided die or **2d8** to roll two 8 sided dice. I can even roll multiple sets of dice, such as: **1d6 2d8 4d4**');
	}
	else {
		let grandTotal = 0;
		let total = 0;
		let results = [];
		let rolls = 0;
		let dice = 0;
		for (const match of matches) {
			rolls = getRolls(match);
			dice = getDie(match);
			results = rollDice(rolls, dice);
			total = results.reduce((a, b) => a + b, 0);
			grandTotal += total;
			msg.reply('for **' + match + '** I rolled ' + convertToString(results) + ' for a total of **' + total + '**');
		}
		if (matches.length > 1) {
			msg.reply('In total, you rolled: **' + grandTotal + '**');
		}
	}
};

function getMatches(msg, regex) {
	return [...msg.content.matchAll(regex)];
}

function getRolls(match) {
	return match[0].split('d')[0];
}

function getDie(match) {
	return match[0].split('d')[1];
}

function rollDice(rolls, dice) {
	let results = [];
	for (let i = 0; i < rolls; i++) {
		results.push(Math.ceil(Math.random() * dice));
	}
	return results;
}

function convertToString(results) {
	let result = '';
	for (const [i, value] of results.entries()) {
		if (i + 1 !== results.length) {
			result = result + '**' + value + '**, ';
		}
		else {
			result = result + '**' + value + '**';
		}
	}
	return result;
}
