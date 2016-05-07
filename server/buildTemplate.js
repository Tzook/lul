'use strict';
/**
 * A script that generates the structure of the app.
 * It uses the structure.json file in lib, and does: 
 * 1 - creates the directories from there if they don't exist
 * 2 - creates in the directory the files from template folder 
 * To use, simply run "node buildTemplate"
 */
let fs	= require('fs');
let structure = require('./config/config.structure.json');
for (let k in structure) {
	let dir, ext, isMock = '';
	switch (k) {
		case "templates": 
			dir = "lib";
			ext = ".js";
			break;
		case "configs": 
			dir = "lib";
			ext = ".json";
			break;
		case "tests": 
			dir = "tests";
			ext = ".spec.js";
			break;
		case "mocks": 
			dir = "tests";
			ext = ".mock.js";
			isMock = "/mocks";
			break;
	}
	if (!dir) {
		continue;
	}
	let templates = [];
	// load templates
	for (let j = 0; j < structure[k].length; j++) {
		templates[j] = fs.readFileSync(`${__dirname}/template/${dir}${isMock}/${structure[k][j]}${ext}`, 'utf8');
	}
	for (let i = 0, len = structure.folders.length; i < len; i++) {
		// create folder if does not exist
		let folderName = `${__dirname}/${dir}/${structure.folders[i]}${isMock}`;
		try {
			fs.statSync(folderName); // try to open folder
		} catch (e) { // failed to open a folder - does not exist
			fs.mkdirSync(folderName); // create the folder
		}
		// create files if they don't exist
		for (let j = 0; j < structure[k].length; j++) {
			let fileName = `${folderName}/${structure.folders[i]}.${structure[k][j]}${ext}`;
			try {
				fs.statSync(fileName); // try to open the file
			} catch (e) { // failed to open the file - it does not exist so create one
				let upperName = structure.folders[i][0].toUpperCase() + structure.folders[i].slice(1); // Template
				let newContent = templates[j].replace(/Template/g, upperName); // replace Template with the package name camelcase
				newContent = newContent.replace(/template/g, structure.folders[i]); // replace template with the package name lowercase
				fs.writeFileSync(fileName, newContent); // create the new file
			}
		}
	}
}