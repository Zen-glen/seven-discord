require('dotenv').config({path: '../.env'});

const help = require('./help');
const ping = require('./ping');
const flip = require('./flip');
const roll = require('./roll');
const quit = require('./quit');
const eightBall = require('./8ball');
const source = require('./source');

const commands = {
	'help': help,
	'ping': ping,
	'roll': roll,
	'flip': flip,
	'quit': quit,
	'source': source,
	'8ball': eightBall,
};

function messageIsFromServer(msg) {
	return msg.guild.id === process.env.SERVER_ID;
}

function getArgs(msg) {
	return msg.content.split(' ');
}

function argsExistAndStartWithExclamation(args) {
	return args.length === 0 || args[0].charAt(0) !== '!';
}

function getCommand(args) {
	return args.shift().substr(1);
}

module.exports = async msg => {
	if (messageIsFromServer(msg)) {
		const args = getArgs(msg);
		if (argsExistAndStartWithExclamation(args)) return;
		const command = getCommand(args);

		if (commands[command]) {
			commands[command](args, msg, process.env, commands);
		}

	}

};