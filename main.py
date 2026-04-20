# main.py
from game import actions
from game import engine
from game import state

def main():
    game = state.GameState()

    while True:
        print(game)

        user_input = input("Type 'end' to end turn: ")

        if user_input == "end":
            action = {
                "type": actions.END_TURN,
                "player": game.current_player
            }

            engine.apply_action(game, action)


if __name__ == "__main__":
    main()