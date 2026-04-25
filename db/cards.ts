import { Card, CardType } from "../game/card";
import { LandscapeType } from "../game/landscapes";
import * as fs from "fs";
import * as path from "path";

const cardsDir = path.join(process.cwd(), "db", "cards");

function loadCards(): Card[] {
  if (!fs.existsSync(cardsDir)) return [];
  
  const files = fs.readdirSync(cardsDir).filter(f => f.endsWith(".json"));
  return files.map(file => {
    const data = JSON.parse(fs.readFileSync(path.join(cardsDir, file), "utf-8"));
    return new Card({
      id: data.id,
      name: data.name,
      cost: data.cost,
      type: data.type as CardType,
      landscape: data.landscape as LandscapeType,
      attack: data.attack,
      health: data.health,
      description: data.description
    });
  });
}

export const CARDS: Card[] = loadCards();

export function getCard(id: string): Card | undefined {
    return CARDS.find(card => card.id === id);
}