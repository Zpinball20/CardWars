import express from 'express';
import cors from 'cors';
import { GameState } from './game/state';
import { applyAction, addPlayer } from './game/engine';
import { ActionType } from './game/actions';
import { Player } from './game/player';
import { getHero } from './db/heroes';
import { Card } from './game/card';

const app = express();
app.use(cors());
app.use(express.json());

const games = new Map<string, GameState>();
let gameCounter = 0;

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createGame(player1Hero: string, player2Hero: string): string {
  const gameId = `game_${gameCounter++}`;
  const game = new GameState();
  
  const p1 = new Player();
  const p2 = new Player();
  
  const hero1 = getHero(player1Hero)!.clone();
  const hero2 = getHero(player2Hero)!.clone();
  
  p1.setHero(hero1);
  p2.setHero(hero2);
  
  p1.deck = shuffle(hero1.deck);
  p2.deck = shuffle(hero2.deck);
  
  drawCards(p1, 5);
  drawCards(p2, 5);
  
  addPlayer(game, p1);
  addPlayer(game, p2);
  
  games.set(gameId, game);
  return gameId;
}

function serializeGame(game: GameState) {
  return {
    turn: game.turn,
    currentPlayer: game.currentPlayer,
    winner: game.winner,
    turnPhase: game.turnPhase,
    players: game.players.map((p, i) => ({
      id: i,
      health: p.health,
      hand: p.hand.map((c: Card) => ({
        id: c.id,
        name: c.name,
        cost: c.cost,
        type: c.type,
        attack: c.attack,
        health: c.health,
        description: c.description,
      })),
      landscapes: p.landscapes.map((l, laneIndex) => ({
        laneIndex,
        card: l.card[0] ? {
          id: l.card[0].id,
          name: l.card[0].name,
          attack: l.card[0].attack,
          health: l.card[0].health,
          exhausted: l.card[0].exhausted,
        } : null,
        landscape: l.landscape,
        flipped: l.flipped,
      })),
    })),
  };
}

app.post('/api/games', (req, res) => {
  const { player1Hero = 'finn', player2Hero = 'jake' } = req.body;
  const gameId = createGame(player1Hero, player2Hero);
  const game = games.get(gameId)!;
  res.json({ gameId, game: serializeGame(game) });
});

app.get('/api/games/:gameId', (req, res) => {
  const { gameId } = req.params;
  const game = games.get(gameId);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  res.json(serializeGame(game));
});

app.post('/api/games/:gameId/play-card', (req, res) => {
  const { gameId } = req.params;
  const { player, cardId, landscape } = req.body;
  
  const game = games.get(gameId);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  
  const card = game.players[player].hand.find((c: Card) => c.id === cardId);
  if (!card) {
    return res.status(400).json({ error: 'Card not in hand' });
  }
  
  try {
    applyAction(game, {
      type: ActionType.PLAY_CARD,
      player,
      card,
      landscape,
    });
    res.json(serializeGame(game));
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/games/:gameId/end-turn', (req, res) => {
  const { gameId } = req.params;
  const { player } = req.body;
  
  const game = games.get(gameId);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  
  try {
    applyAction(game, { type: ActionType.END_TURN, player });
    res.json(serializeGame(game));
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/games/:gameId/end-start', (req, res) => {
  const { gameId } = req.params;
  const { player } = req.body;
  
  const game = games.get(gameId);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  
  try {
    applyAction(game, { type: ActionType.END_START, player });
    res.json(serializeGame(game));
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/games/:gameId/attack', (req, res) => {
  const { gameId } = req.params;
  const { player, landscape } = req.body;
  
  const game = games.get(gameId);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  
  try {
    applyAction(game, { type: ActionType.START_ATTACK, player });
    if (landscape !== undefined) {
      applyAction(game, { type: ActionType.ATTACK_LANE, player, landscape });
    }
    res.json(serializeGame(game));
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;