module.exports = {
	name: 'test',
	execute: async (args, msg) => {
		if (args[0] === 'get') {
			const testList = await global.Test.findAll({ attributes: ['test1']});
			console.log(testList);
			msg.channel.send('Database entries: ' + testList.map(item => item.test1).join(', '));
			return;
		}
		try {
			const test = await global.Test.create({
				test1: args[0],
			});
			msg.channel.send(`${args[0]} added to the database.`);
		}
		catch (e) {
			console.log(e);
			msg.channel.send('Something went wrong with adding a tag.');
		}
		console.log('Test sent');
	},
};