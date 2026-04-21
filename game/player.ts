import { Card } from "./card"
import {Lane} from "./lane";

export class Player {
    health: number;
    hand: Card[];
    lanes: Lane[]

    constructor(){
        this.health = 25;
        this.hand = [];
        this.lanes = [{
            flipped: false
        }, {
            flipped: false
        }, {
            flipped: false
        }, {
            flipped: false
        }];
    }
}