// Imports
require('dotenv').config();
const Discord = require('discord.js');
const commandHandler = require('./commands');
const Validator = require('./validator');


const client = new Discord.Client();

new Validator(client);

const defaultChannelId = process.env.DEFAULT_CHANNEL_ID;
const serverId = process.env.SERVER_ID;
const ownerID = process.env.OWNER_ID;


client.once('ready', () => {
	client.channels.cache.get(defaultChannelId).send('Bot ready.');
	console.log('bot ready');
});

client.on('message', commandHandler);

client.login(process.env.BOT_TOKEN);



