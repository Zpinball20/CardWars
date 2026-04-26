import { World, Entity } from "../core";
import { GameEvent, eventBus } from "../events";
import {
  AttackEventComponent,
  PlacementComponent,
  BlockAdjacentComponent,
  HealthComponent,
} from "../../components/base_components";

export class CombatSystem {
  constructor(private world: World) {}

  update() {
    const attackers = this.world.query(AttackEventComponent);

    for (const attackerId of attackers) {
      const event = this.world.getComponent(attackerId, AttackEventComponent)!;
      const targetId = event.targetEntity;
      const targetPlacement = this.world.getComponent(targetId, PlacementComponent);

      if (targetPlacement && this.isProtectedByAdjacent(targetPlacement)) {
        console.log(`Attack on ${targetId} cancelled by adjacent!`);
        event.cancelled = true;
        eventBus.publish(GameEvent.ATTACK_RESOLVED, {
          attacker: attackerId,
          target: targetId,
          damage: 0,
        });
      }

      if (!event.cancelled) {
        this.applyDamage(targetId, event.damage);
        eventBus.publish(GameEvent.ATTACK_RESOLVED, {
          attacker: attackerId,
          target: targetId,
          damage: event.damage,
        });
      }

      this.world.removeComponent(attackerId, AttackEventComponent);
    }
  }

  private isProtectedByAdjacent(targetPlacement: PlacementComponent): boolean {
    const blockers = this.world.query(BlockAdjacentComponent, PlacementComponent);

    for (const blockerId of blockers) {
      const blockerPlacement = this.world.getComponent(blockerId, PlacementComponent)!;

      if (blockerPlacement.playerId === targetPlacement.playerId) {
        const diff = Math.abs(blockerPlacement.laneIndex - targetPlacement.laneIndex);
        if (diff === 1) return true;
      }
    }
    return false;
  }

  private applyDamage(targetId: Entity, damage: number) {
    const health = this.world.getComponent(targetId, HealthComponent);
    if (health) {
      health.value -= damage;
      console.log(`Entity ${targetId} health: ${health.value}`);

      if (health.value <= 0) {
        console.log(`Entity ${targetId} destroyed!`);
        const placement = this.world.getComponent(targetId, PlacementComponent);
        if (placement) {
          eventBus.publish(GameEvent.CARD_LEFT_PLAY, {
            entity: targetId,
            playerId: placement.playerId,
            laneIndex: placement.laneIndex,
          });
        }
        this.world.destroyEntity(targetId);
      }
    }
  }
}