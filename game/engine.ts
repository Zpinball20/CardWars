import { GameState } from "./state";
import { Action, ActionType } from "./actions";
import { CardType, Card } from "./card";
import { Player } from "./player";

export function addPlayer(state: GameState, player: Player): GameState {
  state.players.push(player);

  return state;
}

export function applyAction(state: GameState, action: Action): GameState {
  switch (action.type) {
    case ActionType.END_TURN:
      return endTurn(state, action.player);
    case ActionType.PLAY_CARD:
      if (!action.card) {
      throw new Error("No card provided for PLAY_CARD");
    }
      return playCard(state, action.player, action.card);

    default:
      throw new Error("Unknown action type");
  }
}

function attack(state: GameState, player: number): GameState {
  if (player !== state.currentPlayer) {
    throw new Error("Not your turn");
  }

  const currPlayer = state.players[player]

  for(let i = 0; i < currPlayer.landscapes.length; i++){
    if(currPlayer.landscapes[i].card[0]){
      //attack logic
    }
  }


  return state
}

//Ending the turn
function endTurn(state: GameState, player: number): GameState {
  if (player !== state.currentPlayer) {
    throw new Error("Not your turn");
  }

  state.currentPlayer = (state.currentPlayer + 1) % state.players.length;
  state.turn += 1;

  return state;
}

//Playing a card
function playCard(state: GameState, player: number, card: Card): GameState {
    if(player != state.currentPlayer){
      throw new Error("Not your turn");
    }

    //search for card in player's hand
    const currPlayer = state.players[player]
    const index = currPlayer.hand.findIndex(c => c.id === card.id);
      if (index === -1) {
        throw new Error("Card not in hand");
      }

    const selectedCard = currPlayer.hand[index]

    currPlayer.landscapes[0].card[0] = selectedCard
    
    //remove card from hand after playing 
    currPlayer.hand.splice(index, 1);

    //TODO Card Logic
    if(card.type == CardType.CREATURE){
      //logic
    }
    else if(card.type == CardType.SPELL)
    {
      //logic
    }
    else if(card.type == CardType.BUILDING)
    {
      //logic
    }
    else
    {
      throw new Error("Card type is invalid")
    }

    return state;
}