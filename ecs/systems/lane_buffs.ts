import { World, Entity } from "../core";
import {
  BuildingComponent,
  PlacementComponent,
  AttackComponent,
  LaneBuffComponent,
  AttackModifierComponent,
  DefenseModifierComponent,
} from "../../components/base_components";

export class LaneBuffSystem {
  constructor(private world: World) {}

  apply() {
    const buildings = this.world.query(BuildingComponent, PlacementComponent);

    for (const buildingId of buildings) {
      const placement = this.world.getComponent(buildingId, PlacementComponent);
      const laneBuff = this.world.getComponent(buildingId, LaneBuffComponent);

      const creatures = this.world.query(AttackComponent, PlacementComponent);
      for (const creatureId of creatures) {
        const creaturePlacement = this.world.getComponent(creatureId, PlacementComponent);
        if (
          creaturePlacement?.playerId === placement?.playerId &&
          creaturePlacement?.laneIndex === placement?.laneIndex
        ) {
          if (laneBuff?.attackBonus) {
            this.applyAttackBonus(creatureId, laneBuff.attackBonus, buildingId);
          }
          if (laneBuff?.defenseBonus) {
            this.applyDefenseBonus(creatureId, laneBuff.defenseBonus, buildingId);
          }
        }
      }
    }
  }

  private applyAttackBonus(entity: Entity, bonus: number, source: string) {
    const existing = this.world.getComponent(entity, AttackModifierComponent);
    if (existing) {
      existing.modifier += bonus;
      existing.source = source;
    } else {
      this.world.addComponent(entity, new AttackModifierComponent(bonus, source));
    }
  }

  private applyDefenseBonus(entity: Entity, bonus: number, source: string) {
    const existing = this.world.getComponent(entity, DefenseModifierComponent);
    if (existing) {
      existing.modifier += bonus;
      existing.source = source;
    } else {
      this.world.addComponent(entity, new DefenseModifierComponent(bonus, source));
    }
  }
}