import { Card } from "./card"
import { Lane } from "./lane";
import {Hero} from "./hero";
import {LandscapeType} from "./landscapes";

export class Player {
    health: number;
    hand: Card[];
    deck: Card[];
    lanes: Lane[];
    hero: Hero;

    constructor(){
        this.health = 25;
        this.hand = [];
        this.deck = [];
        this.lanes = [{
            card: [], flipped: false
        }, {
            card: [], flipped: false
        }, {
            card: [], flipped: false
        }, {
            card: [], flipped: false
        }];
        this.hero = null!;
    }

    setHero(hero: Hero) {
        this.hero = hero;
        this.setLandscapeTypes(hero.landscapes);
    }

    setLandscapeTypes(types: LandscapeType[]) {
        for (let i = 0; i < this.lanes.length; i++) {
            this.lanes[i].landscape = types[i];
        }
    }
}