// Imports
require('dotenv').config();
const Discord = require('discord.js');
const Sequelize = require('sequelize');
const commandHandler = require('./command_handler');
const Validator = require('./validator');

const client = new Discord.Client();
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// Sqlite only
	storage: './db.sqlite',
});

global.Test = sequelize.define('test', {
	test1: {
		type: Sequelize.STRING,
		unique: false,
	},
});

global.Users = sequelize.define('users', {
	user: {
		type: Sequelize.STRING,
		unique: true,
	},
	games: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
	},
	wins: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
	},
	points: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
	},
});

global.Users.sync();
global.Test.sync();



new Validator(client);

const defaultChannelId = process.env.DEFAULT_CHANNEL_ID;



client.once('ready', () => {
	if (process.env.SUPPRESS_LOGIN_ANNOUNCE === 'FALSE') {
		client.channels.cache.get(defaultChannelId).send('I am ready.');
	}
	console.log('bot ready');
});

client.on('message', commandHandler);

client.login(process.env.BOT_TOKEN);



