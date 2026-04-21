import {LandscapeType} from "./landscapes";
import {Card} from "./card";

export class Lane {
    card?: Card[]; // lane's are just a holder for entities, need support for multiple (gobblin)
    landscape?: LandscapeType;
    flipped: boolean;

    constructor(landscape: LandscapeType){
        this.landscape = landscape;
        this.flipped = false;
    }
}