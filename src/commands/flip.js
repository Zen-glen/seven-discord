module.exports = async (args, msg) => {
	const replies = [
	    'Heads',
		'Tails'
	];
	const x = Math.round(Math.random());
	await msg.channel.send(replies[(x)]);
	console.log('Coin flipped: ' + replies[(x)]);
};