'use strict';
import MasterController from '../master/master.controller';

export default class PartyController extends MasterController {
    private partyToChars: Map<string, string[]> = new Map();
    private charToParty: Map<string, string> = new Map();

};