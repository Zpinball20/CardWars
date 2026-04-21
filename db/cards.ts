import { Card, CardType } from "../game/card";
import { LandscapeType } from "../game/landscapes";

export const CARDS: Card[] = [
    new Card({
        id: "cool_dog",
        name: "Cool Dog",
        cost: 2,
        type: CardType.CREATURE,
        landscape: LandscapeType.BLUE_PLAINS,
        attack: 2,
        health: 7
    }),
    new Card({
        id: "ancient_scholar",
        name: "Ancient Scholar",
        cost: 3,
        type: CardType.CREATURE,
        landscape: LandscapeType.BLUE_PLAINS,
        attack: 1,
        health: 7
    }),
    new Card({
        id: "the_pig",
        name: "The Pig",
        cost: 1,
        type: CardType.CREATURE,
        landscape: LandscapeType.CORNFIELDS,
        attack: 1,
        health: 4
    }),
];

export function getCard(id: string): Card | undefined {
    return CARDS.find(card => card.id === id);
}