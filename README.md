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
