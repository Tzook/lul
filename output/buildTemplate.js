'use strict';
/**
 * A script that generates the structure of the app.
 * It uses the structure.json file in lib, and does:
 * 1 - creates the directories from there if they don't exist
 * 2 - creates in the directory the files from template folder
 * To use, simply run "node buildTemplate"
 */
let fs = require('fs');
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
        }
        catch (e) {
            fs.mkdirSync(folderName); // create the folder
        }
        // create files if they don't exist
        for (let j = 0; j < structure[k].length; j++) {
            let fileName = `${folderName}/${structure.folders[i]}.${structure[k][j]}${ext}`;
            try {
                fs.statSync(fileName); // try to open the file
            }
            catch (e) {
                let upperName = structure.folders[i][0].toUpperCase() + structure.folders[i].slice(1); // Template
                let newContent = templates[j].replace(/Template/g, upperName); // replace Template with the package name camelcase
                newContent = newContent.replace(/template/g, structure.folders[i]); // replace template with the package name lowercase
                fs.writeFileSync(fileName, newContent); // create the new file
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRUZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NlcnZlci9idWlsZFRlbXBsYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiOzs7Ozs7R0FNRztBQUNILElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2QixJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQUMxRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQzFCLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDWCxLQUFLLFdBQVc7WUFDZixHQUFHLEdBQUcsS0FBSyxDQUFDO1lBQ1osR0FBRyxHQUFHLEtBQUssQ0FBQztZQUNaLEtBQUssQ0FBQztRQUNQLEtBQUssU0FBUztZQUNiLEdBQUcsR0FBRyxLQUFLLENBQUM7WUFDWixHQUFHLEdBQUcsT0FBTyxDQUFDO1lBQ2QsS0FBSyxDQUFDO1FBQ1AsS0FBSyxPQUFPO1lBQ1gsR0FBRyxHQUFHLE9BQU8sQ0FBQztZQUNkLEdBQUcsR0FBRyxVQUFVLENBQUM7WUFDakIsS0FBSyxDQUFDO1FBQ1AsS0FBSyxPQUFPO1lBQ1gsR0FBRyxHQUFHLE9BQU8sQ0FBQztZQUNkLEdBQUcsR0FBRyxVQUFVLENBQUM7WUFDakIsTUFBTSxHQUFHLFFBQVEsQ0FBQztZQUNsQixLQUFLLENBQUM7SUFDUixDQUFDO0lBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ1YsUUFBUSxDQUFDO0lBQ1YsQ0FBQztJQUNELElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUNuQixpQkFBaUI7SUFDakIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDOUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsR0FBRyxTQUFTLGFBQWEsR0FBRyxHQUFHLE1BQU0sSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUcsQ0FBQztJQUNELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzlELGtDQUFrQztRQUNsQyxJQUFJLFVBQVUsR0FBRyxHQUFHLFNBQVMsSUFBSSxHQUFHLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQztRQUN4RSxJQUFJLENBQUM7WUFDSixFQUFFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMscUJBQXFCO1FBQy9DLENBQUU7UUFBQSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1osRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLG9CQUFvQjtRQUMvQyxDQUFDO1FBQ0QsbUNBQW1DO1FBQ25DLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzlDLElBQUksUUFBUSxHQUFHLEdBQUcsVUFBVSxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ2hGLElBQUksQ0FBQztnQkFDSixFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsdUJBQXVCO1lBQy9DLENBQUU7WUFBQSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNaLElBQUksU0FBUyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXO2dCQUNsRyxJQUFJLFVBQVUsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLG1EQUFtRDtnQkFDbEgsVUFBVSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLG1EQUFtRDtnQkFDdkgsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxzQkFBc0I7WUFDL0QsQ0FBQztRQUNGLENBQUM7SUFDRixDQUFDO0FBQ0YsQ0FBQyJ9