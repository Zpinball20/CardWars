import { World, Entity } from "../core";
import {
  CardComponent,
  PlacementComponent,
  FloopComponent,
  FloopHandlerComponent,
  HealthComponent,
  AttackComponent,
  BuildingComponent,
  FacedownLandscapeComponent,
  OwnerComponent,
} from "../../components/base_components";

type HandlerFn = (entity: Entity, placement: PlacementComponent) => void;

export class FloopAbilitySystem {
  private handlers: Map<string, HandlerFn> = new Map();

  constructor(private world: World) {
    this.registerHandlers();
  }

  private registerHandlers() {
    this.handlers.set('return_rainbow_discard', (entity, placement) => {
      console.log(`${entity}: Return rainbow from discard + gain 1 action - TODO: implement`);
    });

    this.handlers.set('destroy_building', (entity, placement) => {
      const laneIndex = placement.laneIndex;
      const playerId = placement.playerId;
      const opponentId = (playerId + 1) % 2;
      
      const candidates = this.world.query(BuildingComponent, PlacementComponent);
      let destroyed = false;
      for (const targetId of candidates) {
        const p = this.world.getComponent(targetId, PlacementComponent);
        if (p?.playerId === opponentId && p?.laneIndex === laneIndex) {
          this.world.destroyEntity(targetId);
          console.log(`${entity}: Destroyed building in lane ${laneIndex}`);
          destroyed = true;
          break;
        }
      }
      if (!destroyed) {
        console.log(`${entity}: No building found in lane ${laneIndex}`);
      }
    });

    this.handlers.set('flip_facedown', (entity, placement) => {
      const laneIndex = placement.laneIndex;
      const playerId = placement.playerId;
      
      const landscapes = this.world.query(CardComponent, PlacementComponent);
      for (const landId of landscapes) {
        const p = this.world.getComponent(landId, PlacementComponent);
        const o = this.world.getComponent(landId, OwnerComponent);
        const card = this.world.getComponent(landId, CardComponent);
        
        if (p?.playerId === playerId && p?.laneIndex === laneIndex && 
            card?.landscape === 'CORNFIELD') {
          if (!this.world.hasComponent(landId, FacedownLandscapeComponent)) {
            this.world.addComponent(landId, new FacedownLandscapeComponent());
            console.log(`${entity}: Flipped cornfield facedown`);
          }
        }
      }
    });

    this.handlers.set('move_creature', (entity, placement) => {
      console.log(`${entity}: Move creature to empty lane - TODO: implement`);
    });

    this.handlers.set('draw_per_flooped', (entity, placement) => {
      const playerId = placement.playerId;
      const floopedCount = this.world.query(FloopComponent, PlacementComponent).filter(id => {
        const p = this.world.getComponent(id, PlacementComponent);
        const f = this.world.getComponent(id, FloopComponent);
        return p?.playerId === playerId && f?.isFlooped;
      }).length;
      
      console.log(`${entity}: Draw ${floopedCount + 1} cards - TODO: implement`);
    });

    this.handlers.set('spell_from_discard', (entity, placement) => {
      console.log(`${entity}: Put spell from discard on top of deck - TODO: implement`);
    });

    this.handlers.set('damage_per_landscape', (entity, placement) => {
      const playerId = placement.playerId;
      const opponentId = (playerId + 1) % 2;
      
      const allPlacements = this.world.query(PlacementComponent, CardComponent);
      const cornfieldCount = allPlacements.filter(id => {
        const p = this.world.getComponent(id, PlacementComponent);
        const o = this.world.getComponent(id, OwnerComponent);
        const card = this.world.getComponent(id, CardComponent);
        return o?.playerId === playerId && card?.landscape === 'CORNFIELD';
      }).length;

      const heroes = this.world.query(HealthComponent, PlacementComponent);
      for (const heroId of heroes) {
        const p = this.world.getComponent(heroId, PlacementComponent);
        if (p?.playerId === opponentId && p?.laneIndex === -1) {
          const health = this.world.getComponent(heroId, HealthComponent);
          if (health) {
            health.value -= cornfieldCount;
            console.log(`${entity}: Dealt ${cornfieldCount} damage (${cornfieldCount} cornfields)`);
          }
        }
      }
    });

    this.handlers.set('copy_floop', (entity, placement) => {
      console.log(`${entity}: Copy random floop from discard - TODO: implement`);
    });

    this.handlers.set('move_adjacent', (entity, placement) => {
      const laneIndex = placement.laneIndex;
      const playerId = placement.playerId;
      
      const adjacents = [laneIndex - 1, laneIndex + 1].filter(l => l >= 0 && l <= 3);
      
      const creatures = this.world.query(AttackComponent, PlacementComponent, OwnerComponent);
      for (const creatureId of creatures) {
        const p = this.world.getComponent(creatureId, PlacementComponent);
        const o = this.world.getComponent(creatureId, OwnerComponent);
        
        if (o?.playerId === playerId && adjacents.includes(p?.laneIndex || -1)) {
          const newPlacement = this.world.getComponent(creatureId, PlacementComponent);
          if (newPlacement) {
            newPlacement.laneIndex = laneIndex;
            console.log(`${entity}: Moved ${creatureId} to lane ${laneIndex}`);
          }
        }
      }
    });
  }

  handleFloop(entityId: string) {
    const card = this.world.getComponent(entityId, CardComponent);
    if (!card) return;

    const floop = this.world.getComponent(entityId, FloopComponent);
    if (floop?.isFlooped) return;

    const placement = this.world.getComponent(entityId, PlacementComponent);
    if (!placement) return;

    const handler = this.world.getComponent(entityId, FloopHandlerComponent);
    if (handler && this.handlers.has(handler.handlerId)) {
      this.handlers.get(handler.handlerId)!(entityId, placement);
    }

    if (floop) {
      floop.isFlooped = true;
    } else {
      this.world.addComponent(entityId, new FloopComponent());
      this.world.getComponent(entityId, FloopComponent)!.isFlooped = true;
    }
  }
}