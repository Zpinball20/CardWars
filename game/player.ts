import { Card } from "./card"

export class Player {
    health: number;
    hand: Card[];

    constructor(){
        this.health = 25;
        this.hand = [];
    }
}