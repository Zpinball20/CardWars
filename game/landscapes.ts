import { Card } from "./card";

export enum LandscapeType {
    BLUE_PLAINS = "BLUE PLAINS",
    CORNFIELDS = "CORNFIELDS",
    USELESS_SWAMP = "USELESS SWAMP",
    SANDYLANDS = "SANDYLANDS",
    NICELANDS = "NICELANDS",
    RAINBOW = "RAINBOW",
    ICY_LANDS = "ICY_LANDS"
}

export class Landscape {
    card: Card[]; // lane's are just a holder for entities, need support for multiple (gobblin)
    landscape?: LandscapeType;
    flipped: boolean;
    frozen: boolean;

    constructor(landscape: LandscapeType){
        this.card = []
        this.landscape = landscape;
        this.flipped = false;
        this.frozen = false;
    }
}