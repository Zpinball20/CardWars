import { Player } from "./player"

export class GameState {
  turn: number;
  currentPlayer: number;
  players: Player[];
  winner: number | null;

  constructor() {
    this.turn = 0;
    this.currentPlayer = 0;
    this.players = [];
    this.winner = null;
  }

  toString(): string {
    return `Turn: ${this.turn}, Current Player: ${this.currentPlayer}`;
  }
}