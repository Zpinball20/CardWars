export enum GameEvent {
  CARD_PLAYED = "card_played",
  CARD_LEFT_PLAY = "card_left_play",
  ATTACK_RESOLVED = "attack_resolved",
  TURN_START = "turn_start",
  TURN_END = "turn_end",
  FLOOP_ACTIVATED = "floop_activated",
  LANE_CHANGED = "lane_changed",
  SPELL_CAST = "spell_cast",
}

export type EventPayload = {
  [GameEvent.CARD_PLAYED]: { entity: string; playerId: number; laneIndex: number; cardId: string };
  [GameEvent.CARD_LEFT_PLAY]: { entity: string; playerId: number; laneIndex: number };
  [GameEvent.ATTACK_RESOLVED]: { attacker: string; target: string; damage: number };
  [GameEvent.TURN_START]: { playerId: number; turn: number };
  [GameEvent.TURN_END]: { playerId: number; turn: number };
  [GameEvent.FLOOP_ACTIVATED]: { entity: string; playerId: number; laneIndex: number };
  [GameEvent.LANE_CHANGED]: { entity: string; fromLane: number; toLane: number; playerId: number };
  [GameEvent.SPELL_CAST]: { entity: string; playerId: number; spellId: string };
};

type EventHandler = (payload: any) => void;

const handlers = new Map<GameEvent, EventHandler[]>();

export const eventBus = {
  subscribe<E extends GameEvent>(event: E, handler: (payload: EventPayload[E]) => void) {
    if (!handlers.has(event)) {
      handlers.set(event, []);
    }
    handlers.get(event)!.push(handler);
  },

  unsubscribe<E extends GameEvent>(event: E, handler: (payload: EventPayload[E]) => void) {
    const eventHandlers = handlers.get(event);
    if (eventHandlers) {
      const index = eventHandlers.indexOf(handler);
      if (index > -1) {
        eventHandlers.splice(index, 1);
      }
    }
  },

  publish<E extends GameEvent>(event: E, payload: EventPayload[E]) {
    const eventHandlers = handlers.get(event);
    if (eventHandlers) {
      for (const handler of eventHandlers) {
        handler(payload);
      }
    }
  },

  clear() {
    handlers.clear();
  },
};