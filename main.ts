import { GameState } from "./game/state";
import { applyAction } from "./game/engine";
import { ActionType } from "./game/actions";

const game = new GameState();

function simulate() {
  console.log(game.toString());

  const action = {
    type: ActionType.END_TURN,
    player: game.currentPlayer,
  };

  applyAction(game, action);
}

// simulate a few turns
for (let i = 0; i < 5; i++) {
  simulate();
}