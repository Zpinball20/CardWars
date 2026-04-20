export enum ActionType {
  END_TURN = "END_TURN",
}

export interface Action {
  type: ActionType;
  player: number;
}