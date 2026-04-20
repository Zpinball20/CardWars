# state.py

class GameState:
    def __init__(self, num_players=2):
        self.turn = 0
        self.current_player = 0
        self.num_players = num_players
        self.winner = None

    def __str__(self):
        return f"Turn: {self.turn}, Current Player: {self.current_player}"