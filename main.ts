import { GameState } from "./game/state";
import { applyAction, addPlayer } from "./game/engine";
import { ActionType } from "./game/actions";
import { Player } from "./game/player";
import { getHero } from "./db/heroes";

const player1 = new Player();
const player2 = new Player();

player1.setHero(getHero("jake")!.clone());
player2.setHero(getHero("finn")!.clone());

const game = new GameState();

function simulate() {
  console.log(game.toString());

  addPlayer(game, player1);
  addPlayer(game, player2);

  const action = {
    type: ActionType.END_TURN,
    player: game.currentPlayer,
  };

  applyAction(game, action);
}

for (let i = 0; i < 5; i++) {
  simulate();
}