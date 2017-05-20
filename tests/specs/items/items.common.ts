import { browser } from 'protractor/built';
import { expectText, getChat } from '../common';

export function pickItem() {
    getItemId().then(itemId => {
        browser.executeScript(`socket.emit("picked_item", {item_id: "${itemId}"});`)
        expectText("actor_pick_item");
    });
}

export function getItemId() {
    return getChat().then(chat => {
        let [, itemId] = chat.match(/"item_id": "([0-9]*)"/);
        return itemId;
    });
}