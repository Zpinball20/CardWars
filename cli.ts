import * as readline from "readline";
import { applyAction } from "./game/engine";
import { GameState } from "./game/state";
import { ActionType } from "./game/actions";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}