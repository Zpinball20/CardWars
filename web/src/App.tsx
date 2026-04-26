import { useState, useEffect } from 'react'

interface Card {
  id: string
  name: string
  cost: number
  type: string
  attack: number
  health: number
  description?: string
  hasTurnStart?: boolean
}

interface Landscape {
  laneIndex: number
  card: {
    id: string
    name: string
    attack: number
    health: number
    exhausted: boolean
  } | null
  landscape: string
  flipped: boolean
}

interface Player {
  id: number
  health: number
  hand: Card[]
  landscapes: Landscape[]
}

interface Game {
  turn: number
  currentPlayer: number
  winner: number | null
  turnPhase: string
  players: Player[]
}

function getCardImage(cardId: string): string {
  const name = cardId.toLowerCase() + '.png'
  return `/textures/cards/${name}`
}

function getHeroImage(heroId: string): string {
  return `/textures/heroes/${heroId}.png`
}

function getLandscapeImage(landscape: string, laneIndex: number): string {
  const base = landscape.toLowerCase().replace(/ /g, '')
  const num = (laneIndex % 4) + 1
  return `/textures/landscapes/${base}${num}.png`
}

function App() {
  const [gameId, setGameId] = useState<string | null>(null)
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [selectedAttacker, setSelectedAttacker] = useState<number | null>(null)

  const startGame = async () => {
    setLoading(true)
    setError(null)
    setGame(null)
    setGameId(null)
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player1Hero: 'finn', player2Hero: 'jake' }),
      })
      const data = await res.json()
      console.log('Game created:', data.gameId, 'Hand:', data.game.players[0].hand.map((c: Card) => c.id))
      setGameId(data.gameId)
      setGame(data.game)
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }

  const refreshGame = async () => {
    if (!gameId) return
    try {
      const res = await fetch(`/api/games/${gameId}`)
      if (!res.ok) {
        console.log('Game not found, clearing...')
        setGame(null)
        setGameId(null)
        return
      }
      const data = await res.json()
      if (!data.players || !data.players[0]) {
        console.log('Invalid game data', data)
        return
      }
      setGame(data)
    } catch (e: any) {
      console.error('Refresh error:', e)
    }
  }

  const playCard = async (cardIndex: number, landscape: number) => {
    if (!gameId || !game?.players?.[game.currentPlayer]?.hand?.[cardIndex]) return
    const cardId = game.players[game.currentPlayer].hand[cardIndex].id
    console.log('Click playCard:', { cardIndex, landscape, cardId, currentPlayer: game.currentPlayer })
    setLoading(true)
    try {
      const res = await fetch(`/api/games/${gameId}/play-card`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player: game!.currentPlayer,
          cardId,
          landscape,
        }),
      })
      const text = await res.text()
      console.log('Play card response:', res.status, text)
      if (!res.ok) {
        setError(`Error ${res.status}: ${text}`)
      } else {
        const data = JSON.parse(text)
        if (data.error) {
          setError(data.error)
        } else {
          setGame(data)
          setSelectedCard(null)
        }
      }
    } catch (e: any) {
      console.error('Play card error:', e)
      setError(e.message)
    }
    setLoading(false)
  }

  const endTurn = async () => {
    if (!gameId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/games/${gameId}/end-turn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player: game!.currentPlayer }),
      })
      const data = await res.json()
      setGame(data)
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }

  const startAttack = async () => {
    if (!gameId || !game) return
    console.log('startAttack called:', { currentPlayer: game.currentPlayer, turnPhase: game.turnPhase })
    setLoading(true)
    try {
      const res = await fetch(`/api/games/${gameId}/attack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player: game.currentPlayer }),
      })
      const text = await res.text()
      console.log('StartAttack response:', res.status, text)
      if (!res.ok) {
        setError(`Error ${res.status}: ${text}`)
      } else {
        setGame(JSON.parse(text))
      }
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }

  const attackLane = async (laneIndex: number) => {
    if (!gameId || !game || selectedAttacker === null) return
    console.log('attackLane called:', { laneIndex, attackerLane: selectedAttacker, currentPlayer: game.currentPlayer, turnPhase: game.turnPhase })
    setLoading(true)
    try {
      const res = await fetch(`/api/games/${gameId}/attack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player: game.currentPlayer, attackerLane: selectedAttacker, targetLane: laneIndex }),
      })
      const text = await res.text()
      console.log('Attack response:', res.status, text)
      if (!res.ok) {
        setError(`Error ${res.status}: ${text}`)
      } else {
        setGame(JSON.parse(text))
        setSelectedAttacker(null)
      }
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }

  const endStart = async () => {
    if (!gameId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/games/${gameId}/end-start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player: game!.currentPlayer }),
      })
      const data = await res.json()
      setGame(data)
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (game && game.turnPhase === 'TURN_START') {
      const currentHand = game.players[game.currentPlayer].hand
      const hasTurnStartCard = currentHand.some((c: Card) => c.hasTurnStart)
      if (!hasTurnStartCard) {
        endStart()
      }
    } else if (game) {
      const interval = setInterval(refreshGame, 2000)
      return () => clearInterval(interval)
    }
  }, [gameId, game?.turnPhase])

  if (!game) {
    return (
      <div className="app">
        <div className="start-screen">
          <h1>Card Wars</h1>
          {error && <p style={{ color: '#e74c3c' }}>{error}</p>}
          <button className="primary" onClick={startGame} disabled={loading}>
            {loading ? 'Loading...' : 'Start Game'}
          </button>
        </div>
      </div>
    )
  }

  if (!game || !game.players || !game.players[0]) {
    return (
      <div className="app">
        <div className="start-screen">
          <p>Loading game...</p>
        </div>
      </div>
    )
  }

  const currentPlayer = game.players[game.currentPlayer]
  const opponent = game.players[1 - game.currentPlayer]

  return (
    <div className="app">
      {error && <p style={{ color: '#e74c3c', textAlign: 'center' }}>{error}</p>}
      
      <div className="hero-area">
        <div className="hero">
          <img src={getHeroImage('jake')} alt="Enemy" style={{ width: 80, height: 80, borderRadius: 8 }} />
          <div className="hero-health">P2: {opponent.health}</div>
        </div>
        <div>
          <h2>Turn {game.turn}</h2>
          <p>{game.turnPhase} - Player {game.currentPlayer + 1}'s turn</p>
        </div>
        <div className="hero">
          <img src={getHeroImage('finn')} alt="You" style={{ width: 80, height: 80, borderRadius: 8 }} />
          <div className="hero-health">P1: {currentPlayer.health}</div>
        </div>
      </div>

      <div className="game-board">
        <div className={`player-area ${game.currentPlayer === 1 ? 'current' : ''}`}>
          <h3>Opponent Hand ({opponent.hand.length} cards)</h3>
          <div className="hand">
            {opponent.hand.map((card, i) => (
              <div key={i} className="card">
                <div className="card-cost">{card.cost}</div>
                <div className="card-image" />
                <div className="card-name">?</div>
              </div>
            ))}
          </div>
          
          <h3>Opponent Landscapes</h3>
          <div className="landscapes">
            {opponent.landscapes.map((lane) => (
              <div 
                key={lane.laneIndex} 
                className={`lane ${lane.flipped ? 'flipped' : ''} ${game.turnPhase === 'ATTACK_PHASE' && lane.card && !lane.card.exhausted ? 'attackable' : ''}`}
                style={{ backgroundImage: `url(${getLandscapeImage(lane.landscape, lane.laneIndex)})`, backgroundSize: 'cover' }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (game.turnPhase === 'ATTACK_PHASE' && lane.card && !lane.card.exhausted) {
                    attackLane(lane.laneIndex)
                  }
                }}
              >
                {lane.card && (
                  <div className={`card ${lane.card.exhausted ? 'exhausted' : ''}`}>
                    <div className="card-name">{lane.card.name}</div>
                    <div className="card-stats">
                      <span className="card-atk">{lane.card.attack}</span>
                      <span className="card-hp">{lane.card.health}</span>
                    </div>
                  </div>
                )}
                <span className="landscape-label">{lane.landscape}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`player-area ${game.currentPlayer === 0 ? 'current' : ''}`}>
          <h3>Your Hand</h3>
          <div className="hand">
            {currentPlayer.hand.map((card, i) => (
              <div
                key={`${card.id}-${i}`}
                className={`card ${selectedCard === i ? 'selected' : ''} ${card.hasTurnStart ? 'has-turn-start' : ''}`}
                onClick={() => setSelectedCard(selectedCard === i ? null : i)}
                style={{ backgroundImage: `url(${getCardImage(card.id)})`, backgroundSize: 'cover' }}
              >
                <div className="card-cost">{card.cost}</div>
                {card.hasTurnStart && <div className="turn-start-badge">⚡</div>}
                <div className="card-stats">
                  <span className="card-atk">{card.attack}</span>
                  <span className="card-hp">{card.health}</span>
                </div>
              </div>
            ))}
          </div>

          {selectedCard !== null && (
            <div className="controls">
              {currentPlayer.landscapes.map((_, i) => (
                <button key={i} onClick={() => playCard(selectedCard, i)} disabled={loading}>
                  Play to Lane {i}
                </button>
              ))}
            </div>
          )}

          <h3>Your Landscapes</h3>
          <div className="landscapes">
            {currentPlayer.landscapes.map((lane) => (
              <div 
                key={lane.laneIndex} 
                className={`lane ${lane.flipped ? 'flipped' : ''} ${game.turnPhase === 'ATTACK_PHASE' && lane.card && !lane.card.exhausted ? 'attackable' : ''} ${selectedAttacker === lane.laneIndex ? 'selected' : ''}`}
                style={{ backgroundImage: `url(${getLandscapeImage(lane.landscape, lane.laneIndex)})`, backgroundSize: 'cover' }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (game.turnPhase === 'ATTACK_PHASE' && lane.card && !lane.card.exhausted) {
                    setSelectedAttacker(selectedAttacker === lane.laneIndex ? null : lane.laneIndex)
                  }
                }}
              >
                {lane.card && (
                  <div 
                    className={`card in-lane ${lane.card.exhausted ? 'exhausted' : ''}`}
                    style={{ backgroundImage: `url(${getCardImage(lane.card.id)})`, backgroundSize: 'cover' }}
                  >
                    <div className="card-stats">
                      <span className="card-atk">{lane.card.attack}</span>
                      <span className="card-hp">{lane.card.health}</span>
                    </div>
                  </div>
                )}
                <span className="landscape-label">{lane.landscape}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="controls">
        {game.turnPhase === 'TURN_START' && (
          <button className="primary" onClick={endStart} disabled={loading}>
            End Start Phase
          </button>
        )}
        {game.turnPhase === 'MAIN_PHASE' && (
          <>
            <button className="primary" onClick={startAttack} disabled={loading}>
              Start Attack
            </button>
            <button onClick={endTurn} disabled={loading}>
              End Turn
            </button>
          </>
        )}
        {game.turnPhase === 'ATTACK_PHASE' && (
          <button className="primary" onClick={endTurn} disabled={loading}>
            End Turn
          </button>
        )}
      </div>

      {game.winner !== null && (
        <div className="start-screen">
          <h1>{game.winner === 0 ? 'You Win!' : 'You Lose!'}</h1>
          <button className="primary" onClick={startGame}>Play Again</button>
        </div>
      )}
    </div>
  )
}

export default App