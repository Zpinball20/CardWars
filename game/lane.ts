import {LandscapeType} from "./landscapes";

export class Lane {
    entities?: number[]; // lane's are just a holder for entities, need support for multiple (gobblin)
    landscape?: LandscapeType;
    flipped: boolean;

    constructor(){
        this.entities = [];
        this.flipped = false;
    }
}