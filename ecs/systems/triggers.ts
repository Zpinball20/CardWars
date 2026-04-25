import { World, Entity } from "../core";
import { PlacementComponent, EnterPlayHandlerComponent, TurnStartTriggerComponent } from "../../components/base_components";

type HandlerFn = (entity: Entity, placement: PlacementComponent) => void;

export class EnterPlaySystem {
  private handlers: Map<string, HandlerFn> = new Map();

  constructor(private world: World) {
    this.registerHandlers();
  }

  private registerHandlers() {
    this.handlers.set('damage_per_landscape', (e, p) => console.log(`${e}: Deal damage per cornfield`));
    this.handlers.set('flip_facedown', (e, p) => console.log(`${e}: Flip facedown`));
    this.handlers.set('return_creature', (e, p) => console.log(`${e}: Return creature`));
    this.handlers.set('ready_flooped', (e, p) => console.log(`${e}: Ready flooped`));
    this.handlers.set('move_creature', (e, p) => console.log(`${e}: Move creature`));
  }

  handle(entityId: string) {
    const handler = this.world.getComponent(entityId, EnterPlayHandlerComponent);
    if (!handler) return;

    const placement = this.world.getComponent(entityId, PlacementComponent);
    if (!placement) return;

    if (this.handlers.has(handler.handlerId)) {
      this.handlers.get(handler.handlerId)!(entityId, placement);
    }
  }
}

export class LeavePlaySystem {
  constructor(private world: World) {}
  handle(entityId: string) {
    // Stub - not using handler components yet
  }
}

export class TurnStartSystem {
  constructor(private world: World) {}
  handle(playerId: number, turn: number) {
    const triggers = this.world.query(TurnStartTriggerComponent, PlacementComponent);
    for (const entityId of triggers) {
      const placement = this.world.getComponent(entityId, PlacementComponent);
      if (placement?.playerId === playerId) {
        console.log(`${entityId}: Turn start trigger`);
      }
    }
  }
}

export class SpellCastSystem {
  constructor(private world: World) {}
  handle(entityId: string) {
    // Stub
  }
}