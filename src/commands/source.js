module.exports = async (args, msg, env, commands) => {
	await msg.reply('My source code can be found here: <https://github.com/Zen-glen/seven-discord>')
		.catch(console.error);
	console.log('help requested');
};