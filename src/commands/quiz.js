const axios = require('axios').default;

module.exports = {
	name: 'q',
	owner: '',
	numOfQuestions: 0,
	difficulty: '',
	channel: {},


	execute: async function (args, msg) {
		this.channel = msg.channel.id;
		this.owner = msg.author.id;
		this.channel = msg.channel;
		this.parseArgs(args);







		console.log('Quiz started');
		if (await this.getSettings() === false) return;


		const response = await this.getQuizQuestions();
		if (this.isApiError(response)) {
			this.channel.send(`There was wan API error. Response code: ${response.data['response_code']}`);
			return;
		}

		await this.startQuiz(response);


		return;
	},

	startQuiz: async function(response) {
		let results = {};
		let answers = [];
		let answered = [];

		for (let question of response.data.results) {
			answered = [];
			this.channel.send('**Question: **' + this.parseFromApi(question.question));

			answers = this.collectAnswers(question);
			const answerString = this.formatAnswers(answers);
			if (question.type === 'multiple') {
				this.channel.send('Multiple choice: \n' + answerString);
			} else {
				this.channel.send('\n' + answerString);
			}

			try {
				const collected = await this.channel.awaitMessages(message => {
					const usersAnswer = message.content.toUpperCase();
					if ( answers.hasOwnProperty(usersAnswer) &&
						answers[usersAnswer].correct === true &&
						!answered.includes(message.author.username)) {
						return true;
					}
					else {
						answered.push(message.author.username);
					}
				}, { max: 1, time: 30000});
				let winner = collected.first().author.username;
				this.channel.send(`**${winner}** was correct with *${question.correct_answer}*`);
				winner in results ? results[winner] += 1 : results[winner] = 1;
			}
			catch {
				this.channel.send('No one got the question right.');
				this.channel.send(`The correct answer was: **${question.correct_answer}**`);
			}
			this.channel.send('-------------------------------------------------');
		}



		if (Object.keys(results).length === 0) {
			this.channel.send('The quiz is over. No one got any questions correct!');
		}
		else {
			this.channel.send('The quiz is over. The results are: ');
			for (let user in results) {
				this.channel.send(`${user}: ${results[user]}`);
			}
			let winner = Object.keys(results).reduce((a, b) => results[a] > results[b] ? a : b);
			this.channel.send(`The winner is **${winner}**`);
		}
	},

	parseArgs: function (args) {
		try {
			this.numOfQuestions = args[0];
			this.difficulty = args[1];
		}
		catch {
			console.log('Settings not passed as arguments');
		}
	},

	getNumberOfQuestions: async function () {
		this.channel.send('How many questions should I ask? (1-10)');
		try {
			const collected = await this.channel.awaitMessages(message => message.author.id === this.owner && !isNaN(parseInt(message.content)),  { max: 1, time: 15000 });
			return parseInt(collected.first().content);
		}
		catch(collected) {
			this.channel.send('You did not tell me how many questions you wanted. Ending the quiz.');
		}
	},

	getDifficulty: async function() {
		this.channel.send('Which difficulty would you like: easy, medium, hard?');
		try {
			const collected = await this.channel.awaitMessages(message => message.author.id === this.owner && ['easy', 'medium', 'hard'].includes(message.content.toLocaleLowerCase()),  { max: 1, time: 15000 });
			return collected.first().content;
		}
		catch(collected) {
			this.channel.send('You did not tell which difficulty you wanted. Ending the quiz.');
		}
	},

	getSettings: async function() {
		if (!(this.numOfQuestions > 0 && this.numOfQuestions <= 10)) {
			this.numOfQuestions = await this.getNumberOfQuestions();
			if (this.numOfQuestions === undefined) return false;
		}
		if (!['easy', 'medium', 'hard'].includes(this.difficulty)) {
			this.difficulty = await this.getDifficulty();
			if (this.difficulty === undefined) return false;
		}
		this.channel.send(`You asked for ${this.numOfQuestions} questions of ${this.difficulty} difficulty.`);
		return true;
	},

	getQuizQuestions: async function() {
		return await axios.get(`https://opentdb.com/api.php?amount=${this.numOfQuestions}&category=15&difficulty=${this.difficulty}`);
		console.log(response.data.response_code);
	},

	isApiError: function (response) {
		return response.data['response_code'] !== 0;
	},

	parseFromApi: function(str) {
		return str.replace(/&quot;/g, '"').replace(/&#039;/g, '\'').replace(/&amp;/g, '&');
	},

	collectAnswers: function(question) {
		let allAnswers = question.incorrect_answers;
		allAnswers.push(question.correct_answer);
		allAnswers.sort((a, b) => 0.5 - Math.random());

		let answers = {};
		const letters = 'ABCD';
		for (const[i, answer] of allAnswers.entries()) {
			answers[letters[i]] = { 'text': this.parseFromApi(answer) };
			if (answer === question.correct_answer) {
				answers[letters[i]].correct = true;
			}
			else {
				answers[letters[i]].correct = false;

			}
		}
		return answers;
	},

	formatAnswers: function(answers) {
		let result = '';
		for (const answer in answers) {
			result = `${result} ${answer}: ${answers[answer].text}.\n`;
		}
		return result;
	}
};