import { Card } from "./card"
import {LandscapeType} from "./landscapes";

export class Hero {
    id: string;
    name: string;
    description?: string; // TODO: eventually will need a way to play the heroes action (maybe the same as a card's action?)
    deck?: Card[];
    landscapes: LandscapeType[];

    constructor(
        id: string,
        name: string,
        landscapes: LandscapeType[],
        description?: string,
        deck?: Card[]
    ) {
        this.id = id;
        this.name = name;
        this.landscapes = landscapes;
        this.description = description;
        this.deck = deck;
    }

    clone(): Hero {
        const clonedDeck = this.deck ? this.deck.map(card => new Card({
            id: card.id,
            name: card.name,
            cost: card.cost,
            type: card.type,
            landscape: card.landscape,
            attack: card.attack,
            health: card.health
        })) : undefined;

        return new Hero(
            this.id,
            this.name,
            [...this.landscapes],
            this.description,
            clonedDeck
        );
    }

}