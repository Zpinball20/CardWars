import { GameState, turnPhase } from "./state";
import { Action, ActionType } from "./actions";
import { Card } from "./card";
import { Player } from "./player";
import { GameEvent, eventBus } from "../ecs/events";
import { HeroAbilitySystem, EnterPlaySystem } from "../ecs/systems";
import { CardFactory } from "./factory";

export function addPlayer(state: GameState, player: Player): GameState {
  state.players.push(player);

  return state;
}

export function applyAction(state: GameState, action: Action): GameState {
  switch (action.type) {
    case ActionType.END_START:
      return endStartOfTurn(state, action.player);

    case ActionType.PLAY_CARD:
      if (!action.card) throw new Error("No card provided");
      if (action.landscape === undefined) throw new Error("No landscape provided");
      return playCard(state, action.player, action.card, action.landscape);

    case ActionType.START_ATTACK:
      return startAttackPhase(state, action.player);

    case ActionType.ATTACK_LANE:
      if (action.landscape === undefined) throw new Error("No landscape selected");
      return attackLane(state, action.player, action.landscape);

    case ActionType.END_TURN:
      return endTurn(state, action.player);

    default:
      throw new Error("Unknown action");
  }
}

function endStartOfTurn(state: GameState, player: number): GameState{
  if (player !== state.currentPlayer) {
    throw new Error("Not your turn");
  }
  if (state.turnPhase !== turnPhase.TURN_START) throw new Error("Wrong phase");

  state.turnPhase = turnPhase.MAIN_PHASE

  // Trigger turn start event for ECS
  eventBus.publish(GameEvent.TURN_START, { playerId: player, turn: state.turn });

  return state
}

function startAttackPhase(state: GameState, player: number): GameState{
  if (player !== state.currentPlayer) {
    throw new Error("Not your turn");
  }
  if (state.turnPhase !== turnPhase.MAIN_PHASE) throw new Error("Wrong phase");

  state.turnPhase = turnPhase.ATTACK_PHASE
  return state
}

function getOpposingPlayer(state: GameState, player: number, laneIndex: number): number {
  const numPlayers = state.players.length;

  if (laneIndex === 0 || laneIndex === 1) {
    // next player (wrap around)
    return (player + 1) % numPlayers;
  }

  if (laneIndex === 2 || laneIndex === 3) {
    // previous player (wrap around)
    return (player - 1 + numPlayers) % numPlayers;
  }

  throw new Error("Invalid lane index");
}

//Ending the turn
function endTurn(state: GameState, player: number): GameState {
  if (player !== state.currentPlayer) {
    throw new Error("Not your turn");
  }

  state.currentPlayer = (state.currentPlayer + 1) % state.players.length;
  state.turn += 1;

  state.turnPhase = turnPhase.TURN_START;

  // Trigger ECS hero abilities
  new HeroAbilitySystem(state.world).update();

  return state;
}

//Playing a card
function playCard(state: GameState, player: number, card: Card, landscape: number): GameState {
    if(player != state.currentPlayer){
      throw new Error("Not your turn");
    }
    if (state.turnPhase !== turnPhase.MAIN_PHASE) throw new Error("Wrong phase");

    //search for card in player's hand
    const currPlayer = state.players[player]
    const index = currPlayer.hand.findIndex(c => c.id === card.id);
      if (index === -1) {
        throw new Error("Card not in hand");
      }

    const selectedCard = currPlayer.hand[index]

    if(landscape < 0 || landscape > 3){
      throw new Error("Landscape does not exist!")
    }

    currPlayer.landscapes[landscape].card[0] = selectedCard

    //remove card from hand after playing 
    currPlayer.hand.splice(index, 1);

    // Also create in ECS
    const factory = new CardFactory(state.world);
    const entity = factory.createFromJSON(card.id, player, landscape);

    // Trigger card played event
    eventBus.publish(GameEvent.CARD_PLAYED, {
      entity,
      playerId: player,
      laneIndex: landscape,
      cardId: card.id
    });

    // Handle enter play triggers
    new EnterPlaySystem(state.world).handle(entity);

    return state;
}

function attackLane(state: GameState, player: number, lane: number): GameState {
  if (player !== state.currentPlayer) throw new Error("Not your turn");
  if (state.turnPhase !== turnPhase.ATTACK_PHASE) throw new Error("Wrong phase");

  const currPlayer = state.players[player];
  const attacker = currPlayer.landscapes[lane].card[0];
  if (!attacker) throw new Error("No card in lane");
  if (attacker.exhausted == true) throw new Error("Card is exhausted!");

  const opponentIndex = getOpposingPlayer(state, player, lane);
  const opponent = state.players[opponentIndex];

  const opposingLane = 3 - lane;
  const defender = opponent.landscapes[opposingLane].card[0];

  if (defender) {
    attacker.health! -= defender.attack!;
    defender.health! -= attacker.attack!;
  } else {
    opponent.health -= attacker.attack!;
  }

  attacker.exhausted = true

  // cleanup
  if (attacker.health! <= 0){
    currPlayer.landscapes[lane].card.splice(0, 1);
  }

  if (defender && defender.health! <= 0) {
    opponent.landscapes[opposingLane].card.splice(0, 1);
  }

  return state;
}