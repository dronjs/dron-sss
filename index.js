var fs = require('fs');
var path = require('path');
var deployTemplate = require.resolve(path.join(__dirname, 'template/deploy.js'));
/**
 Dron module `dron-vss`*
*/
function finishDialog() {
	return this.run('confirm', {
		question: 'Wanna to run server now?'
	}).then((answer) => {
		if (answer) {
			this.spawn('node', ['deploy.js']);
			return true;
		} else {
			return true;
		}
	});
}

function writeDeployer(config) {
	return function() {
		var deployFile = this.touch('deploy.js');
		deployFile.safeWrite(this.touch(deployTemplate).ejs(config));
		return finishDialog;
	}
}

function dronVss() {
	return this.run('prompt', {
		questions: [
			{
				name: 'defaultPort',
				type: 'string',
				message: 'What is default server port u like?',
				default: '1234'
			}
		]
	}).then((answers) => {
		if (isNaN(answers.defaultPort)) {
			this.warn('Port must be a number between 1 and 9999');
			return dronVss;
		} else {
			return writeDeployer(answers);
		}
	});
}

module.exports = function factory(argv) {
	return dronVss;
}
