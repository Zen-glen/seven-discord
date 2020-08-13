module.exports = class Validator {
	requiredEnvSettings = {
		'BOT_TOKEN': process.env.BOT_TOKEN,
		'DEFAULT_CHANNEL_ID': process.env.DEFAULT_CHANNEL_ID,
		'SERVER_ID': process.env.SERVER_ID,
		'OWNER_ID': process.env.OWNER_ID,
	};

	constructor(client) {
		this.validate();
		if (this.status === 'passed') {
			console.log ('Validating settings complete')
		} else {
			this.kill(client)
		}
	}

	validate() {
		this.status = 'passed';
		for (const setting in this.requiredEnvSettings) {
			if (this.requiredEnvSettings[setting] === '') {
				console.log(setting + ' is not defined. Please enter a value in the .env file.');
				this.status = 'failed';
			}
		}
	}

	kill(client) {
		client.destroy();
		process.exit();
	}

};