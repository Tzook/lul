
import MasterServices from '../master/master.services';
import { getServices } from '../main/bootstrap';

export default class CharacterServices extends MasterServices {

	saveNewCharacter(user, character) {
		return new Promise((resolve, reject) => {
			user.characters.push(character);
			user.save(e => {
				e ? reject(e) : resolve(user);
			});
		});
	}

	deleteCharacter(user, id) {
		return new Promise((resolve, reject) => {
			var newArray  = [];
			for (var i = 0; i < user.characters.length; i++) {
				if (!user.characters[i]._id.equals(id)) {
					newArray.push(user.characters[i]);
				}
			}
			user.characters = newArray;
			user.save(e => {
				e ? reject(e) : resolve(user);
			});
		});
	}

	convertToFormat(data) {
		let character: Char = new this.Model({
			name: data.name,
			looks: {
				g: data.g,
				eyes: data.eyes,
				nose: data.nose,
				mouth: data.mouth,
				skin: data.skin,
				hair: data.hair
			}
		});
		this.model.addFields(character, data);
		return Promise.resolve(character);
	}

    getCharacter(name) {
        return this.Q.ninvoke(this.mongoose.model('User'), 'findOne', {'characters.name': name});
    }
};

export function getCharacterServices(): CharacterServices {
    return getServices("character");
}

export function getCharacterUser(name: string): Promise<User> {
	return getCharacterServices().getCharacter(name);
}

export function checkIsNameUnique(name, error) {
	return new Promise((resolve, reject) => {
		getCharacterUser(name)
		.then(d => {
			d ? reject(error) : resolve();
		})
		.catch(e => {
			reject(e);
		});
	});
}