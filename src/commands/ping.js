module.exports = async (args, msg) => {
	await msg.channel.send('pong');
	console.log('Ping sent');
};