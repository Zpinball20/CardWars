import { Player } from "./player"
import { World } from "../ecs/core";

export enum turnPhase{
  TURN_START = "TURN_START",
  MAIN_PHASE = "MAIN_PHASE",
  ATTACK_PHASE = "ATTACK_PHASE"
}

export class GameState {
  turn: number;
  currentPlayer: number;
  players: Player[];
  winner: number | null;
  turnPhase: turnPhase
  world: World;

  constructor() {
    this.turn = 0;
    this.currentPlayer = 0;
    this.players = [];
    this.winner = null;
    this.turnPhase = turnPhase.TURN_START;
    this.world = new World();
  }

  toString(): string {
    return `Turn: ${this.turn}, Current Player: ${this.currentPlayer}`;
  }
}