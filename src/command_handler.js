require('dotenv').config({path: './.env'});
const fs = require('fs');
const commandFiles = fs.readdirSync(__dirname + '\\commands').filter(file => file.endsWith('.js'));
let commands = {};
for (const file of commandFiles) {
	const command = require ('./commands/' + file);
	commands[command.name] = command;
}

module.exports = async msg => {
	if (messageIsFromServer(msg)) {
		const args = getArgs(msg);
		if (argsExistAndStartWithExclamation(args)) return;
		const command = getCommand(args);

		if (commands[command]) {
			await commands[command].execute(args, msg, process.env, commands);
		}
	}
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