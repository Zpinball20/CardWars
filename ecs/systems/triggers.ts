import { World, Entity } from "../core";
import {
  PlacementComponent,
  EnterPlayHandlerComponent,
  TurnStartTriggerComponent,
  HealthComponent,
  AttackComponent,
  FacedownLandscapeComponent,
  OwnerComponent,
  FloopComponent,
  CardComponent,
} from "../../components/base_components";

type HandlerFn = (entity: Entity, placement: PlacementComponent) => void;

export class EnterPlaySystem {
  private handlers: Map<string, HandlerFn> = new Map();

  constructor(private world: World) {
    this.registerHandlers();
  }

  private registerHandlers() {
    this.handlers.set('damage_per_landscape', (entity, placement) => {
      const playerId = placement.playerId;
      const opponentId = (playerId + 1) % 2;
      
      const landscapes = this.world.query(PlacementComponent, OwnerComponent);
      const cornfieldCount = landscapes.filter(l => {
        const p = this.world.getComponent(l, PlacementComponent);
        const o = this.world.getComponent(l, OwnerComponent);
        const card = this.world.getComponent(l, CardComponent);
        return o?.playerId === playerId && card?.landscape === 'CORNFIELD';
      }).length;

      const heroes = this.world.query(HealthComponent, PlacementComponent);
      for (const heroId of heroes) {
        const heroPlacement = this.world.getComponent(heroId, PlacementComponent);
        if (heroPlacement?.playerId === opponentId && heroPlacement.laneIndex === -1) {
          const health = this.world.getComponent(heroId, HealthComponent);
          if (health) {
            health.value -= cornfieldCount;
            console.log(`${entity}: Dealt ${cornfieldCount} damage to opponent (${cornfieldCount} cornfields)`);
          }
        }
      }
    });

    this.handlers.set('flip_facedown', (entity, placement) => {
      const playerId = placement.playerId;
      const laneIndex = placement.laneIndex;
      
      const entities = this.world.query(PlacementComponent, CardComponent);
      for (const entityId of entities) {
        const p = this.world.getComponent(entityId, PlacementComponent);
        const o = this.world.getComponent(entityId, OwnerComponent);
        const card = this.world.getComponent(entityId, CardComponent);
        
        if (p?.playerId === playerId && p?.laneIndex === laneIndex && 
            card?.landscape === 'CORNFIELD' && !this.world.hasComponent(entityId, FacedownLandscapeComponent)) {
          this.world.addComponent(entityId, new FacedownLandscapeComponent());
          console.log(`${entity}: Flipped cornfield facedown`);
        }
      }
    });

    this.handlers.set('return_creature', (entity, placement) => {
      console.log(`${entity}: Return creature to hand - TODO: implement hand return`);
    });

    this.handlers.set('ready_flooped', (entity, placement) => {
      const playerId = placement.playerId;
      const floopedCards = this.world.query(FloopComponent, PlacementComponent);
      
      for (const cardId of floopedCards) {
        const p = this.world.getComponent(cardId, PlacementComponent);
        if (p?.playerId === playerId) {
          const floop = this.world.getComponent(cardId, FloopComponent);
          if (floop) {
            floop.isFlooped = false;
            console.log(`${entity}: Ready flooped creature ${cardId}`);
          }
        }
      }
    });

    this.handlers.set('move_creature', (entity, placement) => {
      console.log(`${entity}: Move creature to adjacent lane - TODO: implement`);
    });
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
  handle(entityId: string) {}
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
  handle(entityId: string) {}
}