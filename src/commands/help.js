module.exports = async (args, msg, env, commands) => {
	await msg.reply('Currently, I understand the following commands: \n' +
		Object.getOwnPropertyNames(commands).join(', ') )
		.catch(console.error);
	console.log('help requested');
};