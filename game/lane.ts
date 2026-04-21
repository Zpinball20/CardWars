import {LandscapeType} from "./landscapes";
import {Card} from "./card";

export class Lane {
    cards: Card[]; // lane's are just a holder for entities, need support for multiple (gobblin)
    landscape: LandscapeType;
    flipped: boolean;

    constructor(landscp: LandscapeType){
        this.cards = [];
        this.landscape = landscp;
        this.flipped = false;
    }
}