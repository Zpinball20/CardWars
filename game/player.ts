import { Card } from "./card"
import { Landscape, LandscapeType } from "./landscapes";
import {Hero} from "./hero";

export class Player {
    health: number;
    hand: Card[];
    deck: Card[];
    landscapes: Landscape[];
    hero: Hero;

    constructor(){
        this.health = 25;
        this.hand = [];
        this.deck = [];
        this.landscapes = [{
            card: [], flipped: false, frozen: false
        }, {
            card: [], flipped: false, frozen: false
        }, {
            card: [], flipped: false, frozen: false
        }, {
            card: [], flipped: false, frozen: false
        }];
        this.hero = null!;
    }

    setHero(hero: Hero) {
        this.hero = hero;
        this.setLandscapeTypes(hero.landscapes);
    }

    setLandscapeTypes(types: LandscapeType[]) {
        for (let i = 0; i < this.landscapes.length; i++) {
            this.landscapes[i].landscape = types[i];
        }
    }
}