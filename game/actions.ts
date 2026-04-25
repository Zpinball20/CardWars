import { Card } from "./card";
import { Landscape } from "./landscapes";

export enum ActionType {
  PLAY_CARD = "PLAY_CARD",
  RETURN_CARD = "RETURN_CARD",
  MOVE_CARD = "MOVE_CARD",
  FREEZE_LANDSCAPE = "FREEZE_LANDSCAPE",
  FLOOP = "FLOOP",
  START_ATTACK = "START_ATTACK",
  ATTACK_LANE = "ATTACK_LANE",
  END_START = "END_START",
  END_TURN = "END_TURN"
}

export interface Action {
  type: ActionType;
  player: number;
  card?: Card
  landscape?: number
}