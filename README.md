# CardWars
Typescript Version of Adventure Time Card Wars

## Project Specification (MVP)

This project is a TypeScript implementation of the Adventure Time "Card Wars" trading card game, utilizing a host-authoritative state machine architecture.

### I. Core Architecture
- **Tech Stack**: TypeScript, Node.js/Vite (TSX support).
- **Architecture**: Separated Game Engine logic (`game/`) and Data Definitions (`db/`).
- **State Management**: Class-based `GameState` containing player status, lanes, and turn tracking.
- **Action Pattern**: Centralized `applyAction` dispatcher for processing player moves (Play Card, End Turn, etc.).

### II. Game Mechanics
- **Lanes**: 4 strategic lanes per player. 
  - Each lane holds a **Landscape** (e.g., Blue Plains, Cornfields).
  - Lanes act as containers for **Creatures** and **Buildings**.
  - *Extensibility*: Current implementation supports multiple cards per lane
- **HP & Victory**: Players start with **25 Health**. The goal is to reduce the opponent's health to 0.
- **Action Economy**: Players start with 2 Actions per turn (standard) to play cards or activate abilities.
- **Turn Sequence**: Ready -> Draw -> Main (Play/Floop) -> Fight -> End.

### III. Card System
- **Types**: 
  - `CREATURE`: Combat units with Attack and Health.
  - `BUILDING`: Passive utility structures in a lane.
  - `SPELL`: One-time effects.
- **Landscape Requirements**: Cards require specific face-up landscapes to be played.
- **"Floop" Logic**: Ability to exhaust a card to trigger a secondary effect, removing it from combat for that turn.

## Future State 

Based on the official "Card Wars" rules, the following features are planned for future development to transition from MVP to a full game experience:

- **Adjacency Logic**: Implement positional bonuses where creatures/buildings grant +ATK or +DEF to adjacent lanes.
- **Targeting System**: A robust system for spells and abilities to target specific creatures, buildings, or landscapes.
- **Replacement Rules**: Logic to allow playing a new creature over an existing one (discarding the old one without "destroying" it).
- **Direct Damage**: Automated resolution for "Empty Lane" scenarios where creatures deal direct HP damage to the opponent.
- **Frozen Tokens**: Tokens that lock landscapes, preventing new creatures from being played until a card is discarded to thaw them.
- **Landscape Flipping**: Mechanics to flip landscapes face-down, temporarily disabling them and reducing available landscape count.
- **Movement**: Spells/abilities that allow creatures or buildings to change lanes.
- **Hero System**: Unique hero cards (Finn, Jake, Princess Bubblegum) with persistent passives or "Floop" abilities.
- **Rainbow Cards**: Special cards that can be played on any landscape combination.
- **Costed Abilities (`>>>`)**: Implementing sub-actions within cards that require a specific cost (Actions, Discards, or Exhaustion) to trigger.
- **Deck Validation**: Enforce 40-card minimum and 3-copy maximum per card.
- **Landscape Drafting**: Rules for selecting exactly 4 landscape tiles during setup to define the player's resource pool.

## Full Game (E2E) TDD
To validate the future state, we need a complete simulation test that spans from initialization to a win condition.

### Test Case: `test_full_game_to_victory`
1. **Setup**:
   - Initialize two players (P1, P2) with 25 HP.
   - P1 Deck: 40 cards (mixture of Blue Plains/Cornfields).
   - P2 Deck: 40 cards (mixture of Blue Plains/Cornfields).
   - P1 Landscapes: [Blue, Blue, Corn, Corn].
   - P2 Landscapes: [Blue, Blue, Corn, Corn].

2. **Sequence of Events**:
   - **T1 (P1)**: 
     - Draw automatic card.
     - Play `Cool Dog` (ATK 2, Cost 2) on Lane 1 (Blue).
     - End Turn -> Fight Phase -> Lane 1 is empty on P2 side -> P2 takes 2 damage (HP: 23).
   - **T2 (P2)**:
     - Draw automatic card.
     - Play `The Pig` (ATK 1, Cost 1) on Lane 2 (Corn).
     - End Turn -> Fight Phase -> Lane 2 is empty on P1 side -> P1 takes 1 damage (HP: 24).
   - **T3-T10**:
     - Continue state transitions where P1 maintains board presence.
     - P1 plays `Ancient Scholar` (ATK 1, Cost 3) on Lane 1 (replacing old creature or in new slot if multiple entities supported).
     - P1 Floops `Cool Dog` to trigger an ability (skipping its attack for one turn).

3. **Win Condition Validation**:
   - P1 deals remaining aggregate ATK damage over subsequent turns.
   - Assert `state.winner === 0` when P2's HP reaches 0.
   - Assert game state transitions to `FINISHED` and prevents further actions.

## Logic Requirements for E2E
| Feature | TDD Expectation |
| :--- | :--- |
| **Deck Depletion** | If a player cannot draw, the game continues until HP reaches 0 (or a deck-out rule is decided). |
| **Simultaneous Combat** | If P1 and P2 both have creatures in Lane 1, ensure HP is reduced for *both* creatures simultaneously during the Fight phase. |
| **Action Reset** | Ensure `actionsAvailable` resets to 2 at the start of every Ready phase. |
| **Health Clipping** | HP should not drop below 0; ensure the game terminates immediately. |
