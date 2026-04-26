import { Hero } from "../game/hero";
import { LandscapeType } from "../game/landscapes";
import { getCard } from "./cards";
import * as fs from "fs";
import * as path from "path";

const heroesDir = path.join(process.cwd(), "db", "heroes");

function loadHeroes(): Hero[] {
  if (!fs.existsSync(heroesDir)) return [];

  const files = fs.readdirSync(heroesDir).filter(f => f.endsWith(".json"));
  return files.map(file => {
    const data = JSON.parse(fs.readFileSync(path.join(heroesDir, file), "utf-8"));
    const landscapes = (data.landscapes || []).map((l: string) => LandscapeType[l as keyof typeof LandscapeType] || LandscapeType.RAINBOW);
    const hero = new Hero(data.id, data.name, landscapes, data.description || "", []);
    
    if (data.deck) {
      for (const cardId of data.deck) {
        const card = getCard(cardId);
        if (card && hero.deck) {
          hero.deck.push(card);
        }
      }
    }
    
    return hero;
  });
}

export const HEROES: Hero[] = loadHeroes();

export function getHero(id: string): Hero | undefined {
  return HEROES.find(hero => hero.id === id);
}