import { GameState } from "./state";
import { Action, ActionType } from "./actions";

export function applyAction(state: GameState, action: Action): GameState {
  switch (action.type) {
    case ActionType.END_TURN:
      return endTurn(state, action.player);

    default:
      throw new Error("Unknown action type");
  }
}

function endTurn(state: GameState, player: number): GameState {
  if (player !== state.currentPlayer) {
    throw new Error("Not your turn");
  }

  state.currentPlayer = (state.currentPlayer + 1) % state.numPlayers;
  state.turn += 1;

  return state;
}