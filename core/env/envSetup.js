const path = require('path');
const fse = require('fs-extra');

const { generateDatabase } = require('../database');
const { spinner, projectType, chalk } = require('../utils');

async function _envSetup(config, envType) {
	const databasePath = path.join(
		process.cwd(),
		'config',
		'env',
		`${envType.toLowerCase()}`,
		`database.${projectType()}`
	);

	try {
		await fse.outputFile(
			databasePath,
			(await generateDatabase(config)).toString()
		);
	} catch (error) {
		console.log(error);
	}
}

async function createEnv(config) {
	if (config.env.toLowerCase() === 'both') {
		await _envSetup(config, 'production');
		await _envSetup(config, 'development');
	}
	await _envSetup(config, config.env);
	await _cleanupFolders();

	spinner.stopAndPersist({
		symbol: '💾',
		text: ` Added ${chalk.bold.green(
			config.dbtype.toUpperCase()
		)} configuration to database.${projectType()} \n`
	});
}
async function _cleanupFolders() {
	// check if folder config/env/both exists if it does remove the directory and all files if not do nothing
	const envPath = path.join(process.cwd(), 'config', 'env', 'both');
	if (await fse.pathExists(envPath)) {
		await fse.remove(envPath);
	}
}

module.exports = createEnv;