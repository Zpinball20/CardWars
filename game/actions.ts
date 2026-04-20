import { Card } from "./card";

export enum ActionType {
  END_TURN = "END_TURN",
  PLAY_CARD = "PLAY_CARD"
}

export interface Action {
  type: ActionType;
  player: number;
  card?: Card
}