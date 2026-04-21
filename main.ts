import { GameState } from "./game/state";
import { applyAction } from "./game/engine";
import { ActionType } from "./game/actions";
import { Player } from "./game/player";
import { getHero } from "./db/heroes";
import { getCard } from "./db/cards";

console.log("getCard('cool_dog'):", getCard("cool_dog")?.name);
console.log("getCard('the_pig'):", getCard("the_pig")?.name);
console.log("getHero('jake'):", getHero("jake")?.name);

const player1 = new Player();
const player2 = new Player();

player1.setHero(getHero("jake")!.clone());
player2.setHero(getHero("finn")!.clone());

console.log("Player 1 lanes:", player1.lanes.map(l => l.landscape));
console.log("Player 2 lanes:", player2.lanes.map(l => l.landscape));

const game = new GameState();

function simulate() {
  console.log(game.toString());

  const action = {
    type: ActionType.END_TURN,
    player: game.currentPlayer,
  };

  applyAction(game, action);
}

for (let i = 0; i < 5; i++) {
  simulate();
}