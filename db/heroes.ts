import { Hero } from "../game/hero";
import { LandscapeType } from "../game/landscapes";
import { CARDS } from "./cards";

export const HEROES: Hero[] = [
    new Hero(
        "finn",
        "Finn",
        [
            LandscapeType.BLUE_PLAINS,
            LandscapeType.BLUE_PLAINS,
            LandscapeType.BLUE_PLAINS,
            LandscapeType.BLUE_PLAINS
        ],
        "",
        [CARDS[0], // Cool Dog
            CARDS[1]] // Ancient Scholar
    ),
    new Hero(
        "jake",
        "Jake",
        [
            LandscapeType.CORNFIELDS,
            LandscapeType.CORNFIELDS,
            LandscapeType.CORNFIELDS,
            LandscapeType.CORNFIELDS
        ],
        "",
        [CARDS[2]] // The Pig
    ),
];

export function getHero(id: string): Hero | undefined {
    return HEROES.find(hero => hero.id === id);
}