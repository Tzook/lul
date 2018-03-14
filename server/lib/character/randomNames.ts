import * as faker from "faker";
import characterConfig from "./character.config";
import * as _ from 'underscore';
import talentsConfig from "../talents/talents.config";

const COMMON_PREFIXES = ["Lol", "Lel", "Kek", "Haha", "Hehe"];
const FEMALE_PREFIXES = ["Ms", "Mrs", "Miss", "Sexy", "Sakura", "Kitty", "Hot", "Lady"];
const MALE_PREFIXES = ["Mr", "Noob", "Dr", "Pro", "Sasuke", "Naruto", "Ninja"];

const COMMON_SUFFIXES = ["Jr", "Sr", "MD", "PhD", "V"];
const FEMALE_SUFFIXES = ["Girl", "Queen"];
const MALE_SUFFIXES = ["Boy", "King", "Boss"];

const LEET_LANG = {
    o: 0,
    i: 1,
    e: 3,
    a: 4,
    b: 8,
};

const DUPLICATION_LETTERS = ["u", "i", "y", "a", "o", "e"];

const WRAP_LETTERS = ["x", "v", "z", "w"];

const NAME_MODIFIERS = [
    {modifier: modifyAddPrefix, chance: 5},
    {modifier: modifyAddSuffix, chance: 7},
    {modifier: modifyReplaceMakeTypos, chance: 5},
    {modifier: modifyReplaceLowercase, chance: 4},
    {modifier: modifyReplaceLeet, chance: 3},
    {modifier: modifyAddDuplicateLetters, chance: 4},
    {modifier: modifyReplaceCapitalize, chance: 4},
    {modifier: modifyAddNumber, chance: 3},
    {modifier: modifyAddWrap, chance: 4},
];

export async function getRandomName(isMale) {
    let name = getBaseName(isMale).replace(/'/g, "");

    for (let {modifier, chance} of NAME_MODIFIERS) {
        if (faker.random.number(chance - 1) === 0) {
            name = modifier(name, isMale);
        }
    }

    return name;
}

function getMaleNumber(isMale: boolean): 0|1 {
    return isMale ? 1 : 0;
}

function getBaseName(isMale: boolean): string {
    const gender = getMaleNumber(isMale);
    const random = faker.random.number(2);
    switch (random) {
        case 0:default: return faker.name.firstName(gender);
        case 1: return faker.name.lastName(gender);
        case 2:
            const firstName = faker.name.firstName(gender);
            const lastName = faker.name.lastName(gender);
            const name = firstName + lastName;
            return name.length > characterConfig.MAX_NAME_LENGTH ? firstName : name;
    }
}

function modifyReplaceLowercase(name: string): string {
    return name.toLowerCase();
}

function modifyAddPrefix(name: string, isMale: boolean): string {
    let lengthAvailable = characterConfig.MAX_NAME_LENGTH - name.length;
    if (faker.random.boolean()) {
        const perk = faker.random.objectElement(talentsConfig.PERKS);
        const perkWords = perk.split(/(?=[A-Z])/);
        if (lengthAvailable >= perkWords[0].length) {
            return capitalizeFirstLetter(perkWords[0]) + name;
        }
    }
    if (faker.random.boolean()) {
        const color = faker.commerce.color();
        if (lengthAvailable >= color.length) {
            return capitalizeFirstLetter(color) + name;
        }
    }
    const prefixes = COMMON_PREFIXES.concat(isMale ? MALE_PREFIXES : FEMALE_PREFIXES).filter(prefix => prefix.length <= lengthAvailable);
    return (prefixes.length > 0 ? faker.random.arrayElement(prefixes) : "") + name;
}

function modifyAddSuffix(name: string, isMale: boolean): string {
    let lengthAvailable = characterConfig.MAX_NAME_LENGTH - name.length;
    const suffixes = COMMON_SUFFIXES.concat(isMale ? MALE_SUFFIXES : FEMALE_SUFFIXES).filter(suffix => suffix.length <= lengthAvailable);
    return name + (suffixes.length > 0 ? faker.random.arrayElement(suffixes) : "");
}

function modifyReplaceLeet(name: string): string {
    for (let letter in LEET_LANG) {
        if (faker.random.boolean()) {
            let regex = new RegExp(letter, faker.random.boolean() ? "g" : "");
            name = name.replace(regex, LEET_LANG[letter]);
        }
    }
    return name;
}

function modifyAddDuplicateLetters(name: string): string {
    let lengthAvailable = characterConfig.MAX_NAME_LENGTH - name.length;
    const duplicationLetters: string[] = _.shuffle(DUPLICATION_LETTERS);
    for (let letter of duplicationLetters) {
        if (lengthAvailable > 0 && faker.random.boolean()) {
            name = name.replace(letter, letter + letter);
            lengthAvailable = characterConfig.MAX_NAME_LENGTH - name.length;
        }
    }
    return name;
}

function modifyReplaceCapitalize(name: string): string {
    const times = faker.random.number({min: 1, max: 3});
    for (let i = 0; i < times; i++) {
        const place = faker.random.number(name.length - 1);
        name = name.replace(name[place], name[place].toUpperCase());
    }
    return name;
}

function modifyReplaceMakeTypos(name: string): string {
    const times = faker.random.number({min: 1, max: 2});
    for (let i = 0; i < times; i++) {
        const place = faker.random.number(name.length - 1);
        if (place > 0) {
            name = name.replace(name[place - 1] + name[place], name[place] + name[place - 1]);
        }
    }
    return name;
}

function modifyAddNumber(name: string): string {
    let lengthAvailable = characterConfig.MAX_NAME_LENGTH - name.length;

    switch (lengthAvailable) {
        case 0: return name;
        case 1: return name + faker.random.number(9);
        case 2: return name + (faker.random.number(9) === 0 ? 69 : faker.random.number(99));
        case 3: case 4:
            const random = faker.random.number(29);
            return name + (random > 6 ? faker.random.number(999) : 123 + random * 111);
        default: return name + faker.random.number(10 ** faker.random.number({min: 1, max: 5}) - 1);
    }
}

function modifyAddWrap(name: string): string {
    let lengthAvailable = characterConfig.MAX_NAME_LENGTH - name.length;
    const l = faker.random.arrayElement(WRAP_LETTERS);

    switch (lengthAvailable) {
        case 0: case 1: return name;
        case 2: case 3: return `${l}${name}${l}`;
        case 4: case 5: return `${l}${l}${name}${l}${l}`;

        default: case 6: case 7: 
            switch (faker.random.number(2)) {
                default: case 0: return `${l}${l.toUpperCase()}${l}${name}${l}${l.toUpperCase()}${l}`;
                case 1: return `${l}${l}${name}${l}${l}`;
                case 2: return `${l}${name}${l}`;
            }
    }
}

function capitalizeFirstLetter(word: string) {
    return word[0].toUpperCase() + word.slice(1);
}