# engine.py

def apply_action(state, action):
    action_type = action.get("type")
    player = action.get("player")

    if action_type == "END_TURN":
        return _end_turn(state, player)

    raise ValueError("Unknown action")


def _end_turn(state, player):
    if player != state.current_player:
        raise Exception("Not your turn")

    state.current_player = (state.current_player + 1) % state.num_players
    state.turn += 1

    return state