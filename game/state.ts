export class GameState {
  turn: number;
  currentPlayer: number;
  numPlayers: number;
  winner: number | null;

  constructor(numPlayers: number = 2) {
    this.turn = 0;
    this.currentPlayer = 0;
    this.numPlayers = numPlayers;
    this.winner = null;
  }

  toString(): string {
    return `Turn: ${this.turn}, Current Player: ${this.currentPlayer}`;
  }
}