module.exports = {
	name: 'quit',
	execute: async (args, msg, env) => {
		if (msg.author.id !== env.OWNER_ID) return;
		await msg.reply('Good bye.');
		msg.client.destroy();
		process.exit();
	},
};