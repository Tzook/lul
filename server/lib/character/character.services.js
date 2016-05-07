'use strict';
let ServicesBase = require('../master/master.services.js');

/**
 * Character's services
 */
class CharacterServices extends ServicesBase {
	saveNewCharacter(user, character) {
		return new Promise((resolve, reject) => {
			user.characters.push(new this.Model(character));
			user.save(e => { // TODO update to es6 promise when mongoose updates to v5
				e ? reject(e) : resolve(user);
			});
		});
	}
	
	convertToFormat(data) {
		return Promise.resolve({
			name: data.name,
			looks: {
				g: data.g,
				hair: {
					sprite: data.hairSprite,
					color: data.hairColor
				},
				eyes: data.eyes,
				nose: data.nose,
				mouth: data.mouth,
				skin: data.skin
			}
		});
	}
	checkIsNameUnique(name, error) {
		return new Promise((resolve, reject) => {
			this.getCharacter(name)
			.then(d => {
				d ? reject(error) : resolve();
			})
			.catch(e => {
				reject(e);
			});
		});
	}
	
    /**
     * Gets a character from the database by name
     * @param {String} name
     * @returns Promise
     */
    getCharacter(name) {
        return this.Q.ninvoke(this.mongoose.model('User'), 'findOne', {'characters.name': name});
    }
}

module.exports = CharacterServices;